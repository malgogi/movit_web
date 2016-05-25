var mongoose = require('mongoose');
var querySchema = mongoose.Schema({
	name: String
});

var query = mongoose.model('Query', querySchema);
module.exports = query;
