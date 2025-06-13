const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/timetracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema and Model
const siteSchema = new mongoose.Schema({
  url: String,
  duration: Number,
  user: String,
  date: { type: Date, default: Date.now },
});

const Site = mongoose.model("Site", siteSchema);

// ✅ POST route to receive time tracking data
app.post("/track", async (req, res) => {
  console.log("Received data from extension:", req.body);

  const { user, url, duration } = req.body;

  if (!user || !url || !duration) {
    console.log("❌ Invalid input:", req.body);
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const newSite = new Site({ user, url, duration });
    await newSite.save();

    console.log("✅ Data saved:", newSite);
    res.status(200).json({ message: "Tracking data saved!" });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET route to return summarized productivity report
app.get("/report/:user", async (req, res) => {
  const { user } = req.params;

  try {
    const data = await Site.find({ user });

    const report = {};

    data.forEach((entry) => {
      if (!report[entry.url]) {
        report[entry.url] = 0;
      }
      report[entry.url] += entry.duration;
    });

    res.json(report); // This sends: { "youtube.com": 3, "facebook.com": 5 }
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
