FROM node:14-alpine as build-stage
# 设置 'app' 目录为工作目录
WORKDIR /app
# 复制package.json以及package-lock.json
COPY package*.json ./
# 安装依赖
RUN npm install --registry=https://registry.npm.taobao.org

# 复制项目文件到当前工作目录
COPY . .
# 构建项目
ARG env
RUN npm run build:${env}

FROM nginx:1.21.6
WORKDIR /app
RUN rm -rf /etc/nginx/html
WORKDIR /etc/nginx/html
COPY --from=build-stage /app/dist .
EXPOSE 8080
#设置+8时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
ENTRYPOINT ["nginx", "-g", "daemon off;"]