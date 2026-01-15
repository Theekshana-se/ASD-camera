
const { execSync } = require('child_process');

try {
    const output = execSync('wmic process where "name=\'node.exe\'" get commandline,processid').toString();
    const lines = output.split('\n');
    lines.forEach(line => {
        if (line.includes('server\\app.js') || line.includes('server/app.js')) {
            console.log('FOUND:', line.trim());
        }
    });
} catch (e) {
    console.error(e);
}
