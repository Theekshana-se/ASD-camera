
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const serverEnvPath = path.join('server', '.env');
const rootEnvPath = '.env';

try {
    const serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
    const dbUrlMatch = serverEnv.match(/DATABASE_URL=.*/);
    const googleSecretMatch = serverEnv.match(/GOOGLE_CLIENT_SECRET=.*/);

    let newContent = '';

    if (dbUrlMatch) newContent += dbUrlMatch[0] + '\n';
    if (googleSecretMatch) newContent += googleSecretMatch[0] + '\n';

    newContent += 'NEXT_PUBLIC_API_BASE_URL=http://localhost:3002\n';
    newContent += 'NEXTAUTH_URL=http://localhost:3000\n';

    // Generate a random secret
    const secret = crypto.randomBytes(32).toString('hex');
    newContent += `NEXTAUTH_SECRET=${secret}\n`;

    fs.writeFileSync(rootEnvPath, newContent);
    console.log('Successfully updated .env with all config');
} catch (error) {
    console.error('Error:', error);
}
