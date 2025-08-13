const fs = require('fs').promises;
const path = require('path');
const reportRepository = require('../repositories/report.repository');
const { saveFile } = require('../utils/fileStorage');

class ReportService {
  /**
   * Processes the uploaded file and returns the stored file URL/path
   */
  async processFile(file, address) {
    if (!file) return undefined;

    let fileBuffer;
    let fileName;

    // If coming from diskStorage
    if (file.path) {
      fileBuffer = await fs.readFile(file.path);
      fileName = path.basename(file.path);

      // Clean up temp file after reading
      await fs.unlink(file.path).catch(() => {});
    }
    // If coming from memoryStorage or similar
    else if (file.buffer) {
      fileBuffer = file.buffer;
      fileName = file.originalname;
    } else {
      return undefined;
    }

    // Save file to permanent storage
    return await saveFile(
      fileBuffer,
      fileName,
      process.env.BASE_URL,
      address
    );
  }

  async createReport(data, userContext) {
    try {
      const address = 'assets/reports';
      if (data.content) {
        data.content = await this.processFile(data.content, address);
      }

      return await reportRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createReport service:', error);
      throw new Error(`Failed to create report: ${error.message}`);
    }
  }

  async getReportById(id, userContext) {
    try {
      return await reportRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getReportById service:', error);
      throw new Error(`Failed to get report: ${error.message}`);
    }
  }

  async searchReports(queryParams, userContext) {
    try {
      return await reportRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchReports service:', error);
      throw new Error(`Failed to search reports: ${error.message}`);
    }
  }

  async updateReport(id, updates, userContext) {
    try {
      const address = 'assets/reports';
      if (updates.content) {
        updates.content = await this.processFile(updates.content, address);
      }

      return await reportRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateReport service:', error);
      throw new Error(`Failed to update report: ${error.message}`);
    }
  }

  async deleteReport(id, userContext) {
    try {
      return await reportRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteReport service:', error);
      throw new Error(`Failed to delete report: ${error.message}`);
    }
  }
}

module.exports = new ReportService();
