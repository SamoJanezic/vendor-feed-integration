import { db } from "../db/db.js";
import { DataTypes, Model } from "sequelize";

export class Kategorija extends Model {}
Kategorija.init(
    {
        kategorija_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        kategorija: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        stars_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        stars_ime: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        marza: {
            type: DataTypes.FLOAT,
            allowNull: true,
            unique: false
        }
    },
    {
        sequelize: db,
        modelName: "Kategorija",
        tableName: "KATEGORIJA",
        timestamps: false,
    }
)