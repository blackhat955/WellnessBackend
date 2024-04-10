const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const zlib = require('zlib');
const express = require('express');
const content = express();

AWS.config.update({
    accessKeyId: 'AKIA6ODU2IM6WL6FRDFM',
    secretAccessKey: '5QLmWjTIJIxPmoXmmhLVjb762NgvNI0SlApERHMg',
    region: 'us-east-1'
});
const s3 = new AWS.S3();
const bucketName = 'wellnesshealth'; // Replace with your S3 bucket name
 // Path to the video file you want to upload

const params = {
    Bucket: 'wellnesshealth'
};

content.get('/videos', (req, res) => {
    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            const videoUrls = data.Contents.map(obj => {
                return `https://dd12fyimlw2sl.cloudfront.net/${encodeURIComponent(obj.Key)}`;
            });
            res.send(videoUrls);
        }
    });
});




module.exports = content;
