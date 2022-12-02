import {
    DataTypes,
    Model,
} from "sequelize";
import { sequelize } from "./connect";

interface ProductsAttributes {
    publicProductId: bigint,
    productId: bigint,
    productName: string,
    createdAt: Date,
}

class Products extends Model<ProductsAttributes> {
    public publicProductId!: bigint;
    public productId!: bigint;
    public productName!: string;
    public createdAt!: Date;

    public static associations: {

    }
}

Products.init(
    {
        publicProductId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            unique: true
        },
        productName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        modelName: 'outbox',
        tableName: 'products',
        sequelize,
        freezeTableName: true,
        updatedAt: true
    }
);

export default Products;
