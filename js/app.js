const criptoMonedas = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = { //se llenara con forme el usuario balla llenado algo
    moneda:'',
    criptomoneda: ''
}

//creamos un promise simplemete resuleve y pueda descargar todas las monedas 
const obtenerCriptomoneda = criptoMonedas => new Promise( resolve  => {
    resolve(criptoMonedas); //es caso de que el primise sea correcto resolvemos la monedas
});

document.addEventListener('DOMContentLoaded',() => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitForm);

    criptoMonedas.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);

});

function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => obtenerCriptomoneda(resultado.Data)) //optenemos monedas mediante un promise (esto para evitar que si no se resuleve evite seguir)
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(moneda => {
        const {FullName, Name } = moneda.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoMonedas.appendChild(option);

    });
}

function leerValor(e) { //escribe en el objeto
    objBusqueda[e.target.name] = e.target.value; //funciona llaque en html tienen el mismo nombre que el objeto, moneda-criptomoneda se mapean
}

function submitForm(e) {
    e.preventDefault();

    //validar
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Los campos son obligatorios');
        return;
    }

    //consultar la API con resultados
    consultarAPI();

}

function mostrarAlerta( mensage ) {
    const existeError = document.querySelector('.error');
    if(!existeError){
        const alertaDiv = document.createElement('p');
        alertaDiv.classList.add('error');
        alertaDiv.textContent = mensage;
        formulario.appendChild(alertaDiv);
    
        setTimeout(() => {
            alertaDiv.remove();
        }, 3000);
    }
   
}

function consultarAPI() {
    const { moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then(resultado => {
            //accedemos dinamicamente
           mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda])
        })
}

function mostrarCotizacion(cotizacion) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio mas alto del dia es: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio mas bajo del dia es: <span>${LOWDAY}</span>`;

    const ultimaHora = document.createElement('p');
    ultimaHora.innerHTML = `Variacion ultimas 24h: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualizacion: <span>${LASTUPDATE}</span>`;


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimaHora);
    resultado.appendChild(ultimaActualizacion);

}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}