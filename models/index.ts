import Users from './users';
import Recruits from "./recruits";
import {sequelize} from "./connect";

Users.hasMany(Recruits, {
    sourceKey: 'name',
    foreignKey: 'name',
    as: 'recruits'
})

export {Users, Recruits, sequelize};