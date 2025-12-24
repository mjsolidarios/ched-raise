#!/usr/bin/env node

/**
 * FTP Deployment Script
 * Uploads the dist folder contents to an FTP server
 * Credentials are loaded from .env.local
 */

import ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

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

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🚀 Starting deployment...\n');

        // Check if dist folder exists
        if (!fs.existsSync(localDistPath)) {
            console.error('❌ Error: dist folder not found');
            console.error('Please run "npm run build" first');
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

        // Upload dist folder contents
        console.log('📤 Uploading files...');
        await client.uploadFromDir(localDistPath);
        console.log('\n✅ Upload complete!\n');

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
