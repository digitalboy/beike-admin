require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const history = require("connect-history-api-fallback");
const cors = require("cors");
const { fetchStreamedChatContent } = require("streamed-chatgpt-api");
const multer = require("multer");

// 使用 history 中间件
app.use(history());

// 启用 CORS
app.use(
  cors({
    // origin: "http://localhost:8080", // 允许来自所有域名的请求
    origin: `${process.env.VUE_APP_API_BASE_URL}`,
    methods: ["GET", "POST"], // 设置允许的HTTP请求类型
    credentials: true, // 允许服务器发送Cookie
  })
);

// 解析 JSON 请求体
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // 使用原始文件名和原始扩展名
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

app.get("/", function (req, res) {
  res.send("来了!");
});


const upload = multer({ storage: storage });

// 静态资源目录
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      }
    },
  })
);

app.post("/uploadimg", upload.single("image"), (req, res) => {
  console.log("Received file upload request");
  // req.file 是 'image' 文件
  // req.body 将包含文本域，如果存在的话
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // 服务器可以通过 '/uploads/filename.ext' 访问到上传的文件
  const fileUrl = `${process.env.VUE_APP_API_BASE_URL}/uploads/${req.file.filename}`;

  res.json({ path: fileUrl });
});

app.post("/api/openai", async (req, res) => {
  console.log("Received request:", req.body);

  try {
    console.log("Creating stream...");
    // 使用 fetchStreamedChatContent 函数创建一个流，该函数需要你的 OpenAI API 密钥，以及一个对象，该对象包含你想要发送给 OpenAI API 的参数
    fetchStreamedChatContent(
      {
        apiKey: process.env.OPENAI_API_KEY,
        messageInput: req.body.messages,
        temperature: 1,
        fetchTimeout: 20000, // 设置请求超时时间为30秒
        readTimeout: 20000, // 设置读取超时时间为30秒
        totalTime: 60000, // 设置总超时时间为60秒
      },
      (content) => {
        // onResponse
        console.log("Received data from stream:", content);
        // 将数据作为服务器发送事件（Server-Sent Events）发送到客户端
        res.write(
          `data: ${JSON.stringify({
            choices: [{ delta: { content: content } }],
          })}\n\n`
        );
      },
      () => {
        // onFinish
        console.log("Stream ended");
        // 当流结束时，结束响应
        res.end();
      },
      (error) => {
        // onError
        console.error("Error:", error);
        // 如果出现错误，发送一个带有错误消息的 500 响应
        res.status(500).json({ message: error.message });
      }
    );
  } catch (error) {
    console.error("Error:", error);
    // 如果出现错误，发送一个带有错误消息的 500 响应
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
