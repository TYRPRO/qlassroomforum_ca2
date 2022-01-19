//ADES CA1 Play2Win
const { Sequelize, DataTypes } = require("sequelize");

// ElephantSQL Credentials
// const database = "ijlipomt";
// const user = "ijlipomt";
// const password = "e_rRJlw0RbrjeYODCGlFzBk4zcFPC8H8";
// const host = "john.db.elephantsql.com";


const sequelize = new Sequelize("postgres://ijlipomt:e_rRJlw0RbrjeYODCGlFzBk4zcFPC8H8@john.db.elephantsql.com:5432/ijlipomt", {
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 1000,
	},
	define: {
		freezeTableName: true,
		createdAt: false,
		updatedAt: false,
	},
});

// Checks Connection to Database
async function checkConnection() {
	try {
		await sequelize.authenticate();
		console.log("Sequelize established connection with database successfully");
	} catch (error) {
		console.error("Unable to connect to the database", error);
	}
}

checkConnection();

const User = sequelize.define("User", {
	user_id: {
		type: DataTypes.UUID,
		allowNull: true,
		primaryKey: true,
	},
	first_name: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	last_name: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	email: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	roles: {
		type: DataTypes.ARRAY(DataTypes.TEXT),
		allowNull: false,
	},
	phone_number: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	verification_expiry: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	grade_id: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	stream_id: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	is_temp: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
	last_login: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});

const Subforum = sequelize.define("Subforum", {
	subforum_id: {
		type: DataTypes.UUID,
		allowNull: true,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV4,
		unique: true,
	},
	subforum_name: {
		type: DataTypes.STRING(45),
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	subforum_description: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	subforum_created_at: {
		type: DataTypes.TIME,
		allowNull: true,
	},
	subforum_followers_count: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
});

const Post = sequelize.define("Post", {
	post_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	fk_subforum_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	post_title: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	post_content: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	post_is_pinned: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
	post_created_at: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	post_is_answered: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
	fk_grade_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	post_rating: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	post_answers_count: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	fk_answer_id: {
		type: DataTypes.UUID,
		allowNull: true,
	}

});

const Answer = sequelize.define("Answer", {
	answer_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	fk_post_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	answer: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	answer_created_at: {
		type: DataTypes.DATE,
		allowNull: true,
	}
});

const Grade = sequelize.define("Grade", {
	grade_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	grade_name: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
});

const Authenticate = sequelize.define("Authenticate", {
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: true,
		primaryKey: true,
	},
	password: {
		type: DataTypes.TEXT,
		allowNull: false,
	},

});

Answer.belongsTo(Post, { foreignKey: "fk_post_id" });
Post.hasMany(Answer, { foreignKey: "fk_post_id" });

Answer.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Answer, { foreignKey: "fk_user_id" });

Post.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Post, { foreignKey: "fk_user_id" });

Authenticate.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasOne(Authenticate, { foreignKey: "fk_user_id" });

Post.belongsTo(Grade, { foreignKey: "fk_grade_id" });
Grade.hasMany(Post, { foreignKey: "fk_grade_id" });

Subforum.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Subforum, { foreignKey: "fk_user_id" });

Post.belongsTo(Subforum, { foreignKey: "fk_subforum_id" });
Subforum.hasMany(Post, { foreignKey: "fk_subforum_id" });

async function syncing() {
	await User.sync();
	await Subforum.sync();
	console.log("Test synchronized successfully.");
}
syncing();
module.exports = sequelize;
