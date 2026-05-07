#!/usr/bin/env node

/**
 * TaskFlow - Application Starter Script
 * This script helps you start both backend and frontend servers
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';

console.log('🚀 TaskFlow - Task Management Platform');
console.log('=====================================\n');

// Backend startup
console.log('📦 Starting Backend Server...');
const backendProcess = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'Backend'),
    stdio: 'inherit',
    shell: isWindows,
});

// Wait a bit then start frontend
setTimeout(() => {
    console.log('\n📱 Starting Frontend Server...');
    const frontendProcess = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
        cwd: path.join(__dirname, 'Frontend'),
        stdio: 'inherit',
        shell: isWindows,
    });

    // Handle exit
    process.on('SIGINT', () => {
        console.log('\n\n👋 Shutting down...');
        backendProcess.kill();
        frontendProcess.kill();
        process.exit(0);
    });
}, 3000);

// Error handling
backendProcess.on('error', (err) => {
    console.error('❌ Backend Error:', err);
});
