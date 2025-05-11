require("dotenv").config(); // Load environment variables

const express = require("express");
const http = require("http");
const setupWebSocket = require("./websocket");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { Pool } = require("pg"); // Add PostgreSQL client
const cors = require("cors"); // Import CORS

const PORT = process.env.PORT || 8001; // Use PORT from .env
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 5432;

// Initialize database connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: DB_HOST,
  database: process.env.DB_NAME || "volvo_assistant",
  password: process.env.DB_PASSWORD || "postgres",
  port: DB_PORT,
});

// Create a database query helper
const db = {
  query: (text, params) => pool.query(text, params),
};

const dbRoutes = require("../../VolvoAssistantDatabase/routes"); // Import database routes
const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server);

const users = new Map(); // Map to track connected users (socketId -> userDetails)
let liveChatQueue = []; // Array to track live chat queue(socketId -> userDetails)
let activeChats = new Map(); // Map to track active chats (technicianId -> customerId)

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/", // Save files in the 'uploads/' directory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

// Add CORS middleware
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000", // Use frontend URL from .env
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies if needed
}));

// Middleware to validate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // Attach user info to the request
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to the WebSocket Server!"); // Respond with a simple message
});

app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("[DEBUG] Registering user:", { name, email, role });

    // Check if the role is valid
    const validRoles = ["customer", "technician", "dealer"];
    if (!validRoles.includes(role)) {
      console.error("[ERROR] Invalid role:", role);
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check for duplicate email
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      console.error("[ERROR] Duplicate email:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, role]
    );

    console.log("[DEBUG] User registered successfully:", { name, email, role });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("[ERROR] Registration failed:", err);
    if (err.code === "ETIMEDOUT") {
      console.error("[ERROR] Database connection timed out");
      return res.status(500).json({ error: "Database connection timed out" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[DEBUG] Login request received:", { email });

    // Fetch user from database
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("[DEBUG] Database query result:", userResult.rows);

    if (userResult.rows.length === 0) {
      console.error("[ERROR] User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("[ERROR] Invalid password for user:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    console.log("[DEBUG] Token generated:", token);
    res.status(200).json({ message: "Login successful", token, user: { id: user.id, role: user.role } });
  } catch (err) {
    console.error("[DEBUG] Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Refresh token endpoint
app.post("/api/users/refresh-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      const newToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(200).json({ token: newToken });
    }
    res.status(400).json({ error: "Token is still valid" });
  } catch (err) {
    console.error("[ERROR] Refresh token failed:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.get("/api/dealer/customers", async (req, res) => {
  try {
    const customers = await db.query("SELECT * FROM customers");
    console.log("[DEBUG] Fetched customers:", customers.rows);
    res.json(customers.rows);
  } catch (err) {
    console.error("[ERROR] Fetching customers failed:", err);
    res.status(500).json({ error: "Failed to fetch customers" }); // Ensure valid JSON response
  }
});

app.get("/api/dealer/technicians", async (req, res) => {
  try {
    const technicians = await db.query("SELECT * FROM technicians");
    console.log("[DEBUG] Fetched technicians:", technicians.rows);
    res.json(technicians.rows);
  } catch (err) {
    console.error("[ERROR] Fetching technicians failed:", err);
    res.status(500).json({ error: "Failed to fetch technicians" }); // Ensure valid JSON response
  }
});

app.get("/api/dealer/users", async (req, res) => {
  try {
    const users = await db.query("SELECT id, name, email, role FROM users");
    console.log("[DEBUG] Fetched users:", users.rows);
    const customers = users.rows.filter(user => user.role === "customer");
    const technicians = users.rows.filter(user => user.role === "technician");

    res.status(200).json({ customers, technicians }); // Ensure valid JSON response
  } catch (err) {
    console.error("[ERROR] Fetching users failed:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Upload a file
app.post("/file/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, size, path: filepath } = req.file;

    // Save file metadata to the database
    const result = await pool.query(
      "INSERT INTO files (filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING id",
      [originalname, filepath, req.file.mimetype, size]
    );

    res.status(201).json({ id: result.rows[0].id, filename: originalname });
  } catch (err) {
    console.error("[ERROR] File upload failed:", err.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Download a file by ID
app.get("/file/download/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch file metadata from the database
    const result = await pool.query("SELECT * FROM files WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const { filepath, filename } = result.rows[0];

    // Serve the file to the client
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error("[ERROR] File download failed:", err.message);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  } catch (err) {
    console.error("[ERROR] File download failed:", err.message);
    res.status(500).json({ error: "Failed to download file" });
  }
});

// Example of a protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Execute SQL queries securely
app.post("/api/db/execute", authenticateToken, async (req, res) => {
  const { query } = req.body;

  if (req.user.role !== "DBMS manager") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("[ERROR] Query execution failed:", err.message);
    res.status(400).json({ error: "Invalid query or execution failed" });
  }
});

// Use database routes
app.use("/api/db", dbRoutes); // Mount the database routes under /api/db

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user registration (customer or technician)
  socket.on("registerUser", (userDetails) => {
    console.log("[DEBUG] registerUser event received:", userDetails);
    users.set(socket.id, userDetails);
    console.log("User registered:", userDetails);

    if (userDetails.role === "technician") {
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }
  });

  // Handle customer joining live chat queue
  socket.on("joinLiveChatQueue", (customerDetails) => {
    console.log("[DEBUG] joinLiveChatQueue event received:", customerDetails);
    liveChatQueue.push({ id: socket.id, ...customerDetails });
    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
  });

  // Handle technician selecting a customer
  socket.on("selectCustomer", (customerId) => {
    console.log("[DEBUG] selectCustomer event received:", customerId);
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
      activeChats.set(socket.id, customerId); // Map technician to customer
      io.emit("updateLiveChatQueue", liveChatQueue); // Update queue for all technicians
      io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
      io.to(socket.id).emit("customerConnected", customer);
    } else {
      console.warn(`[WARN] Customer with ID ${customerId} not found in queue.`);
    }
  });

  // Handle real-time messaging
  socket.on("sendMessage", ({ to, message }) => {
    console.log("[DEBUG] sendMessage event received:", { to, message });
    if (to) {
      io.to(to).emit("receiveMessage", { from: socket.id, message }); // Send message to the recipient
    } else {
      console.warn("[WARN] Message not sent. Missing recipient (to).");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    const user = users.get(socket.id);
    users.delete(socket.id);

    if (user?.role === "technician") {
      const customerId = activeChats.get(socket.id);
      if (customerId) {
        // Return the customer to the queue if the technician disconnects
        const customer = liveChatQueue.find((c) => c.id === customerId);
        if (customer) {
          liveChatQueue.push(customer);
        }
        activeChats.delete(socket.id);
      }
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }

    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
  });
});

server.listen(PORT, () => {
  const host = process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`
    : `http://localhost:${PORT}`;
  console.log(`Server is running on ${host}`);
});