var sequelize = require("./sequelize/databaseModel.js");
const { PostVote, Post, Subforum } = sequelize.models;

var vote = {
	createPostVote: function (vote_type, fk_post_id, fk_user_id, callback) {
		PostVote.create({
			vote_type: vote_type,
			fk_post_id: fk_post_id,
			fk_user_id: fk_user_id
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves all the votes for *all* posts.  
	getPostVotes: function (fk_post_id, callback) {
		PostVote.findAll({
			where: {
				fk_post_id: fk_post_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves users votes for a specific post
	getUserPostVotes: function (fk_user_id, fk_post_id, callback) {
		PostVote.findAll({
			where: {
				fk_post_id: fk_post_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves users votes for a specific Subforum
	getUserSubforumPostVotes: function (fk_user_id,fk_Subforum_id, callback) {
		PostVote.findAll({
			where: {
				fk_user_id:fk_user_id
			},
			include: [{
				model: Post,
				include: [{
					model: Subforum,
					where: {
						Subforum_id: fk_Subforum_id
					}
				}]
			}]
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			console.log(err);
			callback(null, err);
		});
	},
	updatePostVote: function (vote_type, fk_post_id, fk_user_id, callback) {
		PostVote.update({
			vote_type: vote_type
		}, {
			where: {
				fk_post_id: fk_post_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result , null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	deletePostVote: function (fk_post_id, fk_user_id, callback) {
		PostVote.destroy({
			where: {
				fk_post_id: fk_post_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	getUserVotes: function (fk_user_id, callback) {
		PostVote.findAll({
			where: {
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});  
	},
};

module.exports = vote;