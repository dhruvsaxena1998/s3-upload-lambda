const AWS = require("aws-sdk");
const nanoid = require("nanoid-esm");

const s3 = new AWS.S3();

const BUCKET = "sls-media-bucket";

const getDirectoryWithDate = () => {
  const date = new Date();
  // @returns -> 2022/7
  return `${date.getFullYear()}/${date.getMonth()}`;
};

/**
 *
 * @param {Express.Multer.File} file
 */
const uploadByFile = async (file) => {
  const uploadParams = {
    Bucket: BUCKET,
    Body: file.buffer,
    Key: `${getDirectoryWithDate()}/${nanoid()}-${file.originalname}`,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  return s3.upload(uploadParams).promise();
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

  return s3.getSignedUrl("getObject", getSignedParams);
};

module.exports = {
  uploadByFile,
  getSignedUrl,
};
