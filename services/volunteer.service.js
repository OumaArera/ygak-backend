const path = require('path');
const volunteerRepository = require('../repositories/volunteer.repository');
const generateRegistrationNumber = require('../utils/regNumberGenerator');
const { sendEmail } = require('../utils/email.util');
const { generateWelcomeEmail } = require('../utils/welcomeEmail.html');


class VolunteerService {
  async createVolunteer(data) {
    let regNumber = data.regNumber;
    if (!regNumber || regNumber.trim() === '') {
      regNumber = await generateRegistrationNumber();
    }
    return volunteerRepository.create({...data, regNumber}, );
  }

  async getVolunteerById(id) {
    return volunteerRepository.findById(id);
  }

  async searchVolunteers(queryParams) {
    return volunteerRepository.findByQuery(queryParams);
  }

  async updateVolunteer(id, updates) {
    const updatedVolunteer = await volunteerRepository.updateById(id, updates);

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


  async deleteVolunteer(id) {
    return volunteerRepository.deleteById(id);
  }
}

module.exports = new VolunteerService();
