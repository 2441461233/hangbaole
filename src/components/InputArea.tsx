import { useState, useRef, useEffect } from "react";
import { Send, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  onSend: (text: string) => void;
}

export default function InputArea({ onSend }: InputAreaProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSend(text);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 relative">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-8 h-8 text-black fill-yellow-400" strokeWidth={2.5} />
        <h1 className="text-4xl font-black tracking-tight uppercase transform -rotate-2">
          今天怎么了？
        </h1>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-black rounded-2xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
        
        <div className="relative bg-white border-4 border-black rounded-2xl overflow-hidden flex flex-col transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入最近发生的一件事，呼叫赛博战友来锐评..."
            className="w-full p-6 text-xl font-bold resize-none outline-none min-h-[120px] bg-transparent placeholder:text-gray-400 leading-relaxed"
          />
          
          <div className="p-4 flex justify-between items-center bg-gray-50 border-t-4 border-black">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Shift + Enter 换行
            </span>
            
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 font-black text-xl uppercase tracking-wider rounded-xl transition-all duration-200",
                "border-4 border-black",
                text.trim()
                  ? "bg-[#ff0055] text-white shadow-comic-sm hover:shadow-comic-active active:translate-x-1 active:translate-y-1 active:shadow-none"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400"
              )}
            >
              发 射
              <Send className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
