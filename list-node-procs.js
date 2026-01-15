
const { execSync } = require('child_process');

try {
    // Use wmic to get commandline of all node processes
    const output = execSync('wmic process where "name=\'node.exe\'" get commandline,processid').toString();
    console.log(output);
} catch (e) {
    console.error(e);
}
