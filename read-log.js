
const fs = require('fs');
const path = require('path');
const logPath = path.join('server', 'logs', 'error.log');
const stats = fs.statSync(logPath);
const fileSize = stats.size;
const readSize = Math.min(2000, fileSize);
const buffer = Buffer.alloc(readSize);
const fd = fs.openSync(logPath, 'r');
fs.readSync(fd, buffer, 0, readSize, fileSize - readSize);
console.log(buffer.toString());
fs.closeSync(fd);
