xml-Procesor
node version: 22.20.0
npm version: 11.6.1

Program vsebuje scripte katere olajšajo delo oziroma avtomatizirajo vso nareto delo,
Skripte se zaženejo v glavni mapi projekta.

npm run up -> Podere bazo in jo zgradi znova.
npm run seed -> Napolni bazo z kategorijami in filtri ki morejo biti trdo kodirani.
npm run app -> Napolni bazo z izdelki.
npm run update -> posodobi xml-je.
npm run build -> zgradi xml iz Zgrajene baze.
npm run cron -> zaštartaj cronJob, ki se izvaja dnevno.
npm run serve -> zaštartaj server ki posluša za klice z frontenda.

priporočeno zaporedje: npm run up(samo če je treba zaradih kakšnih napak bazo resetirat) -> npm run seed(samo potrebno v primeru, če je bil zagnan "up") -> npm run update -> npm run app -> npm run build.

nove xml datoteke se zgradijo znotraj "xml\build".

Če je program bil na novo prenešen z gitHub-a, je potrebno zagnat "npm install" pred uporabo prav tako je potrrebno dodati xml-downloaderja v mapo services.

Vse skripte so razgledne v datoteki "package.json" pod "scripts". Tam se lahko dodajajo tudi nove in tudi spreminjajo obstoječe.

V mapi db je konfiguracija baze in sql.js, ki vsebuje klice na bazo(SQL stavke in sequelize funkcije).

V mapi Models je struktura baze. Vsak model je svoja tabela. Pod associations pa so vnešene povezave med tabelami.

V mapi scripts so shranjene določene skripte.

Mapa seeders vsebuje trdo kodirane vnose kategorij in filtrov.

Services pa vsebuje še določene dele programa ki so v pomoč kot je builder -> ki gradi xml,
cron -> posodobi xml-je, jih vnese v bazo in zgradi nove xml-je. in pa xml-downloader -> prenese nove xmlje.

V glavni mapi projekta se še nahaja server.js s katerim se zažene server ki posluša za klice iz frontenda.
vse funkcije, ki so vezane na server.js so znotraj mape routes.