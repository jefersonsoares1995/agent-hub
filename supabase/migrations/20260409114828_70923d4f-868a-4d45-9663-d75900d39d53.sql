
-- Remove dangerous INSERT/UPDATE policies on credit_balances
DROP POLICY IF EXISTS "Users can insert their own balance" ON public.credit_balances;
DROP POLICY IF EXISTS "Users can update their own balance" ON public.credit_balances;

-- Remove dangerous INSERT policy on credit_transactions
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;

-- Create secure RPC to deduct credits (SECURITY DEFINER so it bypasses RLS)
CREATE OR REPLACE FUNCTION public.deduct_credits(p_amount integer, p_description text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_balance integer;
  v_tx_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Get current balance with row lock
  SELECT balance INTO v_balance
  FROM public.credit_balances
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No balance record');
  END IF;

  IF v_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits');
  END IF;

  -- Deduct
  UPDATE public.credit_balances
  SET balance = balance - p_amount
  WHERE user_id = v_user_id;

  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, reason, description)
  VALUES (v_user_id, -p_amount, 'usage', p_description)
  RETURNING id INTO v_tx_id;

  RETURN json_build_object('success', true, 'new_balance', v_balance - p_amount, 'transaction_id', v_tx_id);
END;
$$;

-- Create secure RPC to add credits (for purchases/bonuses)
CREATE OR REPLACE FUNCTION public.add_credits(p_amount integer, p_reason text, p_description text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_new_balance integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  IF p_reason NOT IN ('purchase', 'bonus') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid reason');
  END IF;

  UPDATE public.credit_balances
  SET balance = balance + p_amount
  WHERE user_id = v_user_id
  RETURNING balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No balance record');
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, reason, description)
  VALUES (v_user_id, p_amount, p_reason, p_description);

  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;
