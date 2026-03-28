# QC Help Support

A community-driven help and support platform for Quezon City residents. It enables real-time communication for emergency help, flood reporting, medical assistance, and lost-and-found services.

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (ES6+)
- **Backend (Serverless)**: Firebase (Authentication, Realtime Database, Cloud Storage)
- **Maps**: Leaflet.js
- **No build system** — static files served directly

## Project Layout

```
index.html   - Main UI shell with all modals, tabs, and navigation
app.js       - All application logic, Firebase integration, real-time listeners
style.css    - All styling with CSS variables for QC green theme
server.js    - Simple Node.js static file server (port 5000)
README.md    - Basic project description
```

## Running the App

The app is served via a Node.js static HTTP server:

```
node server.js
```

Listens on `0.0.0.0:5000`.

## Deployment

Configured as a **static** deployment — files are served directly with no build step required.
