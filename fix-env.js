
const fs = require('fs');
const path = require('path');

const serverEnvPath = path.join('server', '.env');
const rootEnvPath = '.env';

try {
    const serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
    const dbUrlMatch = serverEnv.match(/DATABASE_URL=.*/);

    if (dbUrlMatch) {
        let newContent = dbUrlMatch[0] + '\n';
        newContent += 'NEXT_PUBLIC_API_BASE_URL=http://localhost:3002\n';

        fs.writeFileSync(rootEnvPath, newContent);
        console.log('Successfully updated .env');
        console.log('Content:', newContent);
    } else {
        console.error('Could not find DATABASE_URL in server/.env');
    }
} catch (error) {
    console.error('Error:', error);
}
