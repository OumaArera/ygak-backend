const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = Buffer.from(process.env.DONATION_ENCRYPTION_KEY, 'hex');
const IV_LENGTH = parseInt(process.env.IV_LENGTH);
const TIMESTAMP_TOLERANCE = parseInt(process.env.TIMESTAMP_TOLERANCE);

class DonationEncryptionService {
  /**
   * Encrypts donation data with timestamp for client-side usage
   * @param {object} data - The donation data to encrypt
   * @param {number} timestamp - The current timestamp
   * @returns {string} - Base64 encoded encrypted payload
   */
  static encrypt(data, timestamp) {
    try {
      const payload = JSON.stringify({
        data,
        timestamp
      });

      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
      
      const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
      const authTag = cipher.getAuthTag();

      const encryptedPayload = Buffer.concat([iv, authTag, encrypted]).toString('base64');
      return encryptedPayload;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypts donation data and validates timestamp
   * @param {string} encryptedPayload - Base64 encoded encrypted payload
   * @returns {object} - Decrypted data
   */
  static decrypt(encryptedPayload) {
    try {
      const data = Buffer.from(encryptedPayload, 'base64');
      const iv = data.subarray(0, IV_LENGTH);
      const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
      const encrypted = data.subarray(IV_LENGTH + 16);

      const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      const payload = JSON.parse(decrypted.toString('utf8'));
      
      // Validate timestamp
      const currentTime = Date.now();
      const timeDifference = Math.abs(currentTime - payload.timestamp);
      
      if (timeDifference > TIMESTAMP_TOLERANCE) {
        throw new Error('Request timestamp is outside acceptable range');
      }

      return payload.data;
    } catch (error) {
      if (error.message.includes('timestamp')) {
        throw error;
      }
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Generates current timestamp for client usage
   * @returns {number} - Current timestamp
   */
  static getCurrentTimestamp() {
    return Date.now();
  }
}

/**
 * Middleware to decrypt donation data from public endpoints
 */
const decryptDonationData = (req, res, next) => {
  try {
    // Check if request has encrypted payload
    if (!req.body.encryptedData) {
      return res.status(400).json({
        success: false,
        error: 'Encrypted data is required for public donations'
      });
    }

    // Decrypt the payload
    const decryptedData = DonationEncryptionService.decrypt(req.body.encryptedData);
    
    // Replace request body with decrypted data
    req.body = decryptedData;
    
    // Add client IP and user agent to request for logging
    req.clientInfo = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    next();
  } catch (error) {
    console.error('Decryption middleware error:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid encrypted data or request has expired'
    });
  }
};

/**
 * Endpoint to get current timestamp for client-side encryption
 */
const getTimestamp = (req, res) => {
  try {
    const timestamp = DonationEncryptionService.getCurrentTimestamp();
    res.status(200).json({
      success: true,
      timestamp,
      tolerance: TIMESTAMP_TOLERANCE
    });
  } catch (error) {
    console.error('Get timestamp error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get timestamp'
    });
  }
};

module.exports = {
  DonationEncryptionService,
  decryptDonationData,
  getTimestamp
};