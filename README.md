# 备课宝前端和接口命名规范

## 基础

前端开发是基于VUE3.2/vue-router/Node.js/ElementUI2.3等基础之上开发的。

## 文件名

单文件组件（Single File Components）的文件名应使用大驼峰方式，例如：MyComponent.vue。动词或者名词首字母皆为大写。

## 函数名

函数名称应该是动词，反映其功能，例如：fetchData、submitForm。
使用小驼峰方式命名方式，例如：getUserProfile。第一个单词首字母小写，后面都是大写首字母。

## 变量名

script 中推荐使用小驼峰方式来命名变量，例如：myVariable。
VUE template 模板中使用连字符“-”,例如：el-button

## 接口

### 使用 RESTful 风格命名：
RESTful 是一种常用的 API 设计风格，强调资源的表达和状态转换。在 RESTful 风格的 API 中，接口以资源为核心，使用标准的 HTTP 动词（GET、POST、PUT、DELETE 等）表示操作。资源名应该是名词，通常使用复数形式。例如：

GET /users：获取用户列表
GET /users/{id}：获取指定 ID 的用户信息
POST /users：创建新用户
PUT /users/{id}：更新指定 ID 的用户信息
DELETE /users/{id}：删除指定 ID 的用户

### 使用小写字母和连字符：
接口路径中的单词应使用小写字母，并使用连字符（-）分隔。避免使用大写字母、下划线（_）或驼峰命名。例如：

/user-profiles
/order-details

### 在需要的时候使用版本号

如果 API 可能经历多次版本更迭，可以在接口路径中加入版本号，以便客户端选择使用合适的版本。例如：

/v1/users
/v2/users
