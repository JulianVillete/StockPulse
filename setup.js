#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 StockPulse MVP Setup');
console.log('======================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create .env file for server if it doesn't exist
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(serverEnvPath)) {
  const envContent = `# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/stockpulse

# Server port
PORT=5000

# Alpha Vantage API Key (already provided in code)
# ALPHA_VANTAGE_API_KEY=F83JJ8M93FB6GF22
`;
  
  fs.writeFileSync(serverEnvPath, envContent);
  console.log('✅ Created server/.env file');
} else {
  console.log('✅ server/.env file already exists');
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, 'server'), 
    stdio: 'inherit' 
  });
  console.log('✅ Server dependencies installed');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, 'client'), 
    stdio: 'inherit' 
  });
  console.log('✅ Client dependencies installed');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up MongoDB Atlas (free) or use local MongoDB');
console.log('2. Update server/.env with your MongoDB connection string');
console.log('3. Start the backend server: cd server && npm run dev');
console.log('4. Start the frontend: cd client && npm start');
console.log('5. Open http://localhost:3000 in your browser');
console.log('\n📚 Check README.md for detailed instructions');
console.log('\n🔑 Alpha Vantage API key is already configured: F83JJ8M93FB6GF22');
