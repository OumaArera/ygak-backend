const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const saveFile = async (fileBuffer, originalName, baseUrl, address) => {
  try {
    const folderPath = path.join(__dirname, `../${address}`);

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
    return `${baseUrl}/${address}/${fileName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

// Optional: Add file deletion utility for cleanup
const deleteFile = async (fileUrl, baseUrl) => {
  try {
    const fileName = fileUrl.replace(`${baseUrl}/${address}/`, '');
    const filePath = path.join(__dirname, `../${address}`, fileName);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = { 
  saveFile,
  deleteFile 
};