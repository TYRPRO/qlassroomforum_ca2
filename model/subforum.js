var sequelize = require('./sequelize/databaseModel');
const { Subforum } =  sequelize.models;

var subforum = { 
	// Function to get Subjects/Subforum for landing page Channel
    getSubjects: function (callback) {
        Subforum.findAll({
            attributes: ['subforum_id', 'subforum_name'],
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    }
}

module.exports = subforum;