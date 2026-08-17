// server.js (ローカルでもRailway上でも動くバックエンド例)
import 'dotenv/config'; // ローカルでは.envを読み込む(Railway上ではVariablesが優先される)
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
 
// APIキーはコードに書かず、環境変数から読み込む
const API_KEY = process.env.ANTHROPIC_API_KEY;
 
app.post('/chat', async (req, res) => {
  const { userInput, systemPrompt } = req.body;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY, // フロントには絶対に渡さない
      'anthropic-version': '2023-06-01', // ← 必須ヘッダー（これが無いと毎回invalid_request_errorになる）
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userInput }]
    })
  });
  const data = await response.json();
  res.json(data);
});
app.listen(process.env.PORT || 3000);
