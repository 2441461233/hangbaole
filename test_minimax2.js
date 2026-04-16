const { SYSTEM_PROMPT } = require('./src/lib/prompts.js');
const fetch = require('node-fetch');

async function test() {
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.minimax.chat/v1";
  const modelName = process.env.OPENAI_MODEL_NAME || "minimax-text-01";
  const apiKey = process.env.OPENAI_API_KEY || "";
  
  if (!apiKey) {
    console.log("No API key");
    return;
  }

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
        { role: "user", content: "试试" }
      ],
      temperature: 0.7,
    }),
  });

  const text = await response.text();
  console.log("API Response:", text);
}
test();
