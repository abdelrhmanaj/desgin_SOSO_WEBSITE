const Opinion = require('../models/Opinion');

const createOpinion = async (req, res) => {
  try {
    const { name, comment } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }

    const opinion = await Opinion.create({
      name,
      comment,
    });

    res.status(201).json({ success: true, data: opinion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOpinions = async (req, res) => {
  try {
    const opinions = await Opinion.find({ isVisible: true }).sort({ createdAt: -1 }).limit(12);
    res.json({ success: true, data: opinions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminOpinions = async (req, res) => {
  try {
    const opinions = await Opinion.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: opinions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOpinionVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Visibility must be true or false' });
    }

    const opinion = await Opinion.findById(req.params.id);
    if (!opinion) {
      return res.status(404).json({ success: false, message: 'Opinion not found' });
    }

    opinion.isVisible = isVisible;
    const updatedOpinion = await opinion.save();

    res.json({ success: true, data: updatedOpinion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteOpinion = async (req, res) => {
  try {
    const opinion = await Opinion.findById(req.params.id);
    if (!opinion) {
      return res.status(404).json({ success: false, message: 'Opinion not found' });
    }

    await opinion.deleteOne();
    res.json({ success: true, message: 'Opinion deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOpinion,
  getOpinions,
  getAdminOpinions,
  updateOpinionVisibility,
  deleteOpinion,
};
