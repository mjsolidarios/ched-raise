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
const localApiPath = path.join(__dirname, 'src/api');

async function uploadDirSmart(client, localDir, remoteDir, filter = null) {
    // Ensure remote directory exists
    await client.ensureDir(remoteDir);

    // Get list of local files
    // const remoteFiles = await client.list(remoteDir); // Optimization: Skip listing since we overwrite all
    // const remoteFileMap = new Map(remoteFiles.map(f => [f.name, f.size]));

    // Get list of local files
    const localFiles = fs.readdirSync(localDir);

    for (const file of localFiles) {
        const localPath = path.join(localDir, file);
        const remotePath = remoteDir.endsWith('/') ? `${remoteDir}${file}` : `${remoteDir}/${file}`;
        const stats = fs.statSync(localPath);

        if (stats.isDirectory()) {
            // Recursively upload subdirectory
            if (filter && !filter(file)) return;
            console.log(`📂 Entering ${file}...`);
            await uploadDirSmart(client, localPath, remotePath, filter);
        } else {
            // Always upload/overwrite
            console.log(`📝 Overwriting ${file}...`);
            await client.uploadFrom(localPath, remotePath);
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
    console.log('2. Backend API (src/api)');
    console.log('3. Both');
    console.log('0. Exit');

    const choice = await rl.question('\nSelect deployment target [1-3, 0]: ');

    if (choice === '0') {
        rl.close();
        process.exit(0);
    }

    if (!['1', '2', '3'].includes(choice)) {
        console.error('❌ Invalid selection');
        rl.close();
        process.exit(1);
    }

    const deployFrontend = choice === '1' || choice === '3';
    const deployBackend = choice === '2' || choice === '3';

    let updateVendor = false;
    let updateAssets = false;

    if (deployFrontend) {
        const assetsChoice = await rl.question('Does the "assets" folder need to be updated? (y/n) [n]: ');
        updateAssets = assetsChoice.toLowerCase() === 'y';
    }

    if (deployBackend) {
        const vendorChoice = await rl.question('Does the backend "vendor" folder need to be updated? (y/n) [n]: ');
        updateVendor = vendorChoice.toLowerCase() === 'y';
    }
    rl.close();

    // Pass options to client context if needed, or handle filtering in upload loop
    // Since uploadDirSmart is used for frontend, we need to modify it or pass a filter
    // For now, let's modify uploadDirSmart to accept a filter function


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
            await uploadDirSmart(client, localDistPath, remotePath, (filename) => {
                if (filename === 'assets' && !updateAssets) {
                    console.log('   ⏭️  Skipping assets folder...');
                    return false;
                }
                return true;
            });
            console.log('✅ Frontend sync complete!\n');
        }

        if (deployBackend) {
            // Upload API folder contents
            console.log('📤 Syncing backend API (src/api)...');
            const remoteApiPath = remotePath.endsWith('/') ? `${remotePath}api` : `${remotePath}/api`;
            await client.ensureDir(remoteApiPath);

            // Create temporary .env file for backend
            try {
                const envContent = `VITE_GEMINI_API_KEY=${process.env.VITE_GEMINI_API_KEY || ''}`;
                const tempEnvPath = path.join(localApiPath, '.env');
                fs.writeFileSync(tempEnvPath, envContent);
                console.log('   📝 Created temporary .env for backend');
            } catch (err) {
                console.error('   ⚠️  Failed to create .env for backend:', err.message);
            }

            const entries = fs.readdirSync(localApiPath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === 'vendor' && !updateVendor) {
                    console.log('   ⏭️  Skipping vendor folder...');
                    continue;
                }
                const entryLocalPath = path.join(localApiPath, entry.name);
                const entryRemotePath = `${remoteApiPath}/${entry.name}`;

                if (entry.isDirectory()) {
                    console.log(`📂 Entering ${entry.name}...`);
                    await uploadDirSmart(client, entryLocalPath, entryRemotePath);
                } else {
                    console.log(`📝 Overwriting ${entry.name}...`);
                    await client.uploadFrom(entryLocalPath, entryRemotePath);
                }
            }

            // Clean up temporary .env
            try {
                const tempEnvPath = path.join(localApiPath, '.env');
                if (fs.existsSync(tempEnvPath)) {
                    fs.unlinkSync(tempEnvPath);
                    console.log('   🧹 Cleaned up temporary .env');
                }
            } catch (err) {
                console.error('   ⚠️  Failed to cleanup .env:', err.message);
            }

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
