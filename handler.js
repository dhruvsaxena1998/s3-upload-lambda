const AWS = require("aws-sdk");
const serverless = require("serverless-http");
const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: "10mb" }));

const BUCKET = "serverless-media-bucket-s3";
const s3 = new AWS.S3();

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.post("/upload", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  const params = {
    Bucket: BUCKET,
    Body: file.buffer,
    Key: new Date().toISOString() + file.originalname,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return res.status(200).json({
      url: data.Location,
      etag: data.ETag,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Could not upload file", e });
  }
});

app.post("/signed", (req, res) => {
  const { filename } = req.body;

  const params = {
    Bucket: BUCKET,
    Key: filename,
  };

  const signedUrl = s3.getSignedUrl("getObject", params);

  res.send({ signedUrl });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
