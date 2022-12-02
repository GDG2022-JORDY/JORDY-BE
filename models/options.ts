import {
    DataTypes,
    Model,
    Sequelize,
} from "sequelize";
import { sequelize } from "./connect";

interface OptionsAttributes {
    optionId: bigint,
    productId: bigint,
    optionName: string
}

class Options extends Model<OptionsAttributes> {
    public optionId!: bigint;
    public productId!: bigint;
    public optionName!: string;
}

Options.init(
    {
        optionId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        productId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        optionName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        }
    },
    {
        modelName: 'jordi',
        tableName: 'options',
        sequelize,
        freezeTableName: true,
    }
);

export default Options;