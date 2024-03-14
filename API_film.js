var div = document.getElementById("cardDiv");

const prec = document.getElementById('precedente')
const succ = document.getElementById('successivo')
const corr = document.getElementById('corrente')

const IMG_URL = 'https://image.tmdb.org/t/p/w500';

var pagina_corrente = 1;
var pagina_successiva = 2;
var pagina_precedente = 3;
var ultimoURL = '';
var pagine_totali = 100;


function get_url(url, callback) {           // recupero dati
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        callback(status, xhr.response);
    }
    xhr.send();
};


function schermata_film(url) {

    ultimoURL = url;
    get_url(url, function (status, film_popolari) {
        console.log(film_popolari)
        if (status == 200) {
            array_info = film_popolari.results;
            console.log(array_info);
            div.innerHTML = ""
            pagina_corrente = film_popolari.page;
            pagina_successiva = pagina_corrente + 1;
            pagina_precedente = pagina_corrente - 1;
            pagine_totali = film_popolari.total_pages;

            corr.innerText = pagina_corrente;

            if (pagina_corrente <= 1) {
                prec.classList.add('disabled');
                succ.classList.remove('disabled')
            } else if (pagina_corrente >= pagine_totali) {
                prec.classList.remove('disabled');
                succ.classList.add('disabled')
            } else {
                prec.classList.remove('disabled');
                succ.classList.remove('disabled')
            }

            div.scrollIntoView({ behavior: 'smooth' })

            array_info.forEach(movie => {

                const { title, poster_path, vote_average, id } = movie;

                div.innerHTML += `
                <div class="riquadro_film">
                <a href="descrizioneFilm.html" onclick="setMovie(${id})" >
                <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" class="card-img-top" alt="image">
                </a>
                <h5 class="card-title"><b>${title}</b></h5>
                <span class="badge rounded-pill bg-light text-danger position-absolute top-0 end-0">${vote_average}</span>
                </div>`
                // badge rounded-pill: cerchio bianco voto 


            })

        } else {
            div.innerHTML += `<h1>Errore Connessione</h1>`
        }
    })

}

function setMovie(id) {
    localStorage.setItem("movieID", JSON.stringify(id));
}


prec.addEventListener('click', () => {
    if (pagina_precedente > 0) {
        pageCall(pagina_precedente);
    }
})

succ.addEventListener('click', () => {
    if (pagina_successiva <= pagine_totali) {
        pageCall(pagina_successiva);
    }
})

//CREA PAGINA PRECEDENTE O SUCCESSIVA
function pageCall(page) {
    let urlSeparato = ultimoURL.split('?');            /* divide stringa in base a un separatore */
    let ParametriQuery = urlSeparato[1].split('&');
    let key = ParametriQuery[ParametriQuery.length - 1].split('=');
    console.log(key)
    if (key[0] != 'page') {                           /* entra solo per il cambiamento della prima pag */
        let url = ultimoURL + '&page=' + page
        console.log(url)
        schermata_film(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');                        /* opposto split: Fornisce una stringa composta da tutti gli elementi di un array, separati da un elemento scelto */
        ParametriQuery[ParametriQuery.length - 1] = a;
        let b = ParametriQuery.join('&');
        let url = urlSeparato[0] + '?' + b
        console.log(url)
        schermata_film(url);
    }
}

