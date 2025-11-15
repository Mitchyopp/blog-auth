const sequelize = require('../config/db');

const User = require('./User.js')(sequelize);
const Post = require('./Post.js')(sequelize);
const Category = require('./Category.js')(sequelize);
