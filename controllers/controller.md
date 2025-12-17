Ko se dela novi kontroler ga je treba dodati v "controllers\index.js"
Prav tako je treba dodati še categoryMap v mapo controllers\categoryMaps in jo tudi vnesti pod controllers\categoryMaps\index.js. In dodamo še attributeController pod "controller\attributControllers" in ga vnesemo controllers\categoryMaps\index.js.
Glaven kontroler je dobaviteljController.js drugi so potem vsi child-i ki njega extendajo. Tako vsi podedujejo funckije in lastnosti glavnega.
Primer: Naredil bi rad nov kontroler ApiController.js, ki ga narediš znotraj /controllers in v index.js ga importaš in definiraš, v /categoryMaps se naredi apiCategory.js in se tudi mora importirati in definirati v categoryMaps/index.js. nato se še ustvari ApiAttributes.js znotraj attributeControllers in se importa in definira tam.

izgled apiController.js:
import DobaviteljController from "./DobaviteljController.js";
export default class ApiController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
    name = "ime katero boš uporablja npr. api";
    nodes = "Pot do izdelkov glede na xml npr podjetje.izdelki.izdelek";
    file = "ime xml-ja npr. api.xml";
    encoding = "če je xml posebej enkodani se tu vnese npr. windows-1250, utf8";
    keys = ["ključi ki ustrezajo po vrsti kot so definirani v dobaviteljController in jih lahko vidiš v samem xml-ju"]
    ignoreCategorySet = new Set([Kategorije v xml-ju ki jih bo program ignoriral])

    nato pa še pridejo kakršnekoli funckije, ki bodo unikatne za kontroler in če bodo seveda sploh potrebne.
}

Vsi vnosi v index so potrebni da bo tudi kasneje avtomatsko vse delovalo brez kakršnega drugega posega v logiko programa.