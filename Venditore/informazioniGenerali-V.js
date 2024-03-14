var loggedUserEmail = localStorage.getItem("logged_user_email");
var loggedUserEmailObj = JSON.parse(loggedUserEmail);

var jsonObjAsString = localStorage.getItem("json_users");
var jsonObj = JSON.parse(jsonObjAsString);

var jsonVenditoreAsString = localStorage.getItem("json_seller");
var jsonVenditoreObj = JSON.parse(jsonVenditoreAsString);


nomeUtenteA = document.getElementById("nomeUtenteV")            // info nome utente loggato
jsonVenditoreObj.forEach(user => {
    if (user.email == loggedUserEmailObj) {
        nomeUtenteA.innerHTML = `<a href="#"  class="nav-link text-white">Loggato come <b>${user.nome} ${user.cognome} </b></a>`
    }
})



document.getElementById("datiPersonali_V").addEventListener("click", () => {
    ImpostaColore("datiPersonali_V")             // colore bottone 
    const div_laterale = document.getElementById("dati_laterali_V");
    jsonVenditoreObj.forEach(user => {
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
document.getElementById("shop").addEventListener("click", () => {
    ImpostaColore("shop")
    const div_laterale = document.getElementById("dati_laterali_V");
    div_laterale.innerHTML = `
                <h1>Film selezionati dalla lista</h1>`

    jsonVenditoreObj.forEach(user => {                          // ciclo su tutti i venditori
        if (user.email == loggedUserEmailObj) {
            user.listaFilmSelezionati.forEach(film => {         // ciclo su tutti i film del mio attuale venditore
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
                                        <span class="text-dark"><b>Prezzo Acquisto:</b> ${film.prezzo_acquisto}</span>
                                        </br>
                                        <span class="text-dark"><b>Prezzo Noleggio:</b> ${film.prezzo_noleggio}</span>
                            </div>
                        </div>
                    </li>
                </ul>
                `;
            })
        }
    })

})




document.getElementById("recensioni").addEventListener("click", () => {
    ImpostaColore("recensioni")
    const div_laterale = document.getElementById("dati_laterali_V");
    div_laterale.innerHTML = `
                <h1>Recensione dei clienti</h1>`

    jsonVenditoreObj.forEach(user => {
        if (user.email == loggedUserEmailObj) {
            user.recensioni.forEach(valutazione => {
                div_laterale.innerHTML += `
                <ul class="list-group mb-3">
                    <li class="list-group-item py-3">
                    <div class="row g-3">
                    <span>
                       <b>Nome utente:</b>
                       ${valutazione.nome}
                    </span>
                       </br>
                    <span>
                       <b>Recenzione:</b>
                       ${valutazione.recensione}
                    </span>
                    <hr>
                    <span>
                       <b>Tipo di acquisto effettuato:</b>
                       ${valutazione.tipoAcquisto}
                    </span>
                    <span>
                       <b>Titolo comprato:</b>
                       ${valutazione.nomeFilm}
                    </span>
                       </div>
                    </li>
                </ul>
                `;
            })
        }
    })

})




document.getElementById("cambiaPwd_V").addEventListener("click", () => {
    ImpostaColore("cambiaPwd_V")
    const div_laterale = document.getElementById("dati_laterali_V");
    jsonVenditoreObj.forEach(user => {
        if (user.email == loggedUserEmailObj) {
            div_laterale.innerHTML = `
            <form class="mt-3" name="formPwd" action="" method="post">
                <div class="mb-3 formInput-group form-account-changes">
                            <label for="exampleInputPassword1" class="form-label"><b>Password vecchia</b></label>
                            <input type="password" class="form-control account-input" name="oldPswVenditore" id="oldPswVenditore">
                        </div>
                        <div class="mb-3 formInput-group form-account-changes">
                        <label for="exampleInputPassword1" class="form-label"><b>Password nuova</b></label>
                        <input type="password" class="form-control account-input" name="pswVenditore" id="pswVenditore">
                    </div>
                        <div class="mb-3 formInput-group form-account-changes">
                            <label for="exampleInputPassword1" class="form-label"><b>Conferma Password nuova</b></label>
                            <input type="password" class="form-control account-input" name="psw2Venditore" id="psw2Venditore">
                        </div>
                <br>
                <button type="submit" value="submit" id="sumbitChangesPwdV" class="btn btn-danger">Submit</button><br><br> 
                </form>
                `

            sumbitChangesPwdV.addEventListener("click", event => {

                const oldPswVenditore = document.querySelector("#oldPswVenditore");
                const pswVenditore = document.querySelector("#pswVenditore");
                const psw2Venditore = document.querySelector("#psw2Venditore");
                console.log(jsonVenditoreObj)
                if (ControlloPwd(oldPswVenditore, pswVenditore, psw2Venditore) == true) {          // controlli su pwd
                    alert("Cambio password avvenuto con successo")
                    jsonVenditoreObj.forEach(user => {
                        if (user.email.trim() == loggedUserEmailObj) {
                            user.password = pswVenditore.value.trim()
                            localStorage.setItem("json_seller", JSON.stringify(jsonVenditoreObj));  // cambio pwd nell'elenco venditori
                        }
                    })

                    jsonObj.forEach(user => {
                        if (user.email.trim() == loggedUserEmailObj) {
                            user.password = pswVenditore.value.trim()
                            localStorage.setItem("json_users", JSON.stringify(jsonObj));            // cambio pwd nell'elenco utenti
                        }
                    });
                } else {
                    event.preventDefault();
                }
            })
        }
    })

})




function ControlloPwd(oldPswVenditore, pswVenditore, psw2Venditore) {
    const oldPswVenditore_value = oldPswVenditore.value.trim();
    const pswVenditore_value = pswVenditore.value.trim();
    const psw2Venditore_value = psw2Venditore.value.trim();

    var oldPsw = '';
    jsonObj.forEach(user => {
        if (user.email == loggedUserEmailObj) {
            oldPsw = user.password
        }
    });

    var valoreCorretto = true
    if ((oldPswVenditore_value === "") || (pswVenditore_value === "") || (psw2Venditore_value === "")) {
        alert("Compila tutti i campi")
        valoreCorretto = false
    } else if (oldPswVenditore_value != oldPsw) {
        alert("Password incorretta")
        valoreCorretto = false
    }

    if (pswVenditore_value == oldPsw) {
        alert("Inserisci una nuova password")
        valoreCorretto = false
    }

    if (pswVenditore_value != psw2Venditore_value) {
        alert("Le password non corrispondono")
        valoreCorretto = false
    }

    if (valoreCorretto == true) {
        return true
    } else {
        return false
    }
}




document.getElementById("logoutAccount_V").addEventListener("click", () => {
    ImpostaColore("logoutAccount_V")
    alert("Stai Uscendo dal tuo account")
    localStorage.logged_user_email = "";
    setTimeout(function () {
        window.location.href = '../pagina_intro.html';
    }, 2000);
})



document.getElementById("deleteAccount_V").addEventListener("click", () => {
    ImpostaColore("deleteAccount_V")
    alert("Il tuo account sta per essere cancellato")
    detele_account();
    setTimeout(function () {
        window.location.href = '../pagina_intro.html';
    }, 2000);
})




function detele_account() {
    var list_users = []
    var list_venditore = []
    jsonObj.forEach(user => {
        if (user.email != loggedUserEmailObj) {
            list_users.push(user);
        }
    })

    jsonVenditoreObj.forEach(user => {
        if (user.email != loggedUserEmailObj) {
            list_venditore.push(user);
        }
    })

    localStorage.logged_user_email = "";
    localStorage.setItem("json_users", JSON.stringify(list_users));
    localStorage.setItem("json_seller", JSON.stringify(list_venditore));
}




function ImpostaColore(id) {
    document.getElementById("datiPersonali_V").style.background = "white";
    document.getElementById("datiPersonali_V").style.color = "black";
    document.getElementById("shop").style.background = "white";
    document.getElementById("shop").style.color = "black";
    document.getElementById("recensioni").style.background = "white";
    document.getElementById("recensioni").style.color = "black";
    document.getElementById("cambiaPwd_V").style.background = "white";
    document.getElementById("cambiaPwd_V").style.color = "black";
    document.getElementById("logoutAccount_V").style.background = "white";
    document.getElementById("logoutAccount_V").style.color = "black";
    document.getElementById("deleteAccount_V").style.background = "white";
    document.getElementById("deleteAccount_V").style.color = "black";

    document.getElementById(id).style.background = "#dc3545";
    document.getElementById(id).style.color = "white";
}