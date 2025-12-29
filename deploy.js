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

async function uploadDirSmart(client, localDir, remoteDir) {
    // Ensure remote directory exists
    await client.ensureDir(remoteDir);

    // Get list of remote files for comparison
    const remoteFiles = await client.list(remoteDir);
    const remoteFileMap = new Map(remoteFiles.map(f => [f.name, f.size]));

    // Get list of local files
    const localFiles = fs.readdirSync(localDir);

    for (const file of localFiles) {
        const localPath = path.join(localDir, file);
        const remotePath = remoteDir.endsWith('/') ? `${remoteDir}${file}` : `${remoteDir}/${file}`;
        const stats = fs.statSync(localPath);

        if (stats.isDirectory()) {
            // Recursively upload subdirectory
            console.log(`📂 Entering ${file}...`);
            await uploadDirSmart(client, localPath, remotePath);
        } else {
            // Check if file needs upload
            let shouldUpload = true;

            if (remoteFileMap.has(file)) {
                const remoteSize = remoteFileMap.get(file);
                // If sizes match, skip upload (basic "smart" check)
                if (remoteSize === stats.size) {
                    shouldUpload = false;
                    // console.log(`⏭️  Skipped ${file} (Unchanged: ${stats.size} bytes)`);
                } else {
                    console.log(`📝 Updating ${file} (Size changed: ${remoteSize} -> ${stats.size})`);
                }
            } else {
                console.log(`✨ New file ${file}`);
            }

            if (shouldUpload) {
                process.stdout.write(`   Uploading ${file}... `);
                await client.uploadFrom(localPath, remotePath);
                process.stdout.write('Done\n');
            }
        }
    }
}

async function deploy() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('--- Deployment Target (Smart Sync) ---');
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
    client.ftp.verbose = false; // Disable verbose logging to cleaner output for smart sync

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
        // console.log(`📂 Syncing to remote directory: ${remotePath}`);
        await client.ensureDir(remotePath);
        // console.log('✅ Directory ready\n');

        if (deployFrontend) {
            // Upload dist folder contents
            console.log('📤 Syncing frontend files (dist)...');
            await uploadDirSmart(client, localDistPath, remotePath);
            console.log('✅ Frontend sync complete!\n');
        }

        if (deployBackend) {
            // Upload API folder contents
            console.log('📤 Syncing backend API (src/api/email)...');
            const remoteApiPath = remotePath.endsWith('/') ? `${remotePath}api/email` : `${remotePath}/api/email`;
            await uploadDirSmart(client, localApiPath, remoteApiPath);
            console.log('\n✅ Backend API sync complete!\n');
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
