-- Allow users to delete their own chat sessions
CREATE POLICY "Users can delete their own sessions"
ON public.chat_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own chat messages
CREATE POLICY "Users can delete their own messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);