# Changelog

## [Unreleased]

### Added
- **TechnicianPage**:
  - Redesigned layout with side-by-side chat sessions and a dedicated customer queue box.
  - Smart transitioning from "Connect" to the chat window for each customer.
  - Added hover effects and shadows for better visual appeal.
- **ChatInterface**:
  - Added chat bubbles styled like WhatsApp.
  - Material-style icons for attachment and send buttons.
  - Dynamic suggestions dropdown while typing in the chat box.
- **LiveChat**:
  - Integrated with `ChatInterface` for consistent UI and functionality.
  - Added real-time messaging between customers and technicians.
- **TechnicianSchedule**:
  - Displayed dynamically on both customer and technician pages.
  - Added a toggle button to show/hide the schedule.
- **Suggestions**:
  - Added a dropdown for dynamic suggestions while typing in the chat box.
- **Global Styles**:
  - Integrated VolvoSans font for a consistent and modern look.
  - Applied a cohesive color palette across the application.
- **Database Integration**:
  - Added a database with the following tables:
    - `technician_availability`: Tracks technician schedules and availability.
    - `troubleshoot_tree`: Stores troubleshooting steps and solutions.
    - `users`: Manages user information and authentication.
  - Database schema:
    ```
    neondb=> \dt
                        List of relations
     Schema |          Name           | Type  |    Owner     
    --------+-------------------------+-------+--------------
     public | technician_availability | table | neondb_owner
     public | troubleshoot_tree       | table | neondb_owner
     public | users                   | table | neondb_owner
    (3 rows)
    ```
- **Troubleshoot Tree**:
  - Implemented a dynamic troubleshoot tree for guided problem-solving.
  - Added backend support for editing, saving, and deleting tree nodes.
- **Technician Availability**:
  - Added a feature to display and update technician availability dynamically.
  - Integrated availability checks into the live chat and scheduling system.
- **Live Chat Enhancements**:
  - Improved real-time messaging between customers and technicians.
  - Enhanced the chat interface with better responsiveness and visual consistency.

### Changed
- **ChatPage**:
  - Added predefined troubleshooting tips for customers.
  - Added a toggle button to view the technician's schedule.
  - Improved the form for collecting customer details before joining live chat.
  - Enhanced message parsing and timestamp formatting.
  - Improved user experience with better layout and styles.
- **TechnicianPage**:
  - Improved UI with flexbox layout, shadows, and hover effects for better usability.
  - Enhanced the customer queue with dedicated styling and hover effects.
  - Displayed active chat sessions in a grid layout for better organization.
- **Socket Integration**:
  - Enhanced logging for socket events.
  - Added support for technician schedule updates and broadcasting to all clients.

### Fixed
- **Technician Schedule**:
  - Fixed issues with displaying and updating the technician's schedule dynamically.
  - Ensured the schedule is broadcast to all connected clients.
- **Customer Queue**:
  - Improved alignment, hover effects, and transitions for queue items.
- **Chat Interface**:
  - Fixed alignment issues with chat bubbles and input areas.
  - Ensured consistent styling for chat messages and attachments.

### Removed
- None.

### Notes
- The UI now adheres to a modern design with material-style elements and a consistent color palette.
- The project structure has been updated to ensure modularity and reusability of components.
- Real-time messaging and dynamic updates are fully functional across all pages.
- The project now includes a database for managing users, troubleshooting steps, and technician schedules.
