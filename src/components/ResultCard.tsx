import { useRef, useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { toPng } from "html-to-image";
import RadarChart from "./RadarChart";
import { cn } from "@/lib/utils";

export interface RadarStatDetail {
  score: number;
  badge: string;
  reason: string;
}

export interface ResultData {
  original_input: string;
  status: "夯爆了" | "拉完了";
  quote: string;
  radar_stats: {
    hangla?: RadarStatDetail;
    probability?: RadarStatDetail;
    caotai?: RadarStatDetail;
    compensation?: RadarStatDetail;
    reversal?: RadarStatDetail;
    npc?: RadarStatDetail;
    cash_value?: RadarStatDetail;
    crab_walk?: RadarStatDetail;
  };
}

export default function ResultCard({ data, onReset }: { data: ResultData; onReset: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const isGood = data.status === "夯爆了";

  const handleSave = async () => {
    if (cardRef.current) {
      try {
        // 在截屏前，临时移除 hidden 类，显示原始输入
        const inputBlock = cardRef.current.querySelector('#original-input-block') as HTMLElement;
        if (inputBlock) {
          inputBlock.style.display = 'block';
        }

        const dataUrl = await toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 2,
          style: { transform: "none", margin: "0" },
        });

        // 截屏后，恢复隐藏状态
        if (inputBlock) {
          inputBlock.style.display = 'none';
        }

        // 尝试转换为 File 对象以供原生分享/保存使用
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `赛博战友-${data.status}.png`, { type: "image/png" });

          // 如果支持 Web Share API 且支持分享文件（通常是移动端，会弹出系统原生菜单，包含“保存到相册”权限请求）
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "赛博诊断书",
              text: "快来看看我的赛博诊断书！"
            });
            return; // 成功后退出，不再执行传统下载
          }
        } catch (shareErr) {
          console.log("原生分享/保存不可用，降级为普通下载", shareErr);
        }

        // 降级：传统的 Web <a> 标签下载（桌面端或不支持 share API 的环境）
        const link = document.createElement("a");
        link.download = `赛博战友-${data.status}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("截图失败", err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 截图区域 */}
      <div 
        ref={cardRef} 
        className="bg-white border-[6px] border-black shadow-comic rounded-3xl p-6 relative overflow-hidden"
      >
        {/* 背景点缀 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl opacity-30 -z-10 transform -translate-x-1/2 translate-y-1/2" />

        <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-gray-500 mb-1">
              #赛博诊断书
            </div>
            <div className="text-xl font-bold">DATE: {new Date().toLocaleDateString()}</div>
          </div>
          <div 
            className={cn(
              "px-4 py-2 border-4 border-black font-black text-2xl transform rotate-3",
              isGood ? "bg-[#00ff88] text-black" : "bg-black text-white"
            )}
          >
            {data.status}
          </div>
        </div>

        {/* 原始输入引言 (默认隐藏，仅截图时显示) */}
        <div 
          id="original-input-block"
          className="mb-4 p-4 bg-gray-100 border-4 border-dashed border-gray-300 rounded-xl relative"
          style={{ display: 'none' }}
        >
          <div className="absolute -top-3 left-4 bg-white px-2 text-sm font-black text-gray-500">
            {isGood ? "高光时刻" : "荒诞事件"}
          </div>
          <p className="text-gray-700 font-bold">
            {data.original_input}
          </p>
        </div>

        {/* AI 锐评 */}
        <div className="mb-6 relative">
          <div className={cn(
            "absolute -left-4 top-0 bottom-0 w-2",
            isGood ? "bg-[#00ff88]" : "bg-black"
          )} />
          <p className="text-2xl font-bold leading-relaxed pl-4">
            &quot;{data.quote}&quot;
          </p>
        </div>

        <div className="border-4 border-black bg-gray-50 p-2 rounded-xl mb-4 relative">
          <div className={cn(
            "absolute -top-4 -right-4 text-white px-3 py-1 font-black border-2 border-black transform rotate-12 z-10",
            isGood ? "bg-[#00ff88] text-black" : "bg-[#ff0055]"
          )}>
            状态扫描
          </div>
          <RadarChart stats={data.radar_stats} status={data.status} />
        </div>
        
        {/* 维度详细说明（诊断报告） */}
        <div className="flex flex-col gap-2 mb-2">
          {Object.entries(data.radar_stats).map(([key, stat]) => {
            if (!stat) return null;
            
            const labels: Record<string, string> = {
              hangla: "⚡️ 夯拉值",
              caotai: "🛖 草台班子",
              probability: isGood ? "🎲 天选概率" : "🎲 命中概率",
              compensation: "💰 补偿款",
              reversal: "📈 反转潜力",
              npc: "🙇 NPC敬畏度",
              cash_value: "💰 现金等价物",
              crab_walk: "🦀 横着走指数",
            };
            const isExpanded = expandedKey === key;
            const isSpecialValue = key === 'compensation' || key === 'cash_value';
            const isDays = key === 'crab_walk';

            return (
              <div 
                key={key} 
                className="border-b-2 border-dashed border-gray-300 pb-2 last:border-0 cursor-pointer select-none group"
                onClick={() => setExpandedKey(isExpanded ? null : key)}
                onMouseEnter={() => setExpandedKey(key)}
                onMouseLeave={() => setExpandedKey(null)}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-black whitespace-nowrap">{labels[key]}</span>
                  <div className="text-right flex items-center gap-2">
                    {!isSpecialValue && (
                      <>
                        <span className="text-xs font-bold text-gray-500 hidden sm:inline-block">({stat.badge})</span>
                        <span className="text-xs font-bold text-gray-500 sm:hidden line-clamp-1 max-w-[120px]">({stat.badge})</span>
                      </>
                    )}
                    <span className={cn(
                      "font-black text-right",
                      isSpecialValue ? (isGood ? "text-[#00ff88] drop-shadow-md text-xl" : "text-[#ff0055] text-xl") : "text-lg w-12"
                    )}>
                      {isSpecialValue ? stat.badge : (isDays ? `${stat.score}天` : `${stat.score}%`)}
                    </span>
                  </div>
                </div>
                {/* 展开的吐槽详情 */}
                <div 
                  className={cn(
                    "mt-2 text-sm font-bold text-gray-800 bg-[#ffde59] p-3 rounded-xl border-2 border-black transition-all duration-200",
                    isExpanded ? "block animate-in fade-in slide-in-from-top-1" : "hidden"
                  )}
                >
                  &quot;{stat.reason}&quot;
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t-4 border-dashed border-black flex justify-start items-center text-sm font-black uppercase">
          <span>@赛博战友</span>
        </div>
      </div>

      {/* 按钮区域（不包含在截图中） */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#00ff88] border-4 border-black px-6 py-4 rounded-xl font-black text-xl uppercase shadow-comic-sm hover:shadow-comic-active active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Download strokeWidth={3} />
          保存档案
        </button>
        <button
          onClick={onReset}
          className="flex-none bg-white border-4 border-black px-6 py-4 rounded-xl font-black text-xl uppercase shadow-comic-sm hover:shadow-comic-active active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
        >
          <RotateCcw strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
