import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
  reason: string;
}

export interface RadarStats {
  // 通用
  hangla?: { score: number; badge: string; reason: string };
  probability?: { score: number; badge: string; reason: string };
  // 拉完了专属
  caotai?: { score: number; badge: string; reason: string };
  compensation?: { score: number; badge: string; reason: string };
  reversal?: { score: number; badge: string; reason: string };
  // 夯爆了专属
  npc?: { score: number; badge: string; reason: string };
  cash_value?: { score: number; badge: string; reason: string };
  crab_walk?: { score: number; badge: string; reason: string };
}

export default function RadarChart({ stats, status }: { stats: RadarStats; status: "夯爆了" | "拉完了" }) {
  const isGood = status === "夯爆了";
  
  const data: RadarData[] = isGood 
    ? [
        { subject: "夯拉值⚡️", A: stats.hangla?.score || 0, fullMark: 100, reason: stats.hangla?.reason || "" },
        { subject: "NPC敬畏度🙇", A: stats.npc?.score || 0, fullMark: 100, reason: stats.npc?.reason || "" },
        { subject: "天选命中率🎲", A: stats.probability?.score || 0, fullMark: 100, reason: stats.probability?.reason || "" },
        { subject: "现金等价物💰", A: stats.cash_value?.score || 0, fullMark: 100, reason: stats.cash_value?.reason || "" },
        // 注意：蟹行指数（crab_walk）虽然是天数，但在雷达图上为了美观我们需要将其映射到 0-100 的刻度。
        // 比如最多 30 天横着走，score 取 min(crab_walk.score * 3.3, 100)
        { subject: "横着走指数🦀", A: Math.min((stats.crab_walk?.score || 0) * 3.3, 100), fullMark: 100, reason: stats.crab_walk?.reason || "" },
      ]
    : [
        { subject: "夯拉值⚡️", A: stats.hangla?.score || 0, fullMark: 100, reason: stats.hangla?.reason || "" },
        { subject: "草台班子🛖", A: stats.caotai?.score || 0, fullMark: 100, reason: stats.caotai?.reason || "" },
        { subject: "命中概率🎲", A: stats.probability?.score || 0, fullMark: 100, reason: stats.probability?.reason || "" },
        { subject: "世界补偿款💰", A: stats.compensation?.score || 0, fullMark: 100, reason: stats.compensation?.reason || "" },
        { subject: "反转潜力📈", A: stats.reversal?.score || 0, fullMark: 100, reason: stats.reversal?.reason || "" },
      ];

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#000" strokeWidth={3} gridType="polygon" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#000', fontSize: 14, fontWeight: 900, fontFamily: 'system-ui' }} 
          />
          <Radar
            name="精神状态"
            dataKey="A"
            stroke="#000"
            strokeWidth={4}
            fill={isGood ? "#00ff88" : "#ff0055"}
            fillOpacity={0.8}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
