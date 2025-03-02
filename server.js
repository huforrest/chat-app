const crypto = require('crypto');

// 生成随机密钥
function generateSecretKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

const secretKey = generateSecretKey();
console.log("Generated JWT Secret Key:", secretKey);

// 将密钥存储到环境变量或配置文件中
require('dotenv').config();
process.env.JWT_SECRET = secretKey;
console.log("Stored JWT Secret Key:", process.env.JWT_SECRET);

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const path = require('path');

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const userController = require("./controllers/userController");

// 静态文件目录
app.use(express.static('public'));
// 中间件
app.use(bodyParser.json());

// JWT验证中间件
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 从请求头中获取JWT

    if (!token) {
        return res.status(401).send('未授权：缺少Token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // 验证JWT
        req.user = decoded; // 将用户信息添加到请求对象
        next();
    } catch (err) {
        return res.status(401).send('未授权：无效的Token');
    }
};

// 应用中间件
app.get('/protected-route', authMiddleware, (req, res) => {
  res.json({ message: `欢迎你，用户ID为${req.user.userId}的用户` });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat', 'chat.html'));
});

// 注册接口
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await userController.insertUser(username, password);
      if (result > 0) {
        res.status(201).json({ message: 'User registered successfully' })
      } else {
        res.status(500).json({ message: 'Error registering user' });
      }
    } catch (error) {
      res.status(500).send('Error registering user');
    }
});
  
// 登录接口
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userController.getUserByName(username);
      console.log("user: ", user);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const isMatch = user.password == password;
      if (!isMatch) {
        return res.status(400).send('Invalid password');
      }
  
      // 更新用户在线状态
      user.status = 1;
      userController.updateUserStatusById(1, user.id);
      // 生成JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        token: token,
        userId: user.id,
      });
    } catch (error) {
      res.status(500).send('Error logging in');
    }
});

const clients = new Set();

wss.on('connection', (ws, req) => {
    console.log("New client connected: ", req);
    clients.add(ws);

    // const user = req.user; // 获取验证后的用户信息
    // // 发送欢迎语
    // ws.send(JSON.stringify({
    //   content: `欢迎你，${user.username}！`
    // }));
    // clients.forEach((client) => {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify({
    //           content: `${user.username}进入聊天室`
    //         }));
    //     }
    // });

    ws.on('message', (message) => {
        console.log("Received message: " + message.toString('utf-8'));
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log("Client closed");
        clients.delete(ws);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});