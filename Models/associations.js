import { modelsMap } from "./index.js";

modelsMap.IzdelekDobavitelj.belongsTo(modelsMap.Izdelek, {
  foreignKey: "izdelek_ean",
  targetKey: "ean",
  as: 'izdelek'
});

modelsMap.IzdelekDobavitelj.belongsTo(modelsMap.Dobavitelj, {
  foreignKey: "DOBAVITELJ_dobavitelj",
  targetKey: "dobavitelj"
});

modelsMap.IzdelekDobavitelj.belongsTo(modelsMap.Kategorija, {
  foreignKey: "KATEGORIJA_kategorija",
  targetKey: "kategorija",

});

modelsMap.Kategorija.hasMany(modelsMap.IzdelekDobavitelj, {
	foreignKey: "KATEGORIJA_kategorija",
	sourceKey: "kategorija",
});


modelsMap.Izdelek.hasMany(modelsMap.IzdelekDobavitelj, {
	foreignKey: "izdelek_ean",
	sourceKey: "ean",
});

modelsMap.Izdelek.hasMany(modelsMap.Slika, {
  foreignKey: "izdelek_ean",
  sourceKey: "ean",
  as: "slika"
});

modelsMap.IzdelekDobavitelj.hasMany(modelsMap.Atribut, {
  foreignKey: "izdelek_ean",
  sourceKey: "izdelek_ean",
  as: "atribut"
});

modelsMap.Komponenta.belongsTo(modelsMap.Kategorija, {
  foreignKey: "KATEGORIJA_kategorija",
  targetKey: "kategorija"
});

modelsMap.Kategorija.hasMany(modelsMap.Komponenta, {
  foreignKey: "KATEGORIJA_kategorija",
  sourceKey: "kategorija",
  as: "Komponenta"
});

modelsMap.Atribut.belongsTo(modelsMap.Komponenta, {
  foreignKey: "KOMPONENTA_komponenta",
  targetKey: "komponenta"
});

modelsMap.Komponenta.hasMany(modelsMap.Atribut, {
  foreignKey: "KOMPONENTA_komponenta",
  sourceKey: "komponenta",
});

modelsMap.Filter.belongsTo(modelsMap.Kategorija, {
    foreignKey: "kategorija_id",
    sourceKey: "kategorija_id",
});

modelsMap.Kategorija.hasMany(modelsMap.Filter, {
    foreignKey: "kategorija_id",
    sourceKey: "kategorija_id",
});

modelsMap.IzdelekFilter.belongsTo(modelsMap.Filter, {
    foreignKey: "filter_id",
    sourceKey: "filter_id",
});

modelsMap.Filter.hasMany(modelsMap.IzdelekFilter, {
    foreignKey: "filter_id",
    sourceKey: "filter_id",
});

modelsMap.IzdelekFilter.belongsTo(modelsMap.IzdelekDobavitelj, {
    foreignKey: "izdelek_ean",
    sourceKey: "izdelek_ean",
});

modelsMap.IzdelekDobavitelj.hasMany(modelsMap.IzdelekFilter, {
    foreignKey: "izdelek_ean",
    sourceKey: "izdelek_ean",
})