# AWS 后台部署安装教程

## 1. 选择实例

i-02ec934f9959ff874

## 2. 点击右上角的”连接“

## 3. 点击新页面中的“连接”

$ sudo yum update -y

$ sudo yum search docker

sudo yum info docker

$ sudo yum install docker

$ sudo systemctl start docker

$ sudo systemctl enable docker

$ sudo yum install git -y

## 生成 GitHub Key 之后（进入个人设定）

git clone https://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@github.com/dahualian/beike-server.git

## 安装 Docker compose

sudo curl -L "https://github.com/docker/compose/releases/download/2.17.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

## 运行 Docker compose

sudo chmod +x /usr/local/bin/docker-compose

## 启动 Docker

sudo systemctl start docker

## 服务器启动 Docker 自动运行

sudo systemctl enable docker

## 查看 Docker 状态

sudo systemctl status docker

## 进入文件夹后 Build

docker-compose up -d --build

docker-compose up --build

