const http = require('http');

async function test() {
  const req = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: '试试' })
  });
  const text = await req.text();
  console.log("Status:", req.status);
  console.log("Response:", text);
}

test();
