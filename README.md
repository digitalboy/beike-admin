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

### 使用 RESTful 风格命名

RESTful 是一种常用的 API 设计风格，强调资源的表达和状态转换。在 RESTful 风格的 API 中，接口以资源为核心，使用标准的 HTTP 动词（GET、POST、PUT、DELETE 等）表示操作。资源名应该是名词，通常使用复数形式。例如：

GET /users：获取用户列表
GET /users/{id}：获取指定 ID 的用户信息
POST /users：创建新用户
PUT /users/{id}：更新指定 ID 的用户信息
DELETE /users/{id}：删除指定 ID 的用户

### 使用小写字母和连字符

接口路径中的单词应使用小写字母，并使用连字符（-）分隔。例如：
/user-profiles
/order-details

No！不要使用大写字母、下划线（_）或驼峰命名。

### 在需要的时候使用版本号

如果 API 可能经历多次版本更迭，可以在接口路径中加入版本号，以便客户端选择使用合适的版本。例如：

/v1/users
/v2/users

# 管理员登录后，后端返回json格式(POST)

```json
{
  "code": "0000",
  "data": {
    "userInfo": {
      "username": "zhangsan",
      "userId": 1,
      "avator": "http://www.xxx.com/upload/xxx.png",
      "token": "e10adc3949ba59abbe56e057f20f883e"
    }
  },
  "desc": "成功"
}
```
# 登录后选择编辑内容，后端返回json格式（GET）
```json
[
  {
    "id": "subject",
    "title": "请选择学科",
    "options": [
      {
        "id": "subject1",
        "label": "语文",
        "text": "语文"
      },
      {
        "id": "subject2",
        "label": "数学",
        "text": "数学"
      },
      {
        "id": "subject3",
        "label": "option3",
        "text": "英语"
      }
    ]
  },
  {
    "id": "grade",
    "title": "请选择年级",
    "options": [
      {
        "id": "grade4A",
        "label": "grade4A",
        "text": "四年级上"
      },
      {
        "id": "grade5B",
        "label": "五年级下",
        "text": "五年级下"
      },
      {
        "id": "grade6",
        "label": "option3",
        "text": "六年级"
      }
    ]
  },
  {
    "id": "content",
    "title": "请选择内容",
    "options": [
      {
        "id": "lessontext",
        "label": "课文相关",
        "text": "课文相关"
      },
      {
        "id": "pptoutline",
        "label": "PPT大纲PT",
        "text": "PPT大纲"
      },
      {
        "id": "lessondeg",
        "label": "课程设计",
        "text": "课程设计"
      }
    ]
  }
]
```
