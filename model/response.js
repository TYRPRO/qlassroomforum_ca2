var sequelize = require("./sequelize/databaseModel");
const { Response, ResponseType } = sequelize.models;

var response = {
	createResponse: function (response, parent_response_id, response_type, post_id, user_id, callback) {
		ResponseType.findAll().then(function (result) {
			var response_type_id = null;
			for (var i = 0; i < result.length; i++) {
				if (response_type === result[i].response_type) {
					response_type_id = result[i].response_type_id;
					break;
				}
			}

			if (response_type_id === null) {
				return callback("Response Type ID is null" , null);
			}

			Response.create({
				response: response,
				parent_response_id: parent_response_id,
				fk_response_type_id: response_type_id,
				fk_post_id: post_id,
				fk_user_id: user_id,
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getResponses: function (post_id, callback) {
		Response.findAll({
			where: { fk_post_id: post_id },
			include: [{
				model: ResponseType,
			}]
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
};

module.exports = response;