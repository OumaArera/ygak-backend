const TaskService = require('../services/task.service');

class TaskController {
  async create(req, res) {
    try {
      const task = await TaskService.createTask(req.body, req.user);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id, req.user);
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.status(200).json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const tasks = await TaskService.searchTasks(req.query, req.user);
      res.status(200).json({ success: true, data: tasks });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await TaskService.updateTask(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await TaskService.deleteTask(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.status(204).json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new TaskController();
