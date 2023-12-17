const router = require("express").Router();
const File = require("../model/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("download", { error: "Link has been expired." });
    }

    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    console.log(error);
    return res.render("download", { error: "Something went wrong." });
  }
});

router.get("/download/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("download", { error: "Link has been expired." });
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
