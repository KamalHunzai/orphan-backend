const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// ✅ Set your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Use your single verified sender email from SendGrid
const VERIFIED_SENDER = process.env.SENDGRID_FROM_EMAIL; // mentoring@hasene.org

/**
 * Send account credentials email
 * @param {string} recipientEmail - Recipient's email
 * @param {string} email - Account email
 * @param {string} password - Account password
 * @returns {Promise<boolean>}
 */
const sendEmail = async (recipientEmail, email, password) => {
  const msg = {
    to: recipientEmail,
    from: {
      email: VERIFIED_SENDER,
      name: "ChildrenHub Support",
    },
    subject: "Your Child Account Credentials",
    text: `Welcome to ChildrenHub!\n\nHere are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
  };

  try {
    const [response] = await sgMail.send(msg); // destructure the first response
    console.log("✅ Email sent successfully.");

    // Response headers contain the message ID
    console.log("Message ID:", response.headers["x-message-id"] || "N/A");

    return true;
  } catch (error) {
    console.error(
      "❌ SendGrid Error:",
      error.response?.body?.errors || error.message
    );
    return false;
  }
};

module.exports = sendEmail;
