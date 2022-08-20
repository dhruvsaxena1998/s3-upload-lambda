const AWS = require("aws-sdk");
const nanoid = require("nanoid-esm");
const mimetype = require("mime-types");

const s3 = new AWS.S3();

const BUCKET = "sls-media-bucket";

/**
 *
 * @param {Express.Multer.File} file
 */
const uploadByFile = async (file) => {
  const uploadParams = {
    Bucket: BUCKET,
    Body: file.buffer,
    Key: nanoid() + "." + mimetype.extension(file.mimetype),
    ContentType: file.mimetype,
  };
  console.log(uploadParams);
  const data = await s3.upload(uploadParams).promise();
  return { ...uploadParams, ...data };
};

/**
 *
 * @param {string} key
 */
const getSignedUrl = async (key) => {
  const getSignedParams = {
    Bucket: BUCKET,
    Key: key,
  };

  const signedUrl = s3.getSignedUrl("getObject", getSignedParams);
  return signedUrl;
};

module.exports = {
  uploadByFile,
  getSignedUrl,
};
