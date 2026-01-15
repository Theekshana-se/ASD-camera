
const fs = require('fs');
const path = require('path');

const rootEnv = fs.readFileSync('.env', 'utf8');
const serverEnvPath = path.join('server', '.env');

// We simply overwrite server/.env with root/.env because root .env was fully constructed from server keys + additions
fs.writeFileSync(serverEnvPath, rootEnv);
console.log('Synced server/.env with root .env');
