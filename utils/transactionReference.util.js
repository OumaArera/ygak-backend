const crypto = require('crypto');

/**
 * Generates a unique transaction reference number.
 * Format: PREFIX-YYYYMMDDHHMMSSmmm-RANDOM
 * Example: TXN-20250814142315987-5G8K
 * 
 * @param {string} prefix Optional prefix for the reference
 * @returns {string} Unique transaction reference
 */
function generateTransactionReference(prefix = 'TXN') {
  const now = new Date();

  // Format date as YYYYMMDDHHMMSSmmm
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
    String(now.getMilliseconds()).padStart(3, '0')
  ].join('');

  // Create a short random alphanumeric string
  const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 chars

  return `${prefix}-${timestamp}-${randomPart}`;
}

module.exports = {
  generateTransactionReference
};
