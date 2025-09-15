// Simple test to verify the server starts without TypeScript errors
const { spawn } = require('child_process');

console.log('🧪 Testing backend server startup...\n');

const server = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let output = '';
let hasError = false;

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  output += data.toString();
  console.error(data.toString());
  hasError = true;
});

server.on('close', (code) => {
  console.log(`\n🔍 Server process exited with code ${code}`);
  
  if (code === 0 && !hasError) {
    console.log('✅ Backend server started successfully!');
    console.log('🚀 You can now test the API endpoints');
  } else {
    console.log('❌ Backend server failed to start');
    console.log('📋 Full output:');
    console.log(output);
  }
});

// Kill the server after 10 seconds
setTimeout(() => {
  server.kill();
  console.log('\n⏰ Test completed - server stopped');
}, 10000);
