require("dotenv").config();
const express = require("express");
const path = require("path");
const sharp = require("sharp");
const app = express();
const history = require("connect-history-api-fallback");
const cors = require("cors");
const { fetchStreamedChatContent } = require("streamed-chatgpt-api");
const multer = require("multer");

app.use(history());

app.use(
  cors({
    origin: `${process.env.VUE_APP_API_BASE_URL}`,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "dist/uploads/");
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname + "-" + Date.now();
    const extension = path.extname(file.originalname);
    cb(null, filename + extension);
  },
});

app.get("/", function (req, res) {
  res.send("来了!");
});

const upload = multer({ storage: storage });

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (path.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp");
      }
    },
  })
);

app.post("/uploads", upload.single("image"), (req, res) => {
  console.log("Received file upload request");

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${process.env.VUE_APP_API_BASE_URL}/uploads/${req.file.filename}`;
  const smallFileUrl = `${process.env.VUE_APP_API_BASE_URL}/uploads/${
    path.parse(req.file.filename).name
  }-s${path.extname(req.file.originalname)}`;

  // Create a smaller version of the image using sharp
  const smallImageFilename = `dist/uploads/${
    path.parse(req.file.filename).name
  }-s${path.extname(req.file.originalname)}`;
  sharp(req.file.path)
    .resize(200) // Change this value according to your needs
    .toFile(smallImageFilename, (err, info) => {
      if (err) {
        console.error("Error creating small image:", err);
        return res.status(500).json({ message: "Error creating small image" });
      }
      res.json({ path: fileUrl, smallPath: smallFileUrl });
    });
});

// ... Rest of your code

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
