import { Filter } from "../Models/Filter.js";
import crypto from 'crypto';

export const filtri = {
    "Prenosniki": {
        "id": 25,
        "filters": [
            "Proizvajalec",
            "Namen uporabe",
            "Procesor",
            "Velikost zaslona",
            "Ločljivost",
            "Kapaciteta diska",
            "Kapaciteta pomnilnika",
            "Operacijski sistem",
            "Grafična kartica"
        ]
    },
    "Dodatki za prenosnike": {
        "id": 303,
        "filters": ["Proizvajalec", "Vrsta dodatka"]
    },
    "All in One": {
        "id": 33,
        "filters": [
            "Proizvajalec",
            "Vrsta zaslona",
            "Procesor",
            "Velikost zaslona",
            "Ločljivost",
            "Kapaciteta diska",
            "Kapaciteta pomnilnika",
            "Operacijski sistem",
            "Grafična kartica"
        ]
    },
    "Namizni računalniki": {
        "id": 26,
        "filters": [
            "Proizvajalec",
            "Procesor",
            "Kapaciteta diska",
            "Kapaciteta pomnilnika",
            "Operacijski sistem",
            "Grafična kartica"
        ]
    },
    "Mini": {
        "id": 35,
        "filters": [
            "Proizvajalec",
            "Procesor",
            "Kapaciteta diska",
            "Kapaciteta pomnilnika",
            "Operacijski sistem",
            "Grafična kartica"
        ]
    },
    "Tablični računalniki": {
        "id": 36,
        "filters": [
            "Proizvajalec",
            "Procesor",
            "Velikost zaslona",
            "Ločljivost",
            "ROM",
            "Kapaciteta pomnilnika",
            "Operacijski sistem"
        ]
    },
    "Strežniki": {
        "id": 37,
        "filters": [
            "Proizvajalec",
            "Postavitev",
            "Procesor",
            "Kapaciteta diska",
            "Kapaciteta pomilnika"
        ]
    },
    "NAS sistemi": {
        "id": 38,
        "filters": [
            "Proizvajalec",
            "Postavitev",
            "Kapaciteta",
            "št. LAN priklopov",
            "Kapaciteta pomnilnika",
            "Število diskov"
        ]
    },
    "Monitorji": {
        "id": 39,
        "filters": [
            "Proizvajalec",
            "Osveževanje",
            "Matrika",
            "Velikost zaslona",
            "Ločljivost",
            "Vhodi",
            "Zvočniki",
            "Ukrivljen zaslon"
        ]
    },
    "Programska oprema": {
        "id": 162,
        "filters": ["Proizvajalec"]
    },
    "Osnovne plošče": {
        "id": 75,
        "filters": [
            "Proizvajalec",
            "Vrsta procesorja",
            "Podnožje",
            "Format",
            "Vezni nabor",
            "Pomnilniške reže"
        ]
    },
    "Procesorji": {
        "id": 76,
        "filters": ["Proizvajalec", "Procesor", "Podnožje"]
    },
    "Pomnilniki": {
        "id": 77,
        "filters": [
            "Proizvajalec",
            "Vrsta pomnilnika",
            "Kapaciteta pomnilnika"
        ]
    },
    "Trdi diski": {
        "id": 78,
        "filters": [
            "Proizvajalec",
            "Vrsta diska",
            "Kapaciteta diska",
            "Velikost diska",
            "Tip diska",
            "Vmesnik"
        ]
    },
    "Ohišja": {
        "id": 79,
        "filters": ["Proizvajalec", "Velikost", "Napajalnik"]
    },
    "Napajalniki": {
        "id": 80,
        "filters": ["Proizvajalec", "Moč", "Modularni"]
    },
    "Grafične kartice": {
        "id": 81,
        "filters": ["Proizvajalec", "GPU", "Grafični procesor", "Pomnilnik"]
    },
    "Optične enote": {
        "id": 82,
        "filters": [
            "Proizvajalec",
            "Vrsta optične enote",
            "Tip optične enote"
        ]
    },
    "Zvočne kartice": {
        "id": 170,
        "filters": ["Proizvajalec"]
    },
    "Hlajenje": {
        "id": 202,
        "filters": ["Proizvajalec", "Vrsta hlajenja"]
    },
    "Usmerjevalniki, stikala in AP": {
        "id": 278,
        "filters": ["Proizvajalec", "Vrsta", "Hitrost", "št. LAN priklopov"]
    },
    "Mrežne kartice, Antene, WIFI Ojačevalci": {
        "id": 279,
        "filters": ["Proizvajalec", "Vrsta", "Hitrost", "vrsta povezave"]
    },
    "Powerline": {
        "id": 209,
        "filters": ["Proizvajalec", "št. LAN priklopov", "Hitrost"]
    },
    "Tiskalniki": {
        "id": 280,
        "filters": [
            "Proizvajalec",
            "Vrsta tiskalnika",
            "Tehnologija tiska",
            "Ločljivost tiska",
            "Barva tiska",
            "Povezava tiskalnika",
            "Format"
        ]
    },
    "Optični bralniki": {
        "id": 128,
        "filters": [
            "Proizvajalec",
            "Tip bralnika",
            "Hitrost branja",
            "Povezava",
            "Duplex",
            "Format"
        ]
    },
    "POS in dodatki": {
        "id": 213,
        "filters": ["Proizvajalec", "Vrsta"]
    },
    "Podloge": {
        "id": 90,
        "filters": ["Proizvajalec"]
    },
    "Potrošni material": {
        "id": 91,
        "filters": ["Proizvajalec", "Vrsta"]
    },
    "Tipkovnice": {
        "id": 92,
        "filters": ["Proizvajalec", "Povezava", "Mehanska"]
    },
    "Miške": {
        "id": 93,
        "filters": ["Proizvajalec", "Povezava", "Senzor", "DPI"]
    },
    "Kompleti": {
        "id": 100,
        "filters": ["Proizvajalec", "Povezava", "Mehanska"]
    },
    "Slušalke": {
        "id": 96,
        "filters": ["Proizvajalec", "Povezava", "Mikrofon"]
    },
    "Zvočniki": {
        "id": 97,
        "filters": ["Proizvajalec", "Povezava", "Vrsta", "Sistem"]
    },
    "Spletne kamere": {
        "id": 95,
        "filters": ["Proizvajalec", "Ločljivost"]
    },
    "USB ključki": {
        "id": 99,
        "filters": ["Proizvajalec", "Kapaciteta", "Priključek"]
    },
    "Spominske kartice in čitalci": {
        "id": 101,
        "filters": [
            "Proizvajalec",
            "Kapaciteta",
            "Tip kartice",
            "Čitalec",
            "Hitrost zapisovanja",
            "Hitrost branja"
        ]
    },
    "Mediji": {
        "id": 102,
        "filters": ["Proizvajalec", "Vrsta medija"]
    },
    "Brezprekinitveno napajanje": {
        "id": 94,
        "filters": ["Proizvajalec", "Postavitev", "Moč"]
    },
    "Konferenčna oprema": {
        "id": 210,
        "filters": ["Proizvajalec"]
    },
    "Konzole": {
        "id": 164,
        "filters": ["Proizvajalec"]
    },
    "Igre": {
        "id": 235,
        "filters": ["Vrsta konzole"]
    },
    "Igralni pripomočki": {
        "id": 98,
        "filters": ["Vrsta pripomočka"]
    },
    "Gaming stoli": {
        "id": 205,
        "filters": ["Proizvajalec"]
    },
    "Kripto denarnice": {
        "id": 195,
        "filters": ["Proizvajalec"]
    },
    "Televizije": {
        "id": 45,
        "filters": [
            "Proizvajalec",
            "Diagonala",
            "Ločljivost",
            "Smart TV",
            "Operacijski sistem",
            "Vrsta zaslona"
        ]
    },
    "Nosilci za TV": {
        "id": 178,
        "filters": ["Proizvajalec"]
    },
    "Fotoaparati": {
        "id": 46,
        "filters": ["Proizvajalec", "Vrsta"]
    },
    "Objektivi": {
        "id": 281,
        "filters": ["Proizvajalec"]
    },
    "Radio in budilke": {
        "id": 126,
        "filters": ["Proizvajalec", "Vrsta"]
    },
    "HI-FI in Prenosni zvočniki": {
        "id": 282,
        "filters": ["Proizvajalec", "Vrsta", "Moč", "Priključki"]
    },
    "Domači kino": {
        "id": 283,
        "filters": ["Proizvajalec", "Moč", "Povezljivost"]
    },
    "Snemalniki": {
        "id": 103,
        "filters": ["Proizvajalec"]
    },
    "Kamere": {
        "id": 104,
        "filters": ["Proizvajalec"]
    },
    "Domofoni": {
        "id": 284,
        "filters": ["Proizvajalec"]
    },
    "Nosilci in napajalniki": {
        "id": 286,
        "filters": ["Proizvajalec"]
    },
    "Projektorji": {
        "id": 241,
        "filters": [
            "Proizvajalec",
            "Namen",
            "Tehnologija",
            "Ločljivost",
            "Svetilnost",
            "Kontrast"
        ]
    },
    "Projekcijska platna": {
        "id": 242,
        "filters": ["Proizvajalec", "Vrsta", "Format"]
    },
    "Nosilci za projektorje": {
        "id": 243,
        "filters": ["Proizvajalec", "Vrsta"]
    },
    "Žarnice za projektorje": {
        "id": 244,
        "filters": ["Proizvajalec"]
    },
    "Pralni stroji": {
        "id": 106,
        "filters": [
            "Proizvajalec",
            "Kapaciteta",
            "Energijski razred",
            "Polnjenje",
            "št. Obratov centrifuge",
            "Inverter motor"
        ]
    },
    "Sušilni stroji": {
        "id": 107,
        "filters": [
            "Proizvajalec",
            "Kapaciteta",
            "Energijski razred",
            "Toplotna črpalka",
            "Inverter motor",
            "Samočistilni kondenzator"
        ]
    },
    "Pralno sušilni stroji": {
        "id": 206,
        "filters": [
            "Proizvajalec",
            "Kapaciteta",
            "Energijski razred",
            "Centrifuga",
            "Toplotna črpalka"
        ]
    },
    "Pomivalni stroji": {
        "id": 108,
        "filters": [
            "Proizvajalec",
            "Tip",
            "Število pogrinjkov",
            "Višina",
            "Aqua Stop",
            "Tretja košara",
            "Širina",
            "Inverter motor",
            "Energijski razred"
        ]
    },
    "Hladilniki": {
        "id": 109,
        "filters": [
            "Proizvajalec",
            "Tip",
            "Vrsta",
            "Energijski razred",
            "No frost",
            "Višina",
            "Širina",
            "Položaj zamrzovalnika",
            "Število vrat"
        ]
    },
    "Zamrzovalniki": {
        "id": 110,
        "filters": [
            "Proizvajalec",
            "Tip",
            "Prostornina",
            "Energijski razred",
            "No frost",
            "Višina",
            "Širina"
        ]
    },
    "Pečice": {
        "id": 111,
        "filters": [
            "Proizvajalec",
            "Tip",
            "Čiščenje",
            "Energijski razred",
            "Prostornina",
            "Višina"
        ]
    },
    "Kuhališča": {
        "id": 112,
        "filters": [
            "Proizvajalec",
            "Tip",
            "Vrsta okvirja",
            "Število kuhališč",
            "Širina"
        ]
    },
    "Kuhalni seti": {
        "id": 113,
        "filters": ["Proizvajalec"]
    },
    "Štedilniki": {
        "id": 114,
        "filters": ["Proizvajalec", "Tip", "Plošč", "Prostornina", "Širina"]
    },
    "Nape": {
        "id": 115,
        "filters": [
            "Proizvajalec",
            "Tip",
            "Širina",
            "Pretok",
            "Energijski razred"
        ]
    },
    "Dom in vrt": {
        "id": 150,
        "filters": ["Proizvajalec"]
    },
    "Mali gospodinjski aparati": {
        "id": 20,
        "filters": ["Proizvajalec"]
    },
    "Mikrovalovne pečice": {
        "id": 54,
        "filters": ["Proizvajalec", "Volumen", "Žar"]
    },
    "Mesoreznice in salamoreznice": {
        "id": 57,
        "filters": ["Proizvajalec"]
    },
    "Cvrtniki": {
        "id": 58,
        "filters": ["Proizvajalec"]
    },
    "Kuhalniki": {
        "id": 287,
        "filters": ["Proizvajalec"]
    },
    "Grelniki vode": {
        "id": 60,
        "filters": ["Proizvajalec"]
    },
    "Kuhinjski roboti": {
        "id": 61,
        "filters": ["Proizvajalec", "Moč"]
    },
    "Kuhinjski žari": {
        "id": 62,
        "filters": ["Proizvajalec"]
    },
    "Mešalniki": {
        "id": 63,
        "filters": ["Proizvajalec"]
    },
    "Opekači kruha": {
        "id": 64,
        "filters": ["Proizvajalec"]
    },
    "Sokovniki in ožemalniki": {
        "id": 68,
        "filters": ["Proizvajalec"]
    },
    "Aparati za peko kruha": {
        "id": 67,
        "filters": ["Proizvajalec"]
    },
    "Vakuumski aparati": {
        "id": 69,
        "filters": ["Proizvajalec"]
    },
    "Multipraktiki": {
        "id": 236,
        "filters": ["Proizvajalec"]
    },
    "Priprava kave in čaja": {
        "id": 161,
        "filters": ["Proizvajalec"]
    },
    "Sušilci sadja": {
        "id": 153,
        "filters": ["Proizvajalec"]
    },
    "Posoda": {
        "id": 146,
        "filters": ["Proizvajalec"]
    },
    "Prenosna kuhališča": {
        "id": 207,
        "filters": ["Proizvajalec"]
    },
    "Ledomati": {
        "id": 158,
        "filters": ["Proizvajalec"]
    },
    "Tehtnice": {
        "id": 143,
        "filters": ["Proizvajalec"]
    },
    "Likalniki": {
        "id": 116,
        "filters": ["Proizvajalec"]
    },
    "Sesalniki": {
        "id": 118,
        "filters": ["Proizvajalec", "Vrsta", "Vhodna moč", "Mokro sesanje"]
    },
    "Klime": {
        "id": 148,
        "filters": ["Proizvajalec"]
    },
    "Ventilatorji": {
        "id": 149,
        "filters": ["Proizvajalec"]
    },
    "Radiatorji": {
        "id": 154,
        "filters": ["Proizvajalec"]
    },
    "Razvlažilci zraka": {
        "id": 155,
        "filters": ["Proizvajalec"]
    },
    "Vlažilci zraka": {
        "id": 156,
        "filters": ["Proizvajalec"]
    },
    "Bojlerji": {
        "id": 169,
        "filters": ["Proizvajalec"]
    },
    "Toplotne črpalke": {
        "id": 288,
        "filters": ["Proizvajalec"]
    },
    "Hranilniki vode": {
        "id": 289,
        "filters": ["Proizvajalec"]
    },
    "Žari": {
        "id": 151,
        "filters": ["Proizvajalec"]
    },
    "Naprave za pametni dom": {
        "id": 192,
        "filters": ["Proizvajalec"]
    },
    "Pametni vrtovi": {
        "id": 291,
        "filters": ["Proizvajalec"]
    },
    "Semena": {
        "id": 292,
        "filters": ["Proizvajalec"]
    },
    "Strižniki": {
        "id": 139,
        "filters": ["Proizvajalec"]
    },
    "Brivniki": {
        "id": 247,
        "filters": ["Proizvajalec"]
    },
    "Nega las": {
        "id": 140,
        "filters": ["Proizvajalec"]
    },
    "Depilatorji in epilatorji": {
        "id": 138,
        "filters": ["Proizvajalec"]
    },
    "Ustna nega": {
        "id": 141,
        "filters": ["Proizvajalec"]
    },
    "Pripomočki za ustno nego": {
        "id": 204,
        "filters": ["Proizvajalec"]
    },
    "Daljnogledi": {
        "id": 294,
        "filters": ["Proizvajalec"]
    },
    "Kolesa in skuterji": {
        "id": 295,
        "filters": ["Proizvajalec"]
    },
    "Droni in dodatki": {
        "id": 296,
        "filters": ["Proizvajalec"]
    },
    "Čelade": {
        "id": 297,
        "filters": ["Proizvajalec"]
    },
    "Športne ure": {
        "id": 298,
        "filters": ["Proizvajalec"]
    },
    "Kampiranje": {
        "id": 299,
        "filters": ["Proizvajalec"]
    },
    "Hladilne torbe": {
        "id": 300,
        "filters": ["Proizvajalec"]
    },
    "Termovke": {
        "id": 301,
        "filters": ["Proizvajalec"]
    },
    "Čistilci na tlak in metle": {
        "id": 302,
        "filters": ["Proizvajalec"]
    },
};

function createDeterministicId(categoryId, naziv) {
    return crypto
        .createHash('md5')
        .update(categoryId + ":" + naziv)
        .digest('hex')
        .slice(0, 12);
}

function filtriToRows(filtri) {
    const rows = [];
    for (const [name, data] of Object.entries(filtri)) {
        for (const naziv of data.filters) {
            rows.push({
                filter_id: createDeterministicId(data.id, naziv),
                kategorija_id: Number(data.id),
                filter_naziv: naziv
            });
        }
    }
    return rows;
}

async function insertFilters() {
    try {
        await Filter.sequelize.authenticate();

        const rows = filtriToRows(filtri);

        await Filter.bulkCreate(rows, { ignoreDuplicates: true });

        console.log("Filters inserted.");
    } catch (err) {
        console.error(err);
    }
}

export { insertFilters };