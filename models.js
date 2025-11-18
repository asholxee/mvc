const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false }
});

const Supplier = sequelize.define('Supplier', {
    name: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING }
});

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
});

Product.belongsTo(Category);
Product.belongsTo(Supplier);
Category.hasMany(Product);
Supplier.hasMany(Product);

module.exports = { sequelize, Category, Supplier, Product };
