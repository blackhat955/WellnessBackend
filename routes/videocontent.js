// Description: This file contains the routes for video content. It allows users to upload videos to AWS S3 and fetch videos from MongoDB.

const express = require('express');
require('dotenv').config();
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const { Video } = require("../models/video");
// const { auth } = require("../middleware/auth");
const fs = require('fs');

// Configure AWS S3 and CloudFront
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const urlfix = "dd12fyimlw2sl.cloudfront.net"; 

// Upload file to S3
function uploadToS3(file) {
  const params = {
    Bucket: "wellnesshealth",
    Key: file.originalname,
    Body: fs.createReadStream(file.path),
    ContentType:"video/mp4" ,
  };

  return s3.upload(params).promise();
}

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') {
      return cb(res.status(400).end('Only MP4 is supported'), false);
    }
    cb(null, true)
  }
})

var upload = multer({ storage: storage }).single("file")

//=================================
//             Video
//=================================

router.post("/uploadVideo", upload, async (req, res) => {
    console.log("here I am print the body",req.body);
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload file to S3
    const uploadedFile = await uploadToS3(req.file);

    // Get CloudFront link
    const cloudFrontUrl = `https://${urlfix}/${uploadedFile.Key}`;

    console.log("cloudFrontUrl", cloudFrontUrl);

    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    // Save video data to MongoDB
    const video = new Video({
        mode: req.body.mode,
        type: req.body.type, 
        speciality: req.body.speciality, 
        title: req.body.title,
        description: req.body.description,
        file: cloudFrontUrl, 
        instructorName: req.body.instructorName, 
        experience: req.body.experience,
        location: req.body.location,
      });

    await video.save();

    res.status(200).send({ message: "working file and your video got uploaded"});// Return CloudFront URL to frontend
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.get("/getVideos", async (req, res) => {
  try {
    // Fetch all videos from MongoDB
    const videos = await Video.find();

    console.log("videos is working", videos);

    res.status(200).json({ success: true, videos });
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = router;


