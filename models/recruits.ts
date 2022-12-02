import {
    DataTypes,
    Model,
} from 'sequelize';
import { sequelize } from './connect';

interface RecruitsAttributes {
    title: string,
    content: string,
    name: string
}

class Recruits extends Model<RecruitsAttributes> {
    public title!: string;
    public content!: string;
    public name!: string;

    public static associations: {

    }
}

Recruits.init(
    {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(16000),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        }
    },
    {
            modelName: 'jordi',
            tableName: 'recruits',
            sequelize,
            freezeTableName: true,
            createdAt: true,
    }
);

export default Recruits;
