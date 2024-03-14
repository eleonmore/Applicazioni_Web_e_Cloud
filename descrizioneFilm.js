const URL_PrimaParte = 'https://api.themoviedb.org/3/movie/';

var id_film = localStorage.getItem("movieID");
var id_film_obj = JSON.parse(id_film);

const BASE_URL_Info = URL_PrimaParte + id_film_obj + '?api_key=2fd6cf3e63f886a46111255006b43810';
const BASE_URL_Persone = URL_PrimaParte + id_film_obj + '/credits?api_key=2fd6cf3e63f886a46111255006b43810';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

var info = document.getElementById('infoFilm')

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
      const { title, genres, production_companies, production_countries, poster_path, release_date, vote_average, overview } = movie;


      info.innerHTML += `
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
    } else {

      div.innerHTML += `<h1>Errore Connessione</h1>`
    }
  })
}


function Itera(obj) {       /* per far visualizzare tutte le info */
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



function Personaggi() {
  var indice_attore = document.getElementById("numero_personaggio").value
  var risultato_attore = document.getElementById("risultatoAttore")

  get_url(BASE_URL_Persone, function (status, personaggi) {
    console.log(personaggi);
    if (status == 200) {

      let cast = personaggi.cast
      console.log(cast[indice_attore])


      if (indice_attore <= cast.length - 1) {
        const { name, character, profile_path } = cast[indice_attore];

        risultato_attore.innerHTML =     /*let result = condition ? value1 : value2;  --->  La condition viene valutata; se risulta vera, viene ritornato value1, altrimenti viene ritornato value2  */
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
  var indice_crew = document.getElementById("numero_crew").value
  var risultato_crew = document.getElementById("risultatoCrew")

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



