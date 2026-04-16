"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputArea from "./InputArea";
import ResultCard, { ResultData } from "./ResultCard";
import FluidLoader from "./FluidLoader";

export type AppState = "idle" | "loading" | "result";

export default function CyberComradeApp() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setAppState("loading");
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setResultData(data);
      setAppState("result");
    } catch (e) {
      console.error(e);
      // Fallback for demo or when API fails
      setResultData({
        original_input: text,
        status: "夯爆了",
        quote: "这破烂世界终于给你发福利了！拿好这波天降富贵，出去吃顿好的！",
        radar_stats: {
          hangla: { score: 98, badge: "夯爆程度超越99%打工人", reason: "干得漂亮！" },
          npc: { score: 90, badge: "99%的同行会感到郁郁", reason: "方圆十里内的前同事已经嫉妒到开始啃桌子了。" },
          probability: { score: 5, badge: "天选之子命中率0.01%", reason: "这种好事发生概率极低，建议出门左转买彩票。" },
          cash_value: { score: 100, badge: "¥10,000", reason: "这波爽感等价于一万块心理按摩费，血赚！" },
          crab_walk: { score: 7, badge: "嚣张期限：7天", reason: "这7天你能在公司横着走，7天后请乖乖收起钳子继续当牛马。" }
        }
      });
      setAppState("result");
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setResultData(null);
  };

  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {appState === "idle" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-lg"
          >
            <InputArea onSend={handleSend} />
          </motion.div>
        )}

        {appState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full flex justify-center"
          >
            <FluidLoader />
          </motion.div>
        )}

        {appState === "result" && resultData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-full max-w-lg"
          >
            <ResultCard data={resultData} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
