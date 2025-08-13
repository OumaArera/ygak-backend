function generateWelcomeEmail(name, registrationNumber) {
  return `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
      
      <!-- Header -->
      <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Welcome to Youths for Green Action Kenya</h1>
      </div>

      <!-- Body -->
      <div style="padding: 20px; color: #333; font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are excited to have you on board in our mission for a greener and more sustainable future.</p>
        
        <p>Your <strong>Registration Number</strong> is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <h2 style="color: #28a745; font-size: 28px; margin: 0;">${registrationNumber}</h2>
        </div>

        <p>Please keep this number safe for future reference in our programs and activities.</p>
        <p>We look forward to working with you to make a positive impact.</p>

        <br/>
        <p>Best regards,</p>
        <p><strong>YGAK Team</strong></p>

        <!-- Social Links -->
        <div style="margin-top: 20px; text-align: center;">
          <p style="font-size: 14px; color: #666;">Follow us on:</p>
          <a href="https://www.facebook.com/ygak" style="margin: 0 8px; text-decoration: none; color: #3b5998; font-weight: bold;">Facebook</a> |
          <a href="https://twitter.com/ygak" style="margin: 0 8px; text-decoration: none; color: #1DA1F2; font-weight: bold;">Twitter</a> |
          <a href="https://www.instagram.com/ygak" style="margin: 0 8px; text-decoration: none; color: #E1306C; font-weight: bold;">Instagram</a> |
          <a href="https://www.linkedin.com/company/ygak" style="margin: 0 8px; text-decoration: none; color: #0077B5; font-weight: bold;">LinkedIn</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #eee; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        © ${new Date().getFullYear()} Youths for Green Action Kenya. All rights reserved.
      </div>
    </div>
  `;
}
module.exports = { generateWelcomeEmail };