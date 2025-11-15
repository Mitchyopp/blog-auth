const sequelize = require('../config/db');

const User = require('./User.js')(sequelize);
const Post = require('./Post.js')(sequelize);
const Category = require('./Category.js')(sequelize);

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
Category.hasMany(Post, { foreignKey: 'categoryId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User,
  Post,
  Category,
};
