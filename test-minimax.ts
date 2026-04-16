import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';

// 加载 .env 文件
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.minimax.chat/v1';
const modelName = process.env.OPENAI_MODEL_NAME || 'minimax-text-01';

console.log('--- Config ---');
console.log('Base URL:', baseURL);
console.log('Model Name:', modelName);
console.log('API Key:', apiKey ? 'Loaded (hidden)' : 'MISSING!');
console.log('--------------\n');

const openai = createOpenAI({
  apiKey: apiKey || '',
  baseURL,
});

async function main() {
  console.log('Sending request to MiniMax...');
  try {
    const { object } = await generateObject({
      model: openai(modelName),
      system: 'You are a helpful assistant. Always return JSON.',
      prompt: 'Say hello world and give me a random number between 1 and 10.',
      schema: z.object({
        message: z.string(),
        number: z.number(),
      }),
    });

    console.log('✅ Success! Response:');
    console.log(JSON.stringify(object, null, 2));
  } catch (error) {
    console.error('❌ Error:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}

main();
