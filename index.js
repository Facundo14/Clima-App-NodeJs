require('dotenv').config();

const { pausa, inquirerMenu, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    let opt;
    const busquedas = new Busquedas();

    do {
        // Imprimir el menu
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                //Busar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);
                //Clima
                const clima = await busquedas.clima(lugarSel.lat, lugarSel.lng);
                //Mostrar resultados
                console.log('\nInformación del lugar\n'.green)
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Long:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green);
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, id) => {
                    const idx = `${id + 1}.`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
            break;
        }

        
        if(opt !==0) await pausa();

    } while (opt !== 0);
}

main();