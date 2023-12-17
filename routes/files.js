const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../model/file");
const { v4: uuid4 } = require("uuid");
const sendMail = require("../services/sendMail");
const emailTemplate = require("../services/emailTemplate");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 100000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  // Store data
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // Validate
    if (!req.file) {
      return res.json({
        error: "All fields are required.",
      });
    }

    // store in db
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  try {
    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: "all fields are required." });
    }
    // Get data from db
    const file = await File.findOne({ uuid });

    if (!file) {
      return res.status(422).send({ error: "Link has been expired." });
    }

    if (file.sender) {
      return res.status(422).send({ error: "Email already sent." });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    // Send mail;
    const emailInfo = await sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "File share",
      text: `${emailFrom} shared a file with you`,
      html: emailTemplate({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
      }),
    });

    console.log(emailInfo);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(422).send({ error: "Unable to send email." });
  }
});

module.exports = router;
