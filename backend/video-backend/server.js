import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import axios from 'axios';
import { google } from "googleapis";
import NodeGeocoder from 'node-geocoder';


//  Cloudinary Config (Hardcoded - you can replace with env if needed)
cloudinary.config({
  cloud_name: "dw6ahgpse",
  api_key: "329333223781279",
  api_secret: "DJJOUdNdDikYkKl_Z18PtBzRAaQ",
});

// YouTube OAuth2 Config (Pre-authorized - store securely in production)
const oauth2Client = new google.auth.OAuth2(
  "42604206707-75ee8mt28sm8v7kaqqumk4rifjdegem0.apps.googleusercontent.com", // client_id
  "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", // client_secret
  "http://localhost:3000/auth/callback" // redirect_uri (change if needed)
);

// Set your access_token and refresh_token here after obtaining them through OAuth2 flow
oauth2Client.setCredentials({
  access_token: "YOUR_ACCESS_TOKEN",
  refresh_token: "YOUR_REFRESH_TOKEN",
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});
const geoCoder = NodeGeocoder({
  provider: 'openstreetmap',
});
const app = express();
app.use(cors());
app.use(express.json());

// 📦 Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🌐 MongoDB Connection
mongoose.connect("mongodb://localhost:27017/thenextgengamerzzX");

// Video Schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: String,
  cloudinaryUrl: String,
  thumbnailUrl: String,
  videoId: String,
  type: String,
});

const videoModel = mongoose.model("videos", videoSchema);
const salesSchema = new mongoose.Schema({
  orderAmt: String,      // Make sure it's string
  orderBy: String,       // Make sure it's string
  orderOn: String,       // Make sure it's string, no Date
});

const salesModel = mongoose.model("sales", salesSchema);
// Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  dueDate: String,
  status: String, // status can be 'planning', 'scripting', 'recording', 'editing', 'review', 'complete' or 'completed'
});
// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String, // You should hash passwords in a real app (use bcrypt)
  role: { type: String, default: "user" }, // "admin" or "user"
  isBlocked: { type: Boolean, default: false }, // Whether user is blocked
  lat: Number, // Added latitude field
  lng: Number, // Added longitude field
  city: String, // Added city field
  ageGroup: String, // Added ageGroup field
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);
const projectModel = mongoose.model("projects", projectSchema);

// Client Schema (similar to User)
const clientSchema = new mongoose.Schema({
  name: String, // Changed from username to name
  email: { type: String, unique: true },
  password: String, // You should hash passwords in a real app (use bcrypt)
  role: { type: String, default: "client" },
  lat: Number,
  lng: Number,
  city: String,
  ageGroup: String,
  currentWalletBalance: Number, // Changed from walletBalance to currentWalletBalance
  country: String, // Added country field
}, { timestamps: true });

const clientModel = mongoose.model("clients", clientSchema);

// Revenue Schema
const revenueSchema = new mongoose.Schema({
  orderAmt: String,
  orderBy: String,
  orderOn: String,
},);
const revenueModel = mongoose.model("revenue", revenueSchema);

// Emulate __dirname in ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Ensure temp directory exists inside the server.js directory
const tempDir = path.resolve(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 🔍 Default Route
app.get("/", (req, res) => {
  res.send("Hello World 🚀 Video + Project Backend Running");
});

// Video Routes
app.post("/upload", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    const base64Video = `data:${videoFile.mimetype};base64,${videoFile.buffer.toString("base64")}`;
    const videoUpload = await cloudinary.uploader.upload(base64Video, {
      resource_type: "video",
      folder: "videoUploads",
    });

    let thumbnailUrl = "";
    if (thumbnailFile) {
      const base64Thumb = `data:${thumbnailFile.mimetype};base64,${thumbnailFile.buffer.toString("base64")}`;
      const thumbUpload = await cloudinary.uploader.upload(base64Thumb, {
        folder: "videoThumbnails",
      });
      thumbnailUrl = thumbUpload.secure_url;
    }

    const newVideo = new videoModel({
      title,
      description,
      uploadedBy: "Kavya",
      cloudinaryUrl: videoUpload.secure_url,
      thumbnailUrl,
      videoId: uuidv4(),
      type,
    });
    await newVideo.save();
    res.json({ success: true, message: "Uploaded successfully", video: newVideo });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

app.get("/videos", async (req, res) => {
  try {
    const videos = await videoModel.find().sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Fetch videos error:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.delete("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await videoModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Video not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

app.put("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;
    const updatedVideo = await videoModel.findByIdAndUpdate(id, { title, description, type }, { new: true });
    if (!updatedVideo) return res.status(404).json({ success: false, message: "Video not found" });
    res.json({ success: true, video: updatedVideo });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: "Failed to update video" });
  }
});

// Project Routes
app.get("/projects", async (req, res) => {
  try {
    const projects = await projectModel.find({ status: { $ne: "complete" } }); // Don't return complete projects
    res.json(projects);
  } catch (err) {
    res.status(500).json({ success: false, error: "Could not fetch projects" });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, error: "Title is required" });
    }
    const newProject = new projectModel({ title, description, dueDate, status });
    await newProject.save();
    res.json({ success: true, project: newProject });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ success: false, error: "Failed to create project" });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await projectModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, project: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update project" });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await projectModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});

// Move Project status on drag-drop
app.put("/projects/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // new status (e.g., 'scripting', 'recording', etc.)

    // Allowed statuses (add 'completed' and others as needed)
    const allowedStatuses = ['planning', 'scripting', 'recording', 'editing', 'review', 'complete', 'completed'];

    // Validate the incoming status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    // Update the project status
    const updatedProject = await projectModel.findByIdAndUpdate(id, { status }, { new: true });
    
    // If no project is found with the given ID, return an error
    if (!updatedProject) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, project: updatedProject });
  } catch (err) {
    console.error("Error updating project status:", err);
    res.status(500).json({ success: false, error: "Failed to update project status" });
  }
});

// Block/Unblock User Routes
app.put("/users/:id/block", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      user,
    });
  } catch (err) {
    console.error("Block/Unblock error:", err);
    res.status(500).json({ success: false, error: "Failed to block/unblock user" });
  }
});

// Get Users (for Admin to view all users)

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ success: true, users });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});

// Get Clients (fetch all clients, ignoring block status)

app.get("/clients", async (req, res) => {
  try {
    const clients = await clientModel.find(); // Fetch all clients
    res.json({ success: true, clients });
  } catch (err) {
    console.error("Fetch clients error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch clients" });
  }
});

// 📊 Sales Overview Data (returns all revenue data without filtering)

// New route for clients table data with specific fields
app.get("/clients-table", async (req, res) => {
  try {
    const clients = await clientModel.find();
    const simplifiedClients = clients.map(client => ({
      _id: client._id,
      name: client.name, // Changed from username to name
      email: client.email,
      currentWalletBalance: client.currentWalletBalance, // Changed from walletBalance to currentWalletBalance
      country: client.country,
    }));
    res.json({ success: true, clients: simplifiedClients });
  } catch (err) {
    console.error("Fetch clients error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch clients" });
  }
});

// 📊 User Growth Data Endpoint (returns all users)
app.get("/revenue", async (req, res) => {
  try {
    const revenue = await revenueModel.find();
    console.log("Raw Revenue Data:", revenue); // <-- Check this in terminal
    res.json({ success: true, revenue });
  } catch (err) {
    console.error("Error generating revenue data:", err);
    res.status(500).json({ error: "Failed to fetch revenue" });
  }
});
app.get("/user-growth", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ success: true, users });

  } catch (err) {
    console.error("Error generating user growth data:", err);
    res.status(500).json({ error: "Failed to fetch user growth data" });
  }
});

// 📊 Client Growth Data Endpoint (returns all clients)
app.get("/client-growth", async (req, res) => {
  try {
    const clients = await clientModel.find();
    res.json({ success: true, clients });
  } catch (err) {
    console.error("Error generating client growth data:", err);
    res.status(500).json({ error: "Failed to fetch client growth data" });
  }
});

app.get("/sales", async (req, res) => {
  try {
    const sales = await salesModel.find();
    res.json({ success: true, sales });
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ success: false, error: "Failed to fetch sales" });
  }
});

// New POST route to add a sale
app.post("/sales", async (req, res) => {
  try {
    const { orderAmt, orderBy, orderOn } = req.body;
    if (!orderAmt || !orderBy || !orderOn) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    const newSale = new salesModel({ orderAmt, orderBy, orderOn });
    await newSale.save();
    res.json({ success: true, message: "Sale added successfully", sale: newSale });
  } catch (err) {
    console.error("Error adding sale:", err);
    res.status(500).json({ success: false, error: "Failed to add sale" });
  }
});

// (Removed duplicate /revenue route to avoid conflict)


app.get("/projects-calendar", async (req, res) => {
  try {
    const projects = await projectModel.find();  // Get all projects
    res.json(projects);  // Return projects as JSON
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
});
// Post request to add a new project/event
app.get("/videos", async (req, res) => {
  try {
    const videos = await videoModel.find().sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Fetch videos error:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});
app.post("/clients", async (req, res) => {
  try {
    const { name, email, currentWalletBalance, country, city } = req.body;

    if (!name || !email || !country || !city) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const geo = await geoCoder.geocode(city);
    const { latitude, longitude } = geo[0] || {};

    const newClient = new clientModel({
      name,
      email,
      currentWalletBalance,
      country,
      city,
      lat: latitude,
      lng: longitude,
    });

    await newClient.save();

    res.json({ success: true, message: "Client added successfully", client: newClient });
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ success: false, error: "Failed to add client" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));