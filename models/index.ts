import Users from './users';
import Options from "./options";
import Products from "./products";
import Statistics from "./statistics";
import {sequelize} from "./connect";

Products.hasMany(Options, {
    sourceKey: 'productId',
    foreignKey: 'productId',
    as: 'options'
})
Options.hasMany(Statistics, {
    sourceKey: 'optionId',
    foreignKey: 'optionId',
    as: 'statistics'
})

export {Users, Products, sequelize};