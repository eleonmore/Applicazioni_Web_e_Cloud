const API_KEY = 'api_key=2fd6cf3e63f886a46111255006b43810';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;


var div = document.getElementById("cardDiv_A");
var form = document.getElementById("form_A");
var search = document.getElementById("search_A");


const prec = document.getElementById('precedente_A')
const succ = document.getElementById('successivo_A')
const corr = document.getElementById('corrente_A')

var pagina_corrente = 1;
var pagina_successiva = 2;
var pagina_precedente = 3;
var ultimoURL = '';
var pagine_totali = 100;

schermata_film(API_URL);

const generi = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]



var tagsEl = document.getElementById('tags_A');
var genereSelezionato = []
setGenere();

function setGenere() {
    tagsEl.innerHTML = '';
    generi.forEach(genre => {
        const t = document.createElement('div');                // crea div
        t.classList.add('tag');                                 // aggiunge al div la classe tag
        t.id = genre.id;                                        // aggiunge l'id del singolo genere
        t.innerText = genre.name;

        var utente_loggato = localStorage.getItem("logged_user_email");
        var email_user_loggato = JSON.parse(utente_loggato);
        var acquirenti_string = localStorage.getItem("json_customer");
        var lista_acquirenti = JSON.parse(acquirenti_string);
        var preferito = false
        // console.log(users)

        for (var i = 0; i < lista_acquirenti.length; i++) {
            if (lista_acquirenti[i].email == email_user_loggato) {
                if (genre.name === lista_acquirenti[i].generePreferito) {           // controllo se l'acquirente ha specificato un genere preferito
                    preferito = true
                    console.log(genre.name)
                    genereSelezionato.push(genre.id);
                    schermata_film(API_URL + '&with_genres=' + encodeURI(genereSelezionato.join(',')))
                }
            }
        }

        t.addEventListener('click', () => {
            if (genereSelezionato.length == 0) {
                genereSelezionato.push(genre.id);
            } else {
                if (genereSelezionato.includes(genre.id)) {             // se il genre è già presente nella lista (già selezionato), allora lo rimuove 
                    genereSelezionato.forEach((id, indice) => {
                        if (id == genre.id) {
                            genereSelezionato.splice(indice, 1);        // per aggiungere o togliere elemento da array: un intero che indica in quale posizione aggiungere/togliere, il numero di elementi da togliere.

                        }
                    })
                } else {
                    genereSelezionato.push(genre.id);
                }
            }

            console.log(genereSelezionato)
            schermata_film(API_URL + '&with_genres=' + encodeURI(genereSelezionato.join(',')))
            SelezioneGenere()
        })
        tagsEl.append(t);                           // visualizza generi 
        if (preferito === true) {
            SelezioneGenere()
        }
    })
}


function SelezioneGenere() {                                // cambia colore al genere selezionato
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    if (genereSelezionato.length != 0) {
        genereSelezionato.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            console.log(hightlightedTag)
            hightlightedTag.classList.add('highlight');
        })
    }
}


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
        console.log(film_popolari)                             // obj
        if (status == 200) {
            array_info = film_popolari.results;                // obj(Array)
            console.log(array_info);
            div.innerHTML = ""
            pagina_corrente = film_popolari.page;              // obj(numeroPag)
            pagina_successiva = pagina_corrente + 1;
            pagina_precedente = pagina_corrente - 1;
            pagine_totali = film_popolari.total_pages;

            corr.innerText = pagina_corrente;                   // paginazione

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

                const { title, poster_path, vote_average, id } = movie;       //obj

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

////////////////////////////////////////////////////////////////////////////////////////
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
    let urlSeparato = ultimoURL.split('?');                         /* divide stringa in base a un separatore */
    let ParametriQuery = urlSeparato[1].split('&');
    let key = ParametriQuery[ParametriQuery.length - 1].split('=');
    if (key[0] != 'page') {                                         /* entra solo per il cambiamento della prima pag */
        let url = ultimoURL + '&page=' + page
        schermata_film(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');                                      /* opposto split: Fornisce una stringa composta da tutti gli elementi di un array, separati da un elemento scelto */
        ParametriQuery[ParametriQuery.length - 1] = a;
        let b = ParametriQuery.join('&');
        let url = urlSeparato[0] + '?' + b
        schermata_film(url);
    }
}



// RICERCA

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;                            // prende valore inserito
    genereSelezionato = [];
    setGenere();
    if (searchTerm) {
        schermata_film(searchURL + '&query=' + searchTerm)
    } else {
        schermata_film(API_URL);
    }

})

