import { db } from "../db/db.js";
import { DataTypes, Model } from "sequelize";

export class Filter extends Model {}
Filter.init(
    {
        filter_id: {
            type: DataTypes.STRING(64),
            primaryKey: true,
        },
        kategorija_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "KATEGORIJA",
                key: "kategorija_id",
            },
            allowNull: false,
        },
        filter_naziv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "Filter",
        tableName: "FILTER",
        timestamps: false,
    }
)