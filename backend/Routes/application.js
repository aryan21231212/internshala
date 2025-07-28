const express = require("express");
const router = express.Router();
const {cloudinary} = require('../cloudConfig.js')
const application = require("../Model/Application");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })




const { sendStatusNotification } = require("../socketUtils.js");



router.post("/", upload.single('video'), async (req, res) => {
  try {
    console.log("Received application data:", req.body); // Debug log
    console.log("Received file:", req.file); // Debug log

    let videoData = null;
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'video',
        folder: 'internship_applications'
      });

      videoData = {
        public_id: result.public_id,
        url: result.secure_url,
        duration: result.duration,
        format: result.format,
        uploadedAt: new Date()
      };
    }

    // Parse JSON fields from FormData
    const applicationData = {
      company: req.body.company,
      category: req.body.category,
      coverLetter: req.body.coverLetter,
      user: JSON.parse(req.body.user),
      Application: req.body.Application,
      availability: req.body.availability,
      video: videoData
    };

    console.log("Creating application with:", applicationData); // Debug log

    const savedApplication = await application.create(applicationData);
    
    res.status(201).json({
      success: true,
      data: savedApplication
    });

  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit application",
      details: error.message
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const data = await application.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await application.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  let status;
  if (action === "accepted") {
    status = "accepted";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const updateapplication = await application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updateapplication) {
      return res.status(404).json({ error: "Application not found" });
    }


    const userId = updateapplication.user.uid;
    sendStatusNotification(userId.toString(), status); 

    return res.status(200).json({ success: true, data: updateapplication });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
