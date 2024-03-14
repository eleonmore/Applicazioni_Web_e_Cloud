const API_KEY = 'api_key=2fd6cf3e63f886a46111255006b43810';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;


var div = document.getElementById("cardDiv_V");
var form = document.getElementById("form_V");
var search = document.getElementById("search_V");


const prec = document.getElementById('precedente_V')
const succ = document.getElementById('successivo_V')
const corr = document.getElementById('corrente_V')

var pagina_corrente = 1;
var pagina_successiva = 2;
var pagina_precedente = 3;
var ultimoURL = '';
var pagine_totali = 100;

schermata_film(API_URL);

function get_url(url, callback) {
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
        console.log(film_popolari)                          // obj
        if (status == 200) {
            array_info = film_popolari.results;             // obj(Array)
            console.log(array_info);
            div.innerHTML = ""
            pagina_corrente = film_popolari.page;           // obj(numeroPag)
            pagina_successiva = pagina_corrente + 1;
            pagina_precedente = pagina_corrente - 1;
            pagine_totali = film_popolari.total_pages;

            corr.innerText = pagina_corrente;               // numero pagina

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

                const { title, poster_path, vote_average, id } = movie;     //obj

                div.innerHTML += `
                <div class="riquadro_film">
                <a href="../descrizioneFilm-DopoLogin.html" onclick="setMovie(${id})" >
                <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" class="card-img-top" alt="image">
                </a>
                <h5 class="card-title"><b>${title}</b></h5>
                <span class="badge rounded-pill bg-light text-danger position-absolute top-0 end-0">${vote_average}</span>
                </div>`


            })

        } else {
            div.innerHTML += `<h1>Errore Connessione</h1>`
        }
    })

}

function setMovie(id) {
    localStorage.setItem("movieID", JSON.stringify(id));
}

/////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////


//CREA PAGINA PRECEDENTE O SUCCESSIVA
function pageCall(page) {
    let urlSeparato = ultimoURL.split('?');                          /* divide stringa in base a un separatore */
    let ParametriQuery = urlSeparato[1].split('&');
    let key = ParametriQuery[ParametriQuery.length - 1].split('=');
    if (key[0] != 'page') {                                          /* entra solo per il cambiamento della prima pag */
        let url = ultimoURL + '&page=' + page
        schermata_film(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');                                       /* opposto split: Fornisce una stringa composta da tutti gli elementi di un array, separati da un elemento scelto */
        ParametriQuery[ParametriQuery.length - 1] = a;
        let b = ParametriQuery.join('&');
        let url = urlSeparato[0] + '?' + b
        schermata_film(url);
    }
}



// RICERCA

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;                          // prende valore ricerca inserito
    console.log(searchTerm)
    if (searchTerm) {
        schermata_film(searchURL + '&query=' + searchTerm)
    } else {
        schermata_film(API_URL);
    }

})


