Mapiranje kategorij je precej preprosto:

prvo se importa "./categoryNames.js", ki se lahko uporabi da imajo vse kategorije res isto ime, ni pa nujno.

prvo se kreira konstanta kot:
const acordCategoryMap = {
tu znotraj se lahko mapira kategorije, ki so v xml, z našimi internimi.
naše ime kategorije : [v primerjavi z njihovimi]
primer:
[cn.PC]: ["Namizni - desktop", "Računalniki", "Namizni računalniki"],

    [cn.PC] je enako kot, da bi napisali:
    "Namizni računalniki": ["Namizni - desktop", "Računalniki", "Namizni računalniki"],
    saj je tako definiran v categoryNames.js

}

na koncu se še export default naredi:
export default acordCategoryMap;

In se vnese v index.js znotraj te mape oz. ./categoryMaps/
