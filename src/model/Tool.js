const mongoose = require('../config/database');

/**
 * Definicao do modelo "tool" para o banco de dados
 */
var toolSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	link: {
		type: String,
	},
	description: {
		type: String,
	},
	tags: {
		type: Array,
		default: [],
	},
	created_At: {
		type: Date,
		default: Date.now,
		select: false,
	},
});

module.exports = mongoose.model('Tool', toolSchema);
