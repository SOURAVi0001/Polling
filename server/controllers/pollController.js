const Poll = require('../models/Poll');

// List past polls for a specific teacher
exports.listPastPolls = async (req, res) => {
      try {
            const { teacherName } = req.query;
            console.log('🔍 Fetching past polls for teacher:', teacherName);

            if (!teacherName) {
                  return res.status(400).json({ error: 'Teacher name is required' });
            }

            const polls = await Poll.find({
                  isActive: false,
                  teacherName: teacherName
            }).sort({ createdAt: -1 }).limit(50);

            console.log(`✅ Found ${polls.length} past polls for teacher: ${teacherName}`);
            res.json(polls);
      } catch (err) {
            console.error('❌ Error fetching polls:', err);
            res.status(500).json({ error: 'Server error' });
      }
};

exports.getPollById = async (req, res) => {
      try {
            const poll = await Poll.findById(req.params.id);
            if (!poll) return res.status(404).json({ error: 'Poll not found' });
            res.json(poll);
      } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
      }
};
