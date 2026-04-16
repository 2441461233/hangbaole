import { motion } from "framer-motion";
import { Skull } from "lucide-react";

export default function FluidLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 border-[6px] border-dashed border-black rounded-full scale-150 opacity-20"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1.1, 1],
            rotate: [0, -10, 10, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="bg-black text-white p-6 rounded-full relative z-10"
        >
          <Skull className="w-16 h-16" strokeWidth={2.5} />
        </motion.div>
        
        {/* Action lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-8 bg-black origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 60}deg)`,
              marginTop: "-40px"
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1.5, 0],
              translateY: ["-10px", "-30px", "-40px"]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-2xl font-black uppercase tracking-widest bg-black text-yellow-400 px-6 py-2 border-4 border-black transform rotate-2"
      >
        AI 正在发疯计算中...
      </motion.div>
    </div>
  );
}
