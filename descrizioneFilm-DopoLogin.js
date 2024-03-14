const URL_PrimaParte = 'https://api.themoviedb.org/3/movie/';


var id_film = localStorage.getItem("movieID");
var id_film_obj = JSON.parse(id_film);

var loggedUserEmail = localStorage.getItem("logged_user_email");
var loggedUserEmailObj = JSON.parse(loggedUserEmail);


var string_utenti = localStorage.getItem("json_users");
var obj_utenti = JSON.parse(string_utenti);


var VenditoreString = localStorage.getItem("json_seller");
var VenditoreObj = JSON.parse(VenditoreString);

var AcquirenteString = localStorage.getItem("json_customer");
var AcquirenteObj = JSON.parse(AcquirenteString);



const BASE_URL_Info = URL_PrimaParte + id_film_obj + '?api_key=2fd6cf3e63f886a46111255006b43810';
const BASE_URL_Persone = URL_PrimaParte + id_film_obj + '/credits?api_key=2fd6cf3e63f886a46111255006b43810';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

var li = document.getElementById('Pag-HomePage')          // per tornare nella rispettiva pagina (venditore o acquirente)
var div = document.getElementById('infoFilmDopoLogin')

descrizioneFilm(BASE_URL_Info)


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



function descrizioneFilm(url) {

  get_url(url, function (status, film_selezionato) {
    console.log(film_selezionato);
    if (status == 200) {
      let movie = film_selezionato
      const { id, title, genres, production_companies, production_countries, poster_path, release_date, vote_average, overview } = movie;


      div.innerHTML += `
          <div class="row">
            <div class="col-md-4">
            <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" class="card-img-top" alt="image">
            </div>
            <div class="col-md-8">
            <h2>${title}</h2>
            </br>

            <ul class="list-group">
              <li class="list-group-item"><strong>Genere:</strong> ${Itera(genres)}</li>
              <li class="list-group-item"><strong>Compagnia di produzione:</strong> ${Itera(production_companies)}</li>
              <li class="list-group-item"><strong>Compagnia di produzione:</strong> ${Itera(production_countries)}</li>
              <li class="list-group-item"><strong>Data di rilascio:</strong> ${release_date}</li>
              <li class="list-group-item"><strong>Votazione:</strong> ${vote_average}</li>
              </br>
              <button type="button" id="${id}" class="btn btn-danger my-2">Aggiungi film alla lista</button></br>
              </ul>
          </div>
        </div>
        </br>
        <div class="row">
          <div class="well">
           </br>
           <h3>Trama</h3>
           ${overview}
          </div>
        </div>
      </br> 
        `;



      //GESTIONE LISTA E BOTTONE DOPO CARICAMENTO PAGINA

      var found = false;
      console.log(obj_utenti)
      for (var i = 0; i < obj_utenti.length; i++) {
        if (obj_utenti[i].email == loggedUserEmailObj) {
          if (obj_utenti[i].tipoIscritto === 'venditore') {

            li.innerHTML = `    
            <a class="nav-link text-white" href="Venditore/Sito_Venditore.html">Home page</a>
            `
            VenditoreObj.forEach(Vuser => {                     // considero ogni venditore
              if (Vuser.email == loggedUserEmailObj) {
                console.log(Vuser.listaFilmSelezionati)
                var lista_shop = Vuser.listaFilmSelezionati;
                if (lista_shop.length != 0) {                   // guardo se il film è già stato salvato nella sua lista
                  lista_shop.forEach(film => {
                    if (film.id == id) {
                      found = true;
                    }
                  });
                }
                console.log(found)
                if (found == false) {                           // se il film non è presente 

                  console.log(Vuser.listaFilmSelezionati)
                  console.log("1")
                  check_listaFilmSelezionati(movie.id, false);
                } else {                                        // se il film è già presente 
                  console.log("2")
                  check_listaFilmSelezionati(movie.id, true);

                }
              }
            });


          } else {


            li.innerHTML = `    
            <a class="nav-link text-white" href="../Progetto/Acquirente/Sito_Acquirente.html">Home page</a>
            `
            AcquirenteObj.forEach(Auser => {
              if (Auser.email == loggedUserEmailObj) {
                var lista_preferenze = Auser.listaFilmSelezionati;
                if (lista_preferenze.length != 0) {
                  lista_preferenze.forEach(film => {
                    if (film.id == id) {
                      found = true;
                    }
                  });
                }

                if (found == false) {
                  check_listaFilmSelezionati(movie.id, false);
                } else {
                  check_listaFilmSelezionati(movie.id, true);
                }
              }
            });

          }
        }
      }

      //GESTIONE LISTA E BOTTONE DOPO AVERLO SELEZIONATO
      document.getElementById(id).addEventListener("click", () => {
        set_favorites(movie);
      })
    }
  })
}




function Itera(obj) {          /* per far visualizzare tutte le info */
  let stringa = "";
  for (let i = 0; i < obj.length; i++) {
    if (i == obj.length - 1) {
      stringa += obj[i].name
    } else {
      stringa += obj[i].name + ", ";
      // console.log(stringa);
    }
  }
  return stringa
}


function check_listaFilmSelezionati(id_film, aggiungi) {
  console.log(id_film)
  var bottone_preferiti = document.getElementById(id_film)

  if (aggiungi == true) {
    bottone_preferiti.classList.remove('btn-danger')
    bottone_preferiti.classList.add("btn-secondary")
    bottone_preferiti.innerHTML = "Rimuovi film dalla lista"
  } else {
    bottone_preferiti.classList.remove('btn-secondary')
    bottone_preferiti.classList.add("btn-danger")
    bottone_preferiti.innerHTML = "Aggiungi film alla lista"
  }
}


function set_favorites(movie) {

  const { id, title, poster_path, vote_average } = movie;
  var found = false;
  var obj = {}
  obj['id'] = id;
  obj['title'] = title;
  obj['poster_path'] = poster_path;

  for (var i = 0; i < obj_utenti.length; i++) {                 // stabilisco prezzo
    if (obj_utenti[i].email == loggedUserEmailObj) {
      if (obj_utenti[i].tipoIscritto === 'venditore') {
        obj['prezzo_acquisto'] = prezzo_acquisto(vote_average)
        obj['prezzo_noleggio'] = prezzo_noleggio(vote_average)
        VenditoreObj.forEach(Vuser => {                         // cambio il bottone 
          if (Vuser.email == loggedUserEmailObj) {
            var lista_shop = Vuser.listaFilmSelezionati;
            if (lista_shop.length != 0) {
              lista_shop.forEach(film => {
                if (film.id == id) {
                  found = true;
                }
              });
            }

            if (found == false) {
              console.log(Vuser.listaFilmSelezionati)
              Vuser.listaFilmSelezionati.push(obj)

              check_listaFilmSelezionati(movie.id, true);
              localStorage.setItem("json_seller", JSON.stringify(VenditoreObj));    // salvo il film selezionato nella lista
            } else {
              check_listaFilmSelezionati(movie.id, false);
              RimuoviFilm(lista_shop, movie, "venditore");
            }
          }
        });


      } else {

        AcquirenteObj.forEach(Auser => {
          if (Auser.email == loggedUserEmailObj) {
            var lista_preferenze = Auser.listaFilmSelezionati;
            if (lista_preferenze.length != 0) {
              lista_preferenze.forEach(film => {
                if (film.id == id) {
                  found = true;
                }
              });
            }

            if (found == false) {
              Auser.listaFilmSelezionati.push(obj)
              check_listaFilmSelezionati(movie.id, true);
              localStorage.setItem("json_customer", JSON.stringify(AcquirenteObj));
            } else {
              check_listaFilmSelezionati(movie.id, false);
              RimuoviFilm(lista_preferenze, movie, "acquirente");
            }
          }
        });

      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////

function prezzo_acquisto(vote_average) {
  var costantePrezzo = 0;
  var votoFilm = 0;
  var prezzo = 0;
  VenditoreObj.forEach(user => {
    if (user.email == loggedUserEmailObj) {
      costantePrezzo = user.prezzoVenditore;    // recupero costante prezzo

      votoFilm = vote_average

    }
  })
  prezzo = votoFilm * costantePrezzo * 1.5
  prezzo = prezzo.toFixed(1);       // ferma il prezzo alla prima cifra dopo la virgola
  return prezzo;
}

function prezzo_noleggio(vote_average) {
  var costantePrezzo = 0;
  var votoFilm = 0;
  VenditoreObj.forEach(user => {
    if (user.email == loggedUserEmailObj) {
      costantePrezzo = user.prezzoVenditore;

      votoFilm = vote_average

    }
  })
  var prezzo = votoFilm * costantePrezzo
  prezzo = prezzo.toFixed(1);
  return prezzo;
}

////////////////////////////////////////////////////////////////////////////////

function RimuoviFilm(lista, movie, tipo) {
  const fav = lista.filter(film => film.id !== movie.id);     // mi restituisci la lista dei film senza il film che voglio togliere (con ==id)
  console.log(fav)
  if (tipo == "venditore") {
    VenditoreObj.forEach(Vuser => {
      if (Vuser.email == loggedUserEmailObj) {
        Vuser.listaFilmSelezionati = fav
        localStorage.setItem("json_seller", JSON.stringify(VenditoreObj));    // salvo nuova lista
      }
    })
  } else {
    AcquirenteObj.forEach(Auser => {
      if (Auser.email == loggedUserEmailObj) {
        Auser.listaFilmSelezionati = fav
        localStorage.setItem("json_customer", JSON.stringify(AcquirenteObj));
      }
    })
  }
}





function Personaggi() {
  indice_attore = document.getElementById("numero_personaggioDopoLogin").value    //recupero indice selezionato
  var risultato_attore = document.getElementById("risultatoAttoreDopoLogin")

  get_url(BASE_URL_Persone, function (status, personaggi) {
    console.log(personaggi);
    if (status == 200) {

      let cast = personaggi.cast
      console.log(cast[indice_attore])


      if (indice_attore <= cast.length - 1) {
        const { name, character, profile_path } = cast[indice_attore];

        risultato_attore.innerHTML =              /*let result = condition ? value1 : value2;  --->  La condition viene valutata; se risulta vera, viene ritornato value1, altrimenti viene ritornato value2  */
          `
        </br>
        <div class="row justify-content-center">
          <div class="col-9">
            <img style="width:200px; height:auto," src="${profile_path ? IMG_URL + profile_path : "http://via.placeholder.com/1080x1580"}" class="card-img-top" alt="image">
          </div>
          <div class="col-3">
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-12">
          </br>
          <ul>
          <li><strong>Nome:</strong> ${name}</li > 
          </br>
          <li><strong>Ruolo:</strong> ${character}</li >
          </ul >
          </div>
          <div class="col-0">
          </div>
        </div>
        `

      } else {

        risultato_attore.innerHTML =
          `<ul>
          </br>
          <li><strong>Indice non valido</strong>
          </li >
          </ul > `
      }
    }
  })
}



function Crew() {
  indice_crew = document.getElementById("numero_crewDopoLogin").value
  var risultato_crew = document.getElementById("risultatoCrewDopoLogin")

  get_url(BASE_URL_Persone, function (status, personaggi) {
    console.log(personaggi);
    if (status == 200) {


      let crew = personaggi.crew
      console.log(crew[indice_crew])

      if (indice_crew <= crew.length - 1) {
        const { name, job, profile_path } = crew[indice_crew];
        risultato_crew.innerHTML =
          `
          </br>
          <div class="row justify-content-center">
            <div class="col-9">
              <img style="width:200px; height:auto," src="${profile_path ? IMG_URL + profile_path : "http://via.placeholder.com/1080x1580"}" class="card-img-top" alt="image">
            </div>
            <div class="col-3">
             
            </div>
          </div>
  
          <div class="row justify-content-center">
            <div class="col-12">
            </br>
            <ul>
            <li><strong>Nome:</strong> ${name}</li >
            </br>
            <li><strong>Ruolo:</strong> ${job}</li >
            </ul >
            </div>
            <div class="col-0">
            </div>
          </div>
          `

      } else {

        risultato_crew.innerHTML =
          `<ul>
        </br>
        <li><strong>Indice non valido</strong>
        </li >
        </ul > 
        `
      }
    }
  })
}



