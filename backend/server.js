require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { RekognitionClient, CompareFacesCommand } = require("@aws-sdk/client-rekognition");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve Aadhaar image

// AWS Rekognition v3 config
const rekognition = new RekognitionClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const aadhaarImagePath = path.join(__dirname, "uploads/aadhar/shubham.jpeg");
app.post("/compare-face", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        match: false,
        message: "No image uploaded",
      });
    }

    const liveImage = fs.readFileSync(req.file.path);
    const aadhaarImage = fs.readFileSync(aadhaarImagePath);

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: aadhaarImage },
      TargetImage: { Bytes: liveImage },
      SimilarityThreshold: 80, 
    });

    const response = await rekognition.send(command);

    fs.unlinkSync(req.file.path);

    const totalFacesDetected =
      (response.FaceMatches?.length || 0) +
      (response.UnmatchedFaces?.length || 0);

    if (totalFacesDetected > 1) {
      return res.json({
        match: false,
        similarity: 0,
        message: "Only one person should be visible",
      });
    }

    if (!response.FaceMatches || response.FaceMatches.length === 0) {
      return res.json({
        match: false,
        similarity: 0,
        message: "Face does not match Aadhaar",
      });
    }

    const similarity = response.FaceMatches[0].Similarity;

    return res.json({
      match: true,
      similarity,
      message: `Match: ${similarity.toFixed(2)}%`,
    });

  } catch (error) {
    console.error("CompareFaces Error:", error);
    return res.status(500).json({
      match: false,
      message: "Server error during face comparison",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
