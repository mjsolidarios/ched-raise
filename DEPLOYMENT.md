# FTP Deployment Script

This project includes an automated FTP deployment script to upload your built application to a web server.

## Setup

1. **Create `.env.local` file** in the project root with your FTP credentials:

```bash
cp .env.local.example .env.local
```

2. **Edit `.env.local`** with your actual FTP credentials:

```env
FTP_HOST=your-ftp-host.com
FTP_USER=your-username
FTP_PASSWORD=your-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/public_html
```

### Configuration Options

- `FTP_HOST`: Your FTP server hostname
- `FTP_USER`: Your FTP username
- `FTP_PASSWORD`: Your FTP password
- `FTP_PORT`: FTP port (default: 21)
- `FTP_SECURE`: Use FTPS (default: false)
- `FTP_REMOTE_PATH`: Remote directory path (default: /)

## Usage

### Build and Deploy

```bash
# Build the project
npm run build

# Deploy to FTP server
npm run deploy
```

### One-line Deploy

```bash
npm run build && npm run deploy
```

## Security Notes

- ⚠️ **Never commit `.env.local`** - It's already in `.gitignore`
- ✅ Use `.env.local.example` as a template
- ✅ Store sensitive credentials securely

## Troubleshooting

**Error: .env.local file not found**
- Create the file using the example: `cp .env.local.example .env.local`

**Error: dist folder not found**
- Run `npm run build` first

**Connection failed**
- Verify your FTP credentials
- Check if your server allows FTP connections
- Try changing `FTP_SECURE` to `true` if your server requires FTPS
