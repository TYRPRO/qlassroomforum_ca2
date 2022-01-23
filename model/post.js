var sequelize = require("./sequelize/databaseModel");

const { Post, Subforum, SavedPost, User,Grade } = sequelize.models;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var post = {
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
		});
	},
	getPost: function (post_id, callback) {
		Post.findOne({
			attributes: ["post_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			where: { post_id: post_id },
			include: [{
				model: User,
				required: true,
				attributes: [["first_name", "first_name"]],
			}]

			// add include once user and subforums are made
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllSubforumPosts: function (fk_subforum_id, callback) {
		Post.findAll({
			attributes: ["post_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			where: { fk_subforum_id },
			include: [{
				model: User,
				required: true,
				attributes: [["first_name", "first_name"]],
			}]

			// add include once user and subforums are made
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllPosts: function (callback) {
		// find multiple entries
		Post.findAll({
			attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			include: [
				{
					model: User,
					attributes: ["user_id","first_name", "last_name"]
				},
				{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},
				{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				},
			],
		}).then(function (result) {
			return callback(result, null);
		}).catch(function (err) {
			return callback(null, err);
		});
	},
	getAllPostByUser: function (user_id, callback) {
		Post.findAll({
			include: [
				{
					model: User,
					attributes: ["user_id", "first_name", "last_name"],
					where: { user_id: user_id },
				},
				{
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"],
				}
			]

			// add include once user and subforums are made
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllSavedPostByUser: function (user_id, callback) {
		SavedPost.findAll({
			include: [
				{
					model: User,
					attributes: ["user_id", "first_name", "last_name"],
					where: { user_id: user_id }
				}
			]

			// add include once user and subforums are made
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			console.log(err);
			callback(null, err);
		});
	},
	getFilteredPost: function (subforum_id, grade_id, isanswered, callback) {
		switch (true) {
		// If user only selects unanswered questions  -- N Subforum, grades | Y unanswered 
		case subforum_id == null && isanswered != null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes : ["user_id","first_name"],
				},{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				}],
				where: {
					fk_subforum_id: { [Op.not]: subforum_id },
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: isanswered
				}
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user unselects subject, give all post results --  N Subforum, grades, unanswered 
		case subforum_id == null && isanswered == null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes : ["user_id","first_name"],
				},{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				}],
				where: {
					fk_subforum_id: { [Op.not]: subforum_id },
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: { [Op.not]: isanswered }
				}
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user only selects a subject and nothing else -- Y Subforum | N Grades, unanswered 
		case grade_id == null && isanswered == null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes : ["user_id","first_name"],
				},{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				}],
				where: {
					fk_subforum_id: subforum_id,
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: { [Op.not]: isanswered }
				}
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If User only selects subjects that is unanswered -- Y Subforum | N Grades | Y unanswered
		case grade_id == null && isanswered != null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes : ["user_id","first_name"],
				},{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				}],
				where: {
					fk_subforum_id: subforum_id,
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: isanswered
				},

			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user selects a subject with grades that is either answered or answered -- Y Subforum, Grades | N answered
		case grade_id != null && isanswered == null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes : ["user_id","first_name"],
				},{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				}],
				where: {
					fk_subforum_id: subforum_id,
					fk_grade_id: grade_id,
					post_is_answered: { [Op.not]: isanswered }
				}

			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user selects a subject, grade and unanswered questions -- Y Subforum, grades, unanswered
		default:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id","fk_user_id","fk_grade_id","post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes : ["user_id","first_name"],
				},{
					model: Grade,
					attributes: ["grade_id","grade_name"]
				},{
					model: Subforum,
					attributes: ["subforum_id","subforum_name"]
				}],
				where: { fk_subforum_id: subforum_id, fk_grade_id: grade_id, post_is_answered: isanswered },
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
		}
	},
	searchPost: function (title, callback) {
		Post.findAll({
			where: { post_title: { [Op.like]: "%" + title + "%" } },
			attributes: ["post_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			include: [
				{
					model: User,
					attributes: ["first_name","last_name"]
				},
				{
					model: Subforum,
					attributes: ["subforum_name"]
				},
			],
		}).then(function (result) {
			callback(null, result);
		}).catch(function (err) {
			console.log(err);
			callback(err, null);
		});
	},
};

module.exports = post;