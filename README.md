# Interface Project

## Overview
This project is a customer support interface that allows customers to chat with technicians, view troubleshooting tips, and escalate issues to live chat or video calls. Technicians can manage multiple chat sessions, view customer queues, and update their availability schedules.

## Features
- **Customer Side**:
  - AI-powered troubleshooting tips.
  - Dynamic suggestions while typing in the chat box.
  - Live chat with technicians.
  - Option to escalate issues to video calls.
  - View technician availability schedule.

- **Technician Side**:
  - Manage multiple live chat sessions with customers.
  - View and update availability schedules.
  - Dedicated customer queue with smart transitioning to chat sessions.

- **Shared Features**:
  - Consistent UI with VolvoSans font and a modern color palette.
  - Material-style icons for chat actions.
  - Real-time messaging using WebSocket.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A WebSocket server (e.g., Socket.IO)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/interface-project.git
   cd interface-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

4. Configure `stream-http`:
   - Ensure that the `stream-http` library and its dependencies are installed:
     ```bash
     npm install stream-http readable-stream
     ```
   - Verify that the `stream-http` library is correctly configured in the `src/utils/stream-http` directory.

5. Start the WebSocket server:
   ```bash
   node src/server/server.js
   ```

6. Start the React application:
   ```bash
   npm start
   ```

## Configuration

### Environment Variables
- `REACT_APP_SERVER_URL`: The URL of the WebSocket server (default: `http://localhost:5000`).
- `PORT`: The port on which the server runs (default: `5000`).

### Steps to Configure
1. Create a `.env` file in the root directory.
2. Add the following content:
   ```
   REACT_APP_SERVER_URL=http://localhost:5000
   PORT=5000
   ```
3. Restart the server and client after making changes to the `.env` file.

### Troubleshooting Socket Issues
If you encounter socket connection errors:
1. Ensure the server is running and accessible at the URL specified in `REACT_APP_SERVER_URL`.
2. Verify that the port in the `.env` file matches the server's port.
3. Check for network restrictions (e.g., firewalls) that might block WebSocket connections.
4. Increase the `timeout` value in `src/utils/socket.js` if the connection is slow.
5. Review the browser console logs for detailed error messages.

## Project Structure
```
.
├── CHANGELOG.md
├── config-overrides.js
├── package.json
├── package-lock.json
├── public
│   ├── favicon.ico
│   └── index.html
├── README.md
└── src
    ├── App.jsx
    ├── assets
    │   ├── fonts
    │   │   ├── VolvoBroad.ttf
    │   │   └── Volvo_Novum_Light.ttf
    │   └── images
    │       ├── Customer.gif
    │       ├── ExcavatersB.jpeg
    │       ├── ExcavatersC.jpeg
    │       ├── ExcavatersD.jpeg
    │       ├── Technicain1.jpeg
    │       ├── Technicain2.jpeg
    │       ├── Technician.gif
    │       └── volvo-alt.svg
    ├── components
    │   ├── ChatInterface.jsx
    │   ├── Footer.jsx
    │   ├── Header.jsx
    │   ├── LiveChat.jsx
    │   ├── Solution.jsx
    │   ├── Suggestions.jsx
    │   ├── TechnicianConnect.jsx
    │   ├── TechnicianSchedule.jsx
    │   ├── Troubleshoot.jsx
    │   └── VideoCallButton.jsx
    ├── index.jsx
    ├── pages
    │   ├── ChatPage.jsx
    │   ├── Home.jsx
    │   ├── LoginPage.jsx
    │   ├── SignInPage.jsx
    │   └── TechnicianPage.jsx
    ├── server
    │   └── server.js
    ├── styles
    │   ├── App.css
    │   ├── ChatInterface.css
    │   ├── ChatPage.css
    │   ├── fonts.css
    │   ├── Footer.css
    │   ├── global.css
    │   ├── Header.css
    │   ├── Home.css
    │   ├── LiveChat.css
    │   ├── LoginPage.css
    │   ├── SignInPage.css
    │   ├── Solution.css
    │   ├── Suggestions.css
    │   ├── TechnicianConnect.css
    │   ├── TechnicianPage.css
    │   ├── Troubleshoot.css
    │   └── VideoCallButton.css
    └── utils
        ├── server.js
        ├── socket.js
        └── stream-http
            ├── index.js
            ├── lib
            │   ├── capability.js
            │   ├── request.js
            │   └── response.js
            ├── LICENSE
            ├── node_modules
            │   └── readable-stream
            │       ├── CONTRIBUTING.md
            │       ├── errors-browser.js
            │       ├── errors.js
            │       ├── experimentalWarning.js
            │       ├── GOVERNANCE.md
            │       ├── lib
            │       │   ├── internal
            │       │   │   └── streams
            │       │   │       ├── async_iterator.js
            │       │   │       ├── buffer_list.js
            │       │   │       ├── destroy.js
            │       │   │       ├── end-of-stream.js
            │       │   │       ├── from-browser.js
            │       │   │       ├── from.js
            │       │   │       ├── pipeline.js
            │       │   │       ├── state.js
            │       │   │       ├── stream-browser.js
            │       │   │       └── stream.js
            │       │   ├── _stream_duplex.js
            │       │   ├── _stream_passthrough.js
            │       │   ├── _stream_readable.js
            │       │   ├── _stream_transform.js
            │       │   └── _stream_writable.js
            │       ├── LICENSE
            │       ├── package.json
            │       ├── readable-browser.js
            │       ├── readable.js
            │       └── README.md
            ├── package.json
            └── README.md
```

## Scripts
- **Start Development Server**:
  ```bash
  npm start
  ```
- **Run WebSocket Server**:
  ```bash
  node src/server/server.js
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Lint Code**:
  ```bash
  npm run lint
  ```

## Changelog
See [CHANGELOG.md](./CHANGELOG.md) for details on recent changes.

## License
This project is licensed under the MIT License.