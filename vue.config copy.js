const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./", // 这一行修改了路径
  outputDir: "dist",
  devServer: {
    historyApiFallback: true,
  },

  
});
