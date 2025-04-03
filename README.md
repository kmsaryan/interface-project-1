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

4. Start the WebSocket server:
   ```bash
   node src/server/server.js
   ```

5. Start the React application:
   ```bash
   npm start
   ```

## Project Structure
```
/src
  ├── components
  │   ├── ChatInterface.jsx
  │   ├── LiveChat.jsx
  │   ├── Suggestions.jsx
  │   ├── TechnicianSchedule.jsx
  │   └── VideoCallButton.jsx
  ├── pages
  │   ├── ChatPage.jsx
  │   └── TechnicianPage.jsx
  ├── styles
  │   ├── global.css
  │   ├── ChatInterface.css
  │   ├── ChatPage.css
  │   └── TechnicianPage.css
  ├── utils
  │   └── socket.js
  └── server
      └── server.js
```

## Changelog
See [CHANGELOG.md](./CHANGELOG.md) for details on recent changes.

## License
This project is licensed under the MIT License.