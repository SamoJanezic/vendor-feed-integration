import { db } from "../db/db.js";
import { DataTypes, Model } from "sequelize";

export class IzdelekFilter extends Model {}

IzdelekFilter.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		izdelek_ean: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "IZDELEK",
				key: "ean",
			},
		},
		filter_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "FILTER",
				key: "filter_id",
			},
		},
		filter_vrednost: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: "IzdelekFilter",
		tableName: "IZDELEK_FILTER",
        timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ["izdelek_ean", "filter_id"],
			},
		],
	}
);
