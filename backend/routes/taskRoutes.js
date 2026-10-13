
// const express = require("express");
// const Task = require("../models/task");
// const Project = require("../models/project");
// const auth = require("../middleware/auth");

// const router = express.Router();

// // Get tasks for the logged-in user's projects
// router.get("/", auth, async (req, res) => {
//   try {
//     const projects = await Project.find({
//       $or: [
//         { owner: req.user._id },
//         { members: req.user._id },
//       ],
//     }).select("_id");

//     const projectIds = projects.map((project) => project._id);

//     const tasks = await Task.find({
//       project: { $in: projectIds },
//     })
//       .populate("project", "name")
//       .populate("assignedTo", "name email")
//       .populate("createdBy", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: tasks.length,
//       tasks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch tasks.",
//     });
//   }
// });

// // Create a task
// router.post("/", auth, async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       projectId,
//       assignedTo,
//     } = req.body;

//     if (!title || !title.trim() || !projectId) {
//       return res.status(400).json({
//         success: false,
//         message: "Task title and projectId are required.",
//       });
//     }

//     const project = await Project.findOne({
//       _id: projectId,
//       $or: [
//         { owner: req.user._id },
//         { members: req.user._id },
//       ],
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found or access denied.",
//       });
//     }
    
// if (assignedTo) {
//   const isProjectMember =
//     project.owner.toString() === assignedTo ||
//     project.members.some(
//       (memberId) => memberId.toString() === assignedTo
//     );

//   if (!isProjectMember) {
//     return res.status(400).json({
//       success: false,
//       message: "Task can only be assigned to a project member.",
//     });
//   }
// }



// if (req.body.assignedTo) {
//   const isProjectMember =
//     project.owner.toString() === req.body.assignedTo ||
//     project.members.some(
//       (memberId) =>
//         memberId.toString() === req.body.assignedTo
//     );

//   if (!isProjectMember) {
//     return res.status(400).json({
//       success: false,
//       message: "Task can only be assigned to a project member.",
//     });
//   }
// }


//     const task = await Task.create({
//       title: title.trim(),
//       description,
//       status,
//       priority,
//       dueDate: dueDate || null,
//       project: project._id,
//       assignedTo: assignedTo || null,
//       createdBy: req.user._id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Task created successfully.",
//       task,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Unable to create task.",
//     });
//   }
// });

// // Update a task
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found.",
//       });
//     }

//     const project = await Project.findOne({
//       _id: task.project,
//       $or: [
//         { owner: req.user._id },
//         { members: req.user._id },
//       ],
//     });

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message: "You cannot update this task.",
//       });
//     }

//     const allowedFields = [
//       "title",
//       "description",
//       "status",
//       "priority",
//       "dueDate",
//       "assignedTo",
//     ];

//     for (const field of allowedFields) {
//       if (req.body[field] !== undefined) {
//         task[field] = req.body[field];
//       }
//     }

//     await task.save();

//     res.json({
//       success: true,
//       message: "Task updated successfully.",
//       task,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Unable to update task.",
//     });
//   }
// });

// // Delete a task
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found.",
//       });
//     }

//     const project = await Project.findOne({
//       _id: task.project,
//       $or: [
//         { owner: req.user._id },
//         { members: req.user._id },
//       ],
//     });

//     if (!project) {
//       return res.status(403).json({
//         success: false,
//         message: "You cannot delete this task.",
//       });
//     }

//     await task.deleteOne();

//     res.json({
//       success: true,
//       message: "Task deleted successfully.",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Unable to delete task.",
//     });
//   }
// });

// module.exports = router;




const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

// Check whether the assigned user belongs to this project
const isProjectMember = (project, userId) => {
  if (!userId) return true;

  const id = userId.toString();

  return (
    project.owner.toString() === id ||
    project.members.some((memberId) => memberId.toString() === id)
  );
};

// Get tasks for the logged-in user's projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch tasks.",
    });
  }
});

// Create a task
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assignedTo,
    } = req.body;

    if (!title || !title.trim() || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Task title and projectId are required.",
      });
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied.",
      });
    }

    if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assigned user ID.",
      });
    }

    if (assignedTo && !isProjectMember(project, assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Task can only be assigned to a project member.",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || null,
      project: project._id,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(400).json({
      success: false,
      message: "Unable to create task.",
    });
  }
});

// Update a task
router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this task.",
      });
    }

    if (req.body.assignedTo) {
      if (!mongoose.isValidObjectId(req.body.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID.",
        });
      }

      if (!isProjectMember(project, req.body.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Task can only be assigned to a project member.",
        });
      }
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "assignedTo",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "title") {
          if (
            typeof req.body.title !== "string" ||
            !req.body.title.trim()
          ) {
            return res.status(400).json({
              success: false,
              message: "Task title cannot be empty.",
            });
          }

          task.title = req.body.title.trim();
        } else if (field === "dueDate") {
          task.dueDate = req.body.dueDate || null;
        } else {
          task[field] = req.body[field];
        }
      }
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      message: "Task updated successfully.",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(400).json({
      success: false,
      message: "Unable to update task.",
    });
  }
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this task.",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(400).json({
      success: false,
      message: "Unable to delete task.",
    });
  }
});

module.exports = router;
