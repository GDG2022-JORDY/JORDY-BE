import {
    DataTypes,
    Model,
} from 'sequelize';
import { sequelize } from './connect';

interface StatisticsAttributes {
    optionId: bigint,
    sellDate: Date,
    totalSell: number,
    stockAmount: number,
}

class Statistics extends Model<StatisticsAttributes> {
    public optionId!: bigint;
    public sellDate!: Date;
    public totalSell!: number;
    public stockAmount!: number;

    public static associations: {

    }
}

Statistics.init(
    {
        optionId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        sellDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        totalSell: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        stockAmount: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        }
    },
    {
        modelName: 'outbox',
        tableName: 'statistics',
        sequelize,
        freezeTableName: true,
        updatedAt: true
    }
);

export default Statistics;