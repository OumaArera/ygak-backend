const nodemailer = require('nodemailer');
const path = require('path');

// Load from environment variables for security
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

/**
 * Sends an email with HTML content and attachments
 * @param {string} to - recipient email
 * @param {string} recipientName - recipient's name
 * @param {string} subject - subject of the email
 * @param {string} htmlBody - HTML string for the email body
 * @param {Array} attachments - array of file paths for attachments
 */
async function sendEmail(to, recipientName, subject, htmlBody, attachments = []) {
  try {
    const mailOptions = {
      from: `"Youths for Green Action Kenya" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlBody,
      attachments: attachments.map(file =>
        typeof file === 'string'
          ? { filename: path.basename(file), path: file }
          : file 
      )
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientName}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


module.exports = { sendEmail };
