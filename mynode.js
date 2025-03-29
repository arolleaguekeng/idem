const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
require('dotenv').config({ path: 'src/.env' });;
const fs = require('fs');
const path = require('path');
const envFile = `export const environment = {
  environment: 'prod',
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.VARIABLE_NAME}',},
  };
`;





const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetDevPath = path.join(__dirname, './src/environments/environment.development.ts');

function createFileIfNotExists(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Successfully created: ${filePath}`);
    } else {
        console.log(`⚠️ File already exists: ${filePath}`);
    }
}

// Création des fichiers seulement s'ils n'existent pas
createFileIfNotExists(targetPath, envFile);
createFileIfNotExists(targetDevPath, envFile);
