import { ChatMessage } from "@/lib/types";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-secondary text-secondary-foreground" : "bg-gradient-primary text-primary-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-card border border-border text-card-foreground"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
