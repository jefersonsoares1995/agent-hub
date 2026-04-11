
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

  -- Upsert: create balance row if missing
  INSERT INTO public.credit_balances (user_id, balance)
  VALUES (v_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.credit_balances
  SET balance = balance + p_amount
  WHERE user_id = v_user_id
  RETURNING balance INTO v_new_balance;

  INSERT INTO public.credit_transactions (user_id, amount, reason, description)
  VALUES (v_user_id, p_amount, p_reason, p_description);

  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- Also fix deduct_credits to handle missing balance row
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

  -- Create balance row if missing (starts at 0)
  INSERT INTO public.credit_balances (user_id, balance)
  VALUES (v_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT balance INTO v_balance
  FROM public.credit_balances
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF v_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits');
  END IF;

  UPDATE public.credit_balances
  SET balance = balance - p_amount
  WHERE user_id = v_user_id;

  INSERT INTO public.credit_transactions (user_id, amount, reason, description)
  VALUES (v_user_id, -p_amount, 'usage', p_description)
  RETURNING id INTO v_tx_id;

  RETURN json_build_object('success', true, 'new_balance', v_balance - p_amount, 'transaction_id', v_tx_id);
END;
$$;
