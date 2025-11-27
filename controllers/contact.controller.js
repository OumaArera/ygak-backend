const ContactService = require('../services/contact.service');

class ContactController {
  async submit(req, res) {
    try {
      const result = await ContactService.submitContact(req.body);
      return res.status(201).json({
        success: true,
        message: 'Your message has been received successfully. We will be in touch soon.',
        data: { id: result.id },
      });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while processing your request.',
      });
    }
  }

  // R - Read All
  async getAll(req, res) {
    try {
      const result = await ContactService.getAll(req.query);
      return res.status(200).json({
        success: true,
        message: 'Contact submissions retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // R - Read By ID
  async getById(req, res) {
    try {
      const result = await ContactService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await ContactService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Contact submission deleted successfully',
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * U - Handles PUT /contact/:id requests to update a message.
   */
  async update(req, res) {
    try {
      const result = await ContactService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Contact submission updated successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Update failed',
      });
    }
  }

}

module.exports = new ContactController();