const serverless = require("serverless-http");
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const { uploadByFile } = require("./utils/upload");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const data = await uploadByFile(req.file);
    const { cache = "false", output = "webp" } = req.query;

    const response = {
      success: 1,
      file: {
        url:
          cache === "true"
            ? `https://images.weserv.nl/?url=${data.Location}&maxage=7w&output=${output}`
            : data.Location,
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

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
