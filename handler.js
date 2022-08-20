const serverless = require("serverless-http");
const express = require("express");
const multer = require("multer");

const { uploadByFile, getSignedUrl } = require("./utils/upload");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: "10mb" }));

app.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const data = await uploadByFile(req.file);
    const signedUrl = await getSignedUrl(data.Key);

    const response = {
      status: 1,
      file: {
        url: signedUrl,
        location: data.Location,
        key: data.Key,
        mimetype: data.ContentType,
      },
    };

    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Could not upload file", e });
  }
});

// app.post("/signed", (req, res) => {
//   const { filename } = req.body;

//   const params = {
//     Bucket: BUCKET,
//     Key: filename,
//   };

//   const signedUrl = s3.getSignedUrl("getObject", params);

//   res.send({ signedUrl });
// });

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
