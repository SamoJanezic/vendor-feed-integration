import { AcordController } from "./AcordController.js";
import { AvteraController } from "./AvteraController.js";
import { ColbyController } from "./ColbyController.js";
import { ElkotexController } from "./ElkotexController.js";
import { EventusController } from "./EventusController.js";
import { AsbisController } from "./AsbisController.js";
import { AlsoController } from "./AlsoController.js";
import { LiebherrController } from "./LiebherrController.js";
import { GorenjeController } from "./GorenjeController.js";
import { BshController } from "./BshController.js";

export const controllerMap = {
    liebherr: LiebherrController, //dodatne lastnosti niso porihtane
    gorenje: GorenjeController, // problem with attributes here | ni eprelov
    bsh: BshController,
    also: AlsoController,  //dela
    acord: AcordController,  //dela
    avtera: AvteraController, //dela
    elkotex: ElkotexController, //problemi z dodatnimi lasnostmi neskončen loop
    eventus: EventusController, //dela
    asbis: AsbisController, // dolgo se nalaga
    colby: ColbyController, //dela
};