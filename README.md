# Gmail Extension with Auth Backend

This project consists of two main components:
1. **Gmail Extension** - A Chrome extension that integrates with Gmail using InboxSDK
2. **Auth Backend** - A backend service for handling Pipedream authentication using Express.js and Bun

## Prerequisites

- [Node.js](https://nodejs.org/) (for the extension build process)
- [Bun](https://bun.sh/) (for the auth backend)
- [ngrok](https://ngrok.com/) (for exposing the local backend)
- Chrome browser for testing the extension

## Project Structure

```
gmail-extension/
├── extension/              # Gmail Chrome Extension
│   ├── src/               # Extension source code
│   ├── packages/core/     # InboxSDK core files
│   ├── manifest.json      # Extension manifest
│   └── package.json       # Extension dependencies
├── pipe_dream_auth/       # Authentication Backend
│   ├── auth.ts           # Pipedream authentication logic
│   ├── index.ts          # Express server
│   └── package.json      # Backend dependencies
└── README.md             # This file
```

## Setup Instructions

### 1. Auth Backend Setup

#### Install Dependencies
```bash
cd pipe_dream_auth
bun install
```

#### Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Pipedream credentials in `.env`:
   ```bash
   PIPEDREAM_CLIENT_ID=your_pipedream_client_id
   PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret
   PIPEDREAM_PROJECT_ID=your_pipedream_project_id
   ```

   > **Note**: Get these credentials from your [Pipedream dashboard](https://pipedream.com/apps)

#### Start the Backend Server
```bash
bun run index.ts
```

The server will start on `http://localhost:3000`

### 2. Expose Backend with ngrok

1. Install ngrok if you haven't already:
   ```bash
   # On macOS
   brew install ngrok
   
   # On Linux
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok
   ```

2. Start ngrok to expose your local backend:
   ```bash
   ngrok http 3000
   ```

3. Copy the public HTTPS URL from ngrok output (e.g., `https://abc123.ngrok.io`)

### 3. Gmail Extension Setup

#### Update Extension Configuration

1. Navigate to the extension directory:
   ```bash
   cd extension
   ```

2. Update `manifest.json` to use your ngrok URL:
   - Replace `http://localhost:3000/*` with your ngrok URL in the `permissions` and `host_permissions` arrays
   - Example:
     ```json
     {
       "permissions": ["scripting", "https://abc123.ngrok.io/*"],
       "host_permissions": ["https://mail.google.com/", "https://abc123.ngrok.io/*"]
     }
     ```
3. Update content/index.jsx file: 
    - Replace `fetch()` url with `ngrok` backend url

#### Install Dependencies and Build
```bash
npm install
npm run build
```

The built extension will be in the `dist/` directory.

#### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `extension/dist/` directory
5. The extension should now appear in your extensions list

### 4. Testing the Setup

1. **Backend Test**: Visit your ngrok URL in a browser - you should see:
   ```json
   {"message": "Hello from server"}
   ```

2. **Extension Test**: 
   - Open [Gmail](https://mail.google.com)
   - The extension should load and integrate with Gmail via InboxSDK
   - Check the browser console for any errors

## API Endpoints

### POST /connect-url
Creates a Pipedream connect URL for user authentication.

**Request Body:**
```json
{
  "userId": "string",
  "app": "string"
}
```

**Response:**
```json
{
  "connectUrl": "https://pipedream.com/connect/..."
}
```

## Development Workflow

### For Extension Development
1. Make changes to files in `extension/src/`
2. Run `npm run start` for watch mode or `npm run build` for one-time build
3. Reload the extension in Chrome (`chrome://extensions/` → click reload button)
4. Refresh Gmail to see changes

### For Backend Development
1. Make changes to TypeScript files in `pipe_dream_auth/`
2. The Bun server will automatically restart on file changes
3. No need to restart ngrok unless you restart the server

### Updating ngrok URL
If your ngrok URL changes (happens when restarting ngrok):
1. Update `manifest.json` with the new URL
2. Rebuild the extension: `npm run build`
3. Reload the extension in Chrome
4. Update any hardcoded URLs in your extension code

## Troubleshooting

### Common Issues

1. **Extension not loading in Gmail**
   - Check that the extension is enabled in `chrome://extensions/`
   - Verify that `manifest.json` has correct permissions
   - Check browser console for errors

2. **Backend not accessible**
   - Ensure the backend server is running (`bun run index.ts`)
   - Verify ngrok is exposing port 3000
   - Check that environment variables are set correctly

3. **CORS errors**
   - The backend includes CORS middleware, but ensure your ngrok URL is correctly configured
   - Check that the extension's content security policy allows your ngrok domain

4. **Build errors**
   - Run `npm install` in the extension directory
   - Ensure all required dependencies are installed
   - Check that webpack configuration is correct

### Environment Variables Not Loading
If environment variables aren't loading properly:
```bash
# Verify .env file exists and has correct format
cat pipe_dream_auth/.env

# Ensure dotenv is working
bun run -e 'console.log(process.env.PIPEDREAM_CLIENT_ID)'
```