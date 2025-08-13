const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const saveBudgetFile = async (fileBuffer, originalName, baseUrl) => {
  try {
    const folderPath = path.join(__dirname, '../assets/accounts');

    // Ensure the folder exists (async)
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }

    // Create a unique file name to avoid conflicts
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const fileName = `${baseName}-${Date.now()}-${uniqueSuffix}${ext}`;
    const filePath = path.join(folderPath, fileName);

    // Save the file asynchronously
    await fs.writeFile(filePath, fileBuffer);

    // Return full URL for browser access
    return `${baseUrl}/assets/accounts/${fileName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

// Optional: Add file deletion utility for cleanup
const deleteFile = async (fileUrl, baseUrl) => {
  try {
    const fileName = fileUrl.replace(`${baseUrl}/assets/accounts/`, '');
    const filePath = path.join(__dirname, '../assets/accounts', fileName);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch {
      // File doesn't exist, which is fine
      return false;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = { 
  saveBudgetFile,
  deleteFile 
};