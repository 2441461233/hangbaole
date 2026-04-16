import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 30;

const apiKey = process.env.OPENAI_API_KEY || "";
// MiniMax M2.7 模型名通常为 minimax-text-01 或 abab6.5s-chat 等
const modelName = process.env.OPENAI_MODEL_NAME || "minimax-text-01";
const baseURL = process.env.OPENAI_BASE_URL || "https://api.minimax.chat/v1";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 因为各家厂商（特别是 MiniMax）对 OpenAI schema 的支持不一定 100% 兼容 Vercel AI SDK 的 object-generation，
    // 我们这里直接通过原生的 fetch 发起调用，确保它一定能跑通。
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // MiniMax 有时候可能会带上 Markdown 的 json 标签，需要清洗掉
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n?/, '').replace(/```$/, '').trim();
    }
    
    const object = JSON.parse(content);
    // 把用户的原始输入透传回去，前端需要用于展示
    object.original_input = prompt;

    return Response.json(object);
  } catch (error) {
    console.error("============= AI Generation Error =============");
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }
    console.error("===============================================");
    
    return new Response(JSON.stringify({ 
      error: "赛博大脑短路了，请稍后再试",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
