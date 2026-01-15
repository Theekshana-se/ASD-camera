
// Check if app.js loads env
const fs = require('fs');
const content = fs.readFileSync('server/app.js', 'utf8');
if (content.includes('dotenv')) {
    console.log('App.js USES dotenv');
} else {
    console.log('App.js DOES NOT use dotenv');
}
