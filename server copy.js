const express = require("express");
const path = require("path");
const app = express();
const history = require("connect-history-api-fallback");

// 使用 history 中间件
app.use(history());

// 静态资源目录
app.use(express.static(path.join(__dirname, "dist")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
