const path = require('path');

module.exports = {
    entry: './public/index.js', // 入口文件
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js', // 输出文件
    }
};