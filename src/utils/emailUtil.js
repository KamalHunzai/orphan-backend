const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// ✅ Set your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Use your single verified sender email from SendGrid (string)
const VERIFIED_SENDER =
  process.env.SENDGRID_FROM_EMAIL || "mentoring@hasene.org";

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
    from: VERIFIED_SENDER, // <- string, not object
    subject: "Your Child Account Credentials",
    text: `Welcome to ChildrenHub!\n\nHere are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
    html: `
      <h2>Welcome to ChildrenHub!</h2>
      <p>Here are your login credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please change your password after logging in.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email successfully sent to ${recipientEmail}`);
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
