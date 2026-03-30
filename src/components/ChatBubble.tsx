import { ChatMessage } from "@/lib/types";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <motion.div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-secondary text-secondary-foreground" : "bg-gradient-primary text-primary-foreground"
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </motion.div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-shadow ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-card border border-border text-card-foreground hover:border-primary/20 hover:shadow-glow"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
