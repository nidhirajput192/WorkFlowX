
const express = require("express");
const Project = require("../models/project");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all projects of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch projects.",
    });
  }
});

// Create a project
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, status, priority, deadline } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      status,
      priority,
      deadline: deadline || null,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to create project.",
    });
  }
});

// Add a member to a project
router.post("/:id/members", auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Member email is required.",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const User = require("../models/user");

    const member = await User.findOne({
      email: email.trim().toLowerCase(),
    });
console.log("Member email searched:", email.trim().toLowerCase());
console.log("Member found:", member ? member.email : "NOT FOUND");
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No registered user found with this email.",
      });
    }

    if (member._id.equals(project.owner)) {
      return res.status(400).json({
        success: false,
        message: "Project owner is already part of the project.",
      });
    }

    if (project.members.some((id) => id.equals(member._id))) {
      return res.status(400).json({
        success: false,
        message: "This member is already added.",
      });
    }

    project.members.push(member._id);
    await project.save();
    await project.populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Member added successfully.",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add member.",
    });
  }
});

// Remove a member from a project
router.delete("/:id/members/:memberId", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const memberExists = project.members.some(
      (id) => id.toString() === req.params.memberId
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this project.",
      });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== req.params.memberId
    );

    await project.save();
    await project.populate("members", "name email");

    res.json({
      success: true,
      message: "Member removed successfully.",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to remove member.",
    });
  }
});

// Update a project
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "status",
      "priority",
      "deadline",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    }

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to update project.",
    });
  }
});

// Delete a project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Delete tasks belonging to this project
    const Task = require("../models/task");
    await Task.deleteMany({ project: project._id });

    res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete project.",
    });
  }
});

module.exports = router;
