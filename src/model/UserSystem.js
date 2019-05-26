const mongoose = require('../config/database');

var userSystemSchema = new mongoose.Schema({
	secretId: { type: String },
	secretKey: { type: String },
});

module.exports = mongoose.model('UserSystem', userSystemSchema);
