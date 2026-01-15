
const fs = require('fs');
const path = require('path');

const rootEnv = fs.readFileSync('.env', 'utf8');
const serverEnv = fs.readFileSync(path.join('server', '.env'), 'utf8');

console.log('=== ROOT .env ===');
console.log(rootEnv);
console.log('=== SERVER .env ===');
console.log(serverEnv);
