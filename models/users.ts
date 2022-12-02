import {
    DataTypes,
    Model,
    Sequelize,
    Optional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association
} from "sequelize";
import { sequelize } from "./connect";

interface UsersAttributes {
    id?: string,
    email: string,
    password: string,
    name: string,
    refresh_token?: string,
    role?: number,
    position?: number
}

class Users extends Model<UsersAttributes> {
    public readonly id?: string;
    public email!: string;
    public password!: string;
    public name!: string;
    public refresh_token?: string;
    public role?: number;
    public position?: number;

    public static associations: {

    }
}

Users.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.STRING(299),
        },
        role: {
            type: DataTypes.TINYINT,
        },
        position: {
            type: DataTypes.TINYINT,
        }
    },
    {
        modelName: 'outbox',
        tableName: 'users',
        sequelize,
        freezeTableName: true,
        timestamps: true
    }
);

export default Users;
