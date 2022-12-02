import {
    DataTypes,
    Model,
} from 'sequelize';
import { sequelize } from './connect';

interface RecruitsAttributes {
    title: string,
    content: string,
    name: string,
    event: string
    location: string
    eventDate: string
}

class Recruits extends Model<RecruitsAttributes> {
    public title!: string;
    public content!: string;
    public name!: string;
    public event!: string;
    public location!: string;
    public eventDate!: string;

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
            type: DataTypes.STRING(6000),
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        event: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        eventDate: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    },
    {
            modelName: 'jordi',
            tableName: 'recruits',
            sequelize,
            freezeTableName: true,
            createdAt: true,
            updatedAt: false,
    }
);

export default Recruits;
