var loggedUserEmail = localStorage.getItem("logged_user_email");
var loggedUserEmailObj = JSON.parse(loggedUserEmail);

var jsonObjAsString = localStorage.getItem("json_users");
var jsonObj = JSON.parse(jsonObjAsString);

var jsonAcquirenteAsString = localStorage.getItem("json_customer");
var jsonAcquirenteObj = JSON.parse(jsonAcquirenteAsString);

var jsonVenditoreAsString = localStorage.getItem("json_seller");
var jsonVenditoreObj = JSON.parse(jsonVenditoreAsString);


nomeUtenteA = document.getElementById("nomeUtenteA")            // info nome utente loggato
jsonAcquirenteObj.forEach(user => {
    if (user.email == loggedUserEmailObj) {
        nomeUtenteA.innerHTML = `<a href="#"  class="nav-link text-white">Loggato come <b>${user.nome} ${user.cognome} </b></a>`
    }
})

document.getElementById("datiPersonali_A").addEventListener("click", () => {
    ImpostaColore("datiPersonali_A")            // colore bottone  
    const div_laterale = document.getElementById("dati_laterali_A");
    jsonAcquirenteObj.forEach(user => {
        if (user.email == loggedUserEmailObj) {
            div_laterale.innerHTML = `
            <div class="mb-3">
                <label for="exampleName" class="form-label"><b>Nome</b></label>
                <input type="text" class="form-control formInput account-input" id="nameCustomer" name="nameCustomer" value = "${user.nome}" disabled>
            </div>
            <div class="mb-3">
                <label for="exampleLastName" class="form-label"><b>Cognome</b></label>
                <input type="text" class="form-control formInput account-input" id="lastNameCustomer" name="lastNameCustomer" value = "${user.cognome}" disabled>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"><b>Email</b></label>
                <input type="email" class="form-control formInput account-input" id="emailCustomer" name="emailCustomer" aria-describedby="emailHelp" value ="${user.email}" disabled>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label"><b>Data di nascita</b></label>
                <input type="text" class="form-control formInput account-input" name="dateCustomer" id="dateCustomer" value ="${user.dataNascita}" disabled>
            </div>
           `
        }
    })
})

const IMG_URL = 'https://image.tmdb.org/t/p/w500';


document.getElementById("acquistiFatti").addEventListener("click", () => {
    ImpostaColore("acquistiFatti")
    const div_laterale = document.getElementById("dati_laterali_A");
    div_laterale.innerHTML = `
                <h1>Film acquistati</h1>`

    jsonAcquirenteObj.forEach(userA => {
        var numeroBottone = 0
        if (userA.email == loggedUserEmailObj) {
            userA.acquistiFatti.forEach(film => {            // ciclo su tutti i film acquistati dall'utente
                div_laterale.innerHTML += `
                <ul class="list-group mb-3">
                    <li class="list-group-item py-3">
                        <div class="row g-3">
                            <div class="col-4 col-md-3 col-lg-2">
                                <a href="#">
                                    <img src="${film.poster_path ? IMG_URL + film.poster_path : "http://via.placeholder.com/1080x1580"}"" class="img-thumbnail">
                                </a>
                            </div>
                            <div class="col-8 col-md-9 col-lg-7 col-xl-8 text-left align-self-center">
                                <h4>
                                    <b><a href="#" class="text-decoration-none text-danger">${film.titolo}</a></b>
                                </h4>
                                </br>
                                <b>Tipo di acquisto: </b> ${film.tipo}<br>
                                <b>Prezzo pagato: </b> ${film.prezzo}<br>
                                <b>Nome carta: </b> ${film.nomeC}
                                <br>
                                <button class = "btn btn-danger my-2" id =${numeroBottone}>Riproduci Film</button>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
                `;
                ControlloData(film.giorno, film.tipo, numeroBottone)       // gestisco bottone riproduzione
                console.log(numeroBottone)
                numeroBottone++
            })
        }
    })

})


function ControlloData(dayPurchase, tipoAcquisto, numeroBottone) {
    const bottone = document.getElementById(numeroBottone);
    var threeDays = 259200000;
    var data = new Date();
    var today = data.getTime();
    var films_deadline = dayPurchase + threeDays        // aggiungo 3 giorni al giorno d'acquisto film
    if (tipoAcquisto == "noleggio") {
        if (today > films_deadline) {
            bottone.disabled = true;
            bottone.innerHTML = `
            Film scaduto
            `
        }
    }
}


document.getElementById("preferiti").addEventListener("click", () => {
    ImpostaColore("preferiti")
    const div_laterale = document.getElementById("dati_laterali_A");
    div_laterale.innerHTML = `
                <h1>Film selezionati dalla lista</h1>`

    jsonAcquirenteObj.forEach(userA => {
        if (userA.email == loggedUserEmailObj) {
            userA.listaFilmSelezionati.forEach(film => {
                console.log(film)
                div_laterale.innerHTML += `
                <ul class="list-group mb-3">
                    <li class="list-group-item py-3">
                        <div class="row g-3">
                            <div class="col-4 col-md-3 col-lg-2">
                                <a href="#">
                                    <img src="${film.poster_path ? IMG_URL + film.poster_path : "http://via.placeholder.com/1080x1580"}"" class="img-thumbnail">
                                </a>
                            </div>
                            <div class="col-8 col-md-9 col-lg-7 col-xl-8 text-left align-self-center">
                                <h4>
                                    <b><a href="#" class="text-decoration-none text-danger">${film.title}</a></b>
                                </h4>
                                </br>
                                <ul class="list-group mb-3">
                                    <li class="list-group-item py-3" id=${film.id}>
                                    
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
                `;

                const info_acquisto = document.getElementById(film.id);         // riquadro specifico acquisto

                var in_catalogue = false;
                jsonVenditoreObj.forEach(userV => {
                    userV.listaFilmSelezionati.forEach(info => {                // controllo nelle liste dei venditori per vedere se il film è presente (vendibile)
                        console.log(film.id)
                        if (film.id == info.id) {
                            in_catalogue = true
                            info_acquisto.innerHTML += `
                            <ul class="list-group mb-3">
                                    <li class="list-group-item py-3" >
                                   
                             <span><h5><b>Negozio: </b>${userV.nomeNegozio} </h5> 
                             </br>
                             <b id = "PrezzoAcquisto" >Prezzo Acquisto:</b> ${info.prezzo_acquisto}   
                             </br><button class="btn btn-danger my-2" onclick="ProcediAquisto('${info.id}','${info.poster_path}', '${info.title}', 'acquisto', '${info.prezzo_acquisto}', '${userV.email}')"><i class="bi bi-bag-fill"></i></button>
                             </br>
                             </br>
                             <b id = "PrezzoNoleggio">Prezzo Noleggio:</b> ${info.prezzo_noleggio}   
                             </br><button class="btn btn-danger my-2" onclick="ProcediAquisto('${info.id}', '${info.poster_path}', '${info.title}', 'noleggio', '${info.prezzo_noleggio}', '${userV.email}')"><i class="bi bi-bag-check"></i></button>
                             </span> 
                             </li>
                             </ul>
                             </br>
                         `

                        }
                    })
                });
                if (in_catalogue == false) {
                    info_acquisto.innerHTML = `Film non acquistabile`;
                }

            })
        }
    })

})


function ProcediAquisto(id_film, poster_path, titolo, tipo, prezzo, email) {        // settare info film da acquistare
    var obj = {}
    obj['id'] = id_film;
    obj['poster_path'] = poster_path;
    obj['titolo'] = titolo;
    obj['tipo'] = tipo;
    obj['prezzo'] = prezzo;
    obj['email_V'] = email;

    localStorage.setItem("film_da_acquistare", JSON.stringify(obj))

    window.location.href = "Pagamento.html"
}



document.getElementById("cambiaPwd_A").addEventListener("click", () => {
    ImpostaColore("cambiaPwd_A")
    const div_laterale = document.getElementById("dati_laterali_A");
    jsonAcquirenteObj.forEach(user => {
        if (user.email == loggedUserEmailObj) {
            div_laterale.innerHTML = `
            <form class="mt-3" name="formPwd" action="" method="post">
                <div class="mb-3 formInput-group form-account-changes">
                            <label for="exampleInputPassword1" class="form-label"><b>Password vecchia</b></label>
                            <input type="password" class="form-control account-input" name="oldPswAcquirente" id="oldPswAcquirente">
                        </div>
                        <div class="mb-3 formInput-group form-account-changes">
                        <label for="exampleInputPassword1" class="form-label"><b>Password nuova</b></label>
                        <input type="password" class="form-control account-input" name="pswAcquirente" id="pswAcquirente">
                    </div>
                        <div class="mb-3 formInput-group form-account-changes">
                            <label for="exampleInputPassword1" class="form-label"><b>Conferma Password nuova</b></label>
                            <input type="password" class="form-control account-input" name="psw2Acquirente" id="psw2Acquirente">
                        </div>
                <br>
                <button type="submit" value="submit" id="sumbitChangesPwdA" class="btn btn-danger">Submit</button><br><br> 
                </form>
                `

            sumbitChangesPwdA.addEventListener("click", event => {

                const oldPswAcquirente = document.querySelector("#oldPswAcquirente");
                const pswAcquirente = document.querySelector("#pswAcquirente");
                const psw2Acquirente = document.querySelector("#psw2Acquirente");
                if (ControlloPwd(oldPswAcquirente, pswAcquirente, psw2Acquirente) == true) {                // controlli su pwd
                    alert("Cambio password avvenuto con successo")
                    jsonAcquirenteObj.forEach(user => {
                        if (user.email.trim() == loggedUserEmailObj) {
                            user.password = pswAcquirente.value.trim()
                            localStorage.setItem("json_customer", JSON.stringify(jsonAcquirenteObj));      // cambio pwd nell'elenco acquirenti
                        }
                    })

                    jsonObj.forEach(user => {
                        if (user.email.trim() == loggedUserEmailObj) {
                            user.password = pswAcquirente.value.trim()
                            localStorage.setItem("json_users", JSON.stringify(jsonObj));                  // cambio pwd nell'elenco utenti
                        }
                    });
                } else {
                    event.preventDefault();
                }
            })
        }
    })

})




function ControlloPwd(oldPswAcquirente, pswAcquirente, psw2Acquirente) {
    const oldPswAcquirente_value = oldPswAcquirente.value.trim();
    const pswAcquirente_value = pswAcquirente.value.trim();
    const psw2Acquirente_value = psw2Acquirente.value.trim();

    var oldPsw = '';
    jsonObj.forEach(user => {
        if (user.email == loggedUserEmailObj) {
            oldPsw = user.password
        }
    });

    var valoreCorretto = true
    if ((oldPswAcquirente_value === "") || (pswAcquirente_value === "") || (psw2Acquirente_value === "")) {
        alert("Compila tutti i campi")
        valoreCorretto = false
    } else if (oldPswAcquirente_value != oldPsw) {
        alert("Password incorretta")
        valoreCorretto = false
    }

    if (pswAcquirente_value == oldPsw) {
        alert("Inserisci una nuova password")
        valoreCorretto = false
    }

    if (pswAcquirente_value != psw2Acquirente_value) {
        alert("Le password non corrispondono")
        valoreCorretto = false
    }

    if (valoreCorretto == true) {
        return true
    } else {
        return false
    }
}





document.getElementById("logoutAccount_A").addEventListener("click", () => {
    ImpostaColore("logoutAccount_A")
    alert("Stai Uscendo dal tuo account")
    localStorage.logged_user_email = "";
    setTimeout(function () {
        window.location.href = '../pagina_intro.html';
    }, 2000);
})



document.getElementById("deleteAccount_A").addEventListener("click", () => {
    ImpostaColore("deleteAccount_A")
    alert("Il tuo account sta per essere cancellato")
    detele_account();
    setTimeout(function () {
        window.location.href = '../pagina_intro.html';
    }, 2000);
})




function detele_account() {
    var list_users = []
    var list_acquirente = []
    jsonObj.forEach(user => {
        if (user.email != loggedUserEmailObj) {
            list_users.push(user);
        }
    })

    jsonAcquirenteObj.forEach(user => {
        if (user.email != loggedUserEmailObj) {
            list_acquirente.push(user);
        }
    })
    localStorage.logged_user_email = "";
    localStorage.setItem("json_users", JSON.stringify(list_users));
    localStorage.setItem("json_customer", JSON.stringify(list_acquirente));
}


function ImpostaColore(id) {
    document.getElementById("datiPersonali_A").style.background = "white";
    document.getElementById("datiPersonali_A").style.color = "black";
    document.getElementById("acquistiFatti").style.background = "white";
    document.getElementById("acquistiFatti").style.color = "black";
    document.getElementById("preferiti").style.background = "white";
    document.getElementById("preferiti").style.color = "black";
    document.getElementById("cambiaPwd_A").style.background = "white";
    document.getElementById("cambiaPwd_A").style.color = "black";
    document.getElementById("logoutAccount_A").style.background = "white";
    document.getElementById("logoutAccount_A").style.color = "black";
    document.getElementById("deleteAccount_A").style.background = "white";
    document.getElementById("deleteAccount_A").style.color = "black";

    document.getElementById(id).style.background = "#dc3545";
    document.getElementById(id).style.color = "white";
}