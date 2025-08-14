const meetingRepository = require('../repositories/meeting.repository');

class MeetingService {
  async createMeeting(data, userContext) {
    try {
      return await meetingRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createMeeting service:', error);
      throw new Error(`Failed to create meeting: ${error.message}`);
    }
  }

  async getMeetingById(id, userContext) {
    try {
      return await meetingRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getMeetingById service:', error);
      throw new Error(`Failed to get meeting: ${error.message}`);
    }
  }

  async searchMeetings(queryParams, userContext) {
    try {
      return await meetingRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchMeetings service:', error);
      throw new Error(`Failed to search meetings: ${error.message}`);
    }
  }

  async updateMeeting(id, updates, userContext) {
    try {
      return await meetingRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateMeeting service:', error);
      throw new Error(`Failed to update meeting: ${error.message}`);
    }
  }

  async deleteMeeting(id, userContext) {
    try {
      return await meetingRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteMeeting service:', error);
      throw new Error(`Failed to delete meeting: ${error.message}`);
    }
  }
}

module.exports = new MeetingService();
