var sequelize = require('./sequelize/databaseModel');
const { Post } =  sequelize.models;

var post  = { 
    createPost: function (user_id, subforum_id, title, content, callback) {
        Post.create({ 
            post_title: title,
            post_content: content,
            fk_user_id: user_id,
            fk_subforum_id: subforum_id,
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    },
    getPost: function (post_id, callback) {
        Post.findOne({
            attributes: ['post_id', 'post_title', 'post_content', 'post_is_pinned', 'post_is_answered', 'post_created_at'],
            where: { post_id: post_id },
            
            // add include once user and subforums are made
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    }
}

module.exports = post;