const express = require("express");
const router = express.Router();
const application = require("../Model/Application");


const { sendStatusNotification } = require("../index.js"); 


router.post("/", async (req, res) => {
  const applicationipdata = new application({
    company: req.body.company,
    category: req.body.category,
    coverLetter: req.body.coverLetter,
    user: req.body.user, 
    Application: req.body.Application,
    body: req.body.body,
  });
  await applicationipdata
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
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


    const userId = updateapplication._id;
    sendStatusNotification(userId.toString(), status); 

    return res.status(200).json({ success: true, data: updateapplication });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
