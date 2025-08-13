function generateAccountCredentialsEmail(name, username, password) {
  return `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
      
      <!-- Header -->
      <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Your YGAK Account Details</h1>
      </div>

      <!-- Body -->
      <div style="padding: 20px; color: #333; font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are pleased to inform you that an account has been created for you in the <strong>Youths for Green Action Kenya</strong> system.</p>

        <p>Your login credentials are as follows:</p>
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>

        <p>For your security, we strongly recommend changing your password after your first login.</p>
        <p>You can log in to the system here: <a href="https://ygak.org/login" style="color: #007bff; text-decoration: none;">YGAK Login Portal</a></p>

        <br/>
        <p>Best regards,</p>
        <p><strong>YGAK Team</strong></p>
      </div>

      <!-- Footer -->
      <div style="background-color: #eee; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        © ${new Date().getFullYear()} Youths for Green Action Kenya. All rights reserved.
      </div>
    </div>
  `;
}

module.exports = { generateAccountCredentialsEmail };
