const EventRegisterRepository = require('../repositories/eventRegister.repository');
const { Event } = require('../models');

class EventRegisterService {
  async register(data) {
    const event = await Event.findByPk(data.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const existing = await EventRegisterRepository.findByQuery({
      eventId: data.eventId,
      email: data.email,
    });

    if (existing.rows && existing.rows.length > 0) {
      throw new Error('You have already registered for this event.');
    }

    return await EventRegisterRepository.create(data);
  }

  async getAll(query) {
    return await EventRegisterRepository.findByQuery(query);
  }

  async getById(id) {
    const record = await EventRegisterRepository.findById(id);
    if (!record) throw new Error('Registration not found');
    return record;
  }

  async delete(id) {
    const record = await EventRegisterRepository.deleteById(id);
    if (!record) throw new Error('Registration not found');
    return record;
  }
}

module.exports = new EventRegisterService();
