const path = require('path');
const volunteerRepository = require('../repositories/volunteer.repository');
const generateRegistrationNumber = require('../utils/regNumberGenerator');
const { sendEmail } = require('../utils/email.util');
const { generateWelcomeEmail } = require('../utils/welcomeEmail.html');


class VolunteerService {
  async createVolunteer(data, userContext) {
    // const regNumber = await generateRegistrationNumber();
    let regNumber = data.regNumber;
    if (!regNumber || regNumber.trim() === '') {
      regNumber = await generateRegistrationNumber();
    }
    return volunteerRepository.create({...data, regNumber}, userContext);
  }

  async getVolunteerById(id, userContext) {
    return volunteerRepository.findById(id, userContext);
  }

  async searchVolunteers(queryParams, userContext) {
    return volunteerRepository.findByQuery(queryParams, userContext);
  }

  async updateVolunteer(id, updates, userContext) {
    const updatedVolunteer = await volunteerRepository.updateById(id, updates, userContext);

    if (!updatedVolunteer) return null;

    // Check if isApproved is set to true in this update
    if (updates.isApproved === true) {
      const emailHtml = generateWelcomeEmail(
        updatedVolunteer.firstName || updatedVolunteer.otherNames || "Member",
        updatedVolunteer.regNumber
      );

      // Send the welcome email
      await sendEmail(
        updatedVolunteer.email,
        `${updatedVolunteer.firstName} ${updatedVolunteer.otherNames || ''}`.trim(),
        "Welcome to Youths for Green Action Kenya",
        emailHtml,
        [
          {
            filename: "YGA_Welcome_Pack.pdf",
            path: path.join(__dirname, '../assets/uploads/John Ouma - 2024-09-20.pdf')
          },
          {
            filename: "YGA_Mission_Statement.pdf",
            path: path.join(__dirname, '../assets/uploads/John Ouma - 2024-09-20.pdf')
          }
        ]
      );

    }

    return updatedVolunteer;
  }


  async deleteVolunteer(id, userContext) {
    return volunteerRepository.deleteById(id, userContext);
  }
}

module.exports = new VolunteerService();
