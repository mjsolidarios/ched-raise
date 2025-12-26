#!/usr/bin/env node

/**
 * FTP Deployment Script
 * Uploads the dist folder contents to an FTP server
 * Credentials are loaded from .env.local
 */

import { execSync } from 'child_process';
import ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env.local file not found');
    console.error('Please create .env.local with FTP credentials:');
    console.error('  FTP_HOST=your-ftp-host.com');
    console.error('  FTP_USER=your-username');
    console.error('  FTP_PASSWORD=your-password');
    console.error('  FTP_PORT=21');
    console.error('  FTP_REMOTE_PATH=/public_html (optional)');
    process.exit(1);
}

dotenv.config({ path: envPath });

// Validate required environment variables
const requiredVars = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Error: Missing required environment variables in .env.local:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
}

const config = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT || '21'),
    secure: process.env.FTP_SECURE === 'true',
    secureOptions: { rejectUnauthorized: false }, // Allow self-signed or mismatched certs (Bluehost common issue)
};

const remotePath = process.env.FTP_REMOTE_PATH || '/';
const localDistPath = path.join(__dirname, 'dist');
const localApiPath = path.join(__dirname, 'src/api/email');

async function deploy() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('--- Deployment Target ---');
    console.log('1. Frontend (dist)');
    console.log('2. Backend API (src/api/email)');
    console.log('3. Both');
    console.log('0. Exit');

    const choice = await rl.question('\nSelect deployment target [1-3, 0]: ');
    rl.close();

    if (choice === '0') {
        process.exit(0);
    }

    if (!['1', '2', '3'].includes(choice)) {
        console.error('❌ Invalid selection');
        process.exit(1);
    }

    const deployFrontend = choice === '1' || choice === '3';
    const deployBackend = choice === '2' || choice === '3';

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🚀 Starting deployment...\n');

        if (deployFrontend) {
            console.log('🔨 Building frontend...');
            try {
                execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
                console.log('✅ Build successful\n');
            } catch (error) {
                console.error('❌ Build failed');
                process.exit(1);
            }
        }

        if (deployFrontend && !fs.existsSync(localDistPath)) {
            console.error('❌ Error: dist folder not found after build');
            process.exit(1);
        }

        console.log('📡 Connecting to FTP server...');
        console.log(`   Host: ${config.host}:${config.port}`);
        console.log(`   User: ${config.user}`);
        console.log(`   Remote path: ${remotePath}\n`);

        await client.access(config);
        console.log('✅ Connected successfully\n');

        // Change to remote directory
        console.log(`📂 Changing to remote directory: ${remotePath}`);
        await client.ensureDir(remotePath);
        console.log('✅ Directory ready\n');

        if (deployFrontend) {
            // Upload dist folder contents
            console.log('📤 Uploading frontend files (dist)...');
            await client.uploadFromDir(localDistPath);
            console.log('✅ Frontend upload complete!\n');
        }

        if (deployBackend) {
            // Upload API folder contents
            console.log('📤 Uploading backend API (src/api/email)...');
            const remoteApiPath = remotePath.endsWith('/') ? `${remotePath}api/email` : `${remotePath}/api/email`;
            await client.ensureDir(remoteApiPath);
            await client.uploadFromDir(localApiPath);
            console.log('\n✅ Backend API upload complete!\n');
        }

        console.log('🎉 Deployment successful!');

    } catch (error) {
        console.error('\n❌ Deployment failed:');
        console.error(error.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

// Run deployment
deploy();
