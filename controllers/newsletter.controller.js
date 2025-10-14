const Newsletter = require('../models/newsletter.model');

class NewsletterController {
  // Subscribe to newsletter
  static async subscribe(req, res) {
    try {
      const { email } = req.body;

      // Check if email exists
      const existing = await Newsletter.findOne({ where: { email } });
      if (existing) {
        if (existing.isActive) {
          return res.status(400).json({
            success: false,
            message: 'This email is already subscribed.'
          });
        } else {
          existing.isActive = true;
          await existing.save();
          return res.status(200).json({
            success: true,
            message: 'Subscription reactivated successfully.',
            data: existing
          });
        }
      }

      const subscription = await Newsletter.create({ email });
      return res.status(201).json({
        success: true,
        message: 'Subscribed successfully!',
        data: subscription
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while subscribing to newsletter',
        error: error.message
      });
    }
  }

  // Unsubscribe (soft deactivate)
  static async unsubscribe(req, res) {
    try {
      const { email } = req.body;

      const subscription = await Newsletter.findOne({ where: { email } });
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found for this email.'
        });
      }

      subscription.isActive = false;
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: 'You have unsubscribed successfully.',
        data: subscription
      });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while unsubscribing',
        error: error.message
      });
    }
  }

  // Get all subscribers (admin use)
  static async list(req, res) {
    try {
      const { isActive, page = 1, limit = 20 } = req.query;
      const where = {};

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const offset = (page - 1) * limit;

      const subscribers = await Newsletter.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Subscribers retrieved successfully.',
        data: subscribers.rows,
        total: subscribers.count,
        page: parseInt(page),
        pages: Math.ceil(subscribers.count / limit),
      });
    } catch (error) {
      console.error('Error retrieving subscribers:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching newsletter list',
        error: error.message
      });
    }
  }
}

module.exports = NewsletterController;
