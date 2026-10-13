
const express = require("express");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const ContactMessage = require("../models/contactMessage");

const router = express.Router();

// Spam protection: maximum 5 messages per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages. Please try again later.",
  },
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", contactLimiter, async (req, res) => {
  try {
    let { name, email, subject, message } = req.body || {};

    // Check that all fields contain text
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields correctly.",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    subject = subject.trim();
    message = message.trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 150 ||
      message.length > 5000 ||
      !emailRegex.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check your input and try again.",
      });
    }

    // Step 1: Save the message in MongoDB
    const savedMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      emailStatus: "pending",
    });

    // Step 2: Configure Gmail SMTP
    const port = Number(process.env.SMTP_PORT || 465);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Step 3: Send notification to your email
    try {
      await transporter.sendMail({
        from: `"WorkFlowX Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_NOTIFICATION_EMAIL,
        replyTo: email,
        subject: `WorkFlowX Contact: ${subject}`,
        text: [
          "A new message was submitted through WorkFlowX.",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          "",
          "Message:",
          message,
          "",
          `Message ID: ${savedMessage._id}`,
        ].join("\n"),
      });

      savedMessage.emailStatus = "sent";
      await savedMessage.save();

      return res.status(201).json({
        success: true,
        message: "Your message was sent successfully.",
      });
    } catch (mailError) {
      console.error("Contact email error:", mailError.message);

      savedMessage.emailStatus = "failed";
      await savedMessage.save();

      return res.status(201).json({
        success: true,
        message:
          "Your message was saved, but the email notification could not be sent.",
      });
    }
  } catch (error) {
    console.error("Contact submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your message. Please try again.",
    });
  }
});

module.exports = router;
