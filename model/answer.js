var sequelize = require('./sequelize/databaseModel');
const { Answer, User } =  sequelize.models;

var answer = { 
    createAnswer: function (user_id, post_id, answer, callback) {
        Answer.create({ 
            fk_user_id: user_id,
            fk_post_id: post_id,
            answer: answer,
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    },
    getAnswersForPost: function (post_id, callback) {
        Answer.findAll({
            attributes: ['answer_id', 'answer','answer_created_at'],
            where: { fk_post_id: post_id },
            include: [{ 
                model: User,
                attributes: ['user_id', 'first_name', 'last_name'],
            }]
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    }
}

module.exports = answer;