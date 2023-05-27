const express = require("express");
const path = require("path");
const app = express();
const history = require("connect-history-api-fallback");
const cors = require("cors");

let OpenAI;


import("openai-streams").then((module) => {
  OpenAI = module.default;
});

// 使用 history 中间件
app.use(history());

// 启用 CORS
app.use(cors());

// 静态资源目录
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/openai", async (req, res) => {
  if (!OpenAI) {
    try {
      res.status(500).send("OpenAI module not loaded yet");
      return;
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

    const stream = await OpenAI(
      "chat",
      {
        model: "gpt-3.5-turbo",
        messages: req.body.messages,
        temperature: 1,
      },
      {
        mode: "raw",
        apiKey: process.env.OPENAI_API_KEY,
      }
    );

    stream.pipe(res);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
