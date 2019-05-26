var mongoose = require('mongoose');

const connectionUrl = 'mongodb://localhost/tools_db';

mongoose.connect(connectionUrl, {
	useNewUrlParser: true,
});

module.exports = mongoose;
