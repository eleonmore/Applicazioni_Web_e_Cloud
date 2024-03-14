var json_users = [{                         // CREA OGGETTI DA MEMORIZZARE NEL L.S.
    "email": "mario.rossi@gmail.com",
    "password": "Mario123",
    "tipoIscritto": "venditore",
}, {
    "email": "sofia.verdi@libero.it",
    "password": "sofi9876",
    "tipoIscritto": "acquirente",
}]

var json_seller = [{
    "nome": "Mario",
    "cognome": "Rossi",
    "dataNascita": "12/12/86",
    "numeroCell": 3472877345,
    "email": "mario.rossi@gmail.com",
    "password": "Mario123",
    "nomeNegozio": "milano shop",
    "indirizzoNegozio": "via della spiga",
    "numeroIndirizzo": "12",
    "city": "milano",
    "stato": "italy",
    "IVA": 12312312312,
    "prezzoVenditore": 0.5,
    "listaFilmSelezionati": [],
    "recensioni": []
}];

var json_customer = [{
    "nome": "sofia",
    "cognome": "verdi",
    "dataNascita": "12/12/86",
    "numeroCell": 3472877345,
    "email": "sofia.verdi@libero.it",
    "password": "sofi9876",
    "city": "milano",
    "stato": "italy",
    "generePreferito": "",
    "listaFilmSelezionati": [],
    "acquistiFatti": [],
    "cards": []
}]

/*var json_all_movies = [{
    "id": "",
    "price_selling": "",
    "price_rental": ""
}]*/


if (localStorage.getItem("json_users") == null) {
    localStorage.setItem("json_users", JSON.stringify(json_users));
    localStorage.setItem("json_seller", JSON.stringify(json_seller));
    localStorage.setItem("json_customer", JSON.stringify(json_customer));
    //  localStorage.setItem("json_all_movies", JSON.stringify(json_all_movies));
}



function showForm(tipo_iscritto) {
    var form0 = document.getElementById('section_0');
    var form1 = document.getElementById('section_1');
    if (tipo_iscritto == "venditore") {
        form1.style.display = "none";
        form0.style.display = "block";
    } else {
        form0.style.display = "none";
        form1.style.display = "block";
    }
}


function isEmail(email) {           // FUNZIONE CHE TESTA LA MAIL 
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}


function setFormMessage(elemento, type, message) {       // INSERISCE MESSAGGIO 

    if (type === "error") {
        elemento.style.border = '3px red solid';
        const parent = elemento.parentElement;           // parent recupera l'htlm relativo all'elemento passato
        const p = parent.querySelector('p');
        p.textContent = message;
        p.style.visibility = 'visible';

    } else if (type === "success") {
        elemento.style.border = '3px green solid';
        const parent = elemento.parentElement;
        const p = parent.querySelector('p');
        p.style.visibility = 'hidden';

    } else {
        elemento.style.border = '3px black solid';
    }
}




// LOGIN

function checkUser(emailLogin, pwdLogin) {                              // CONTROLLA SE L'EMAIL E LA PWD INSERITA SONO GIà PRESENTI NEL L.S.

    risultato = TrovaEmail(emailLogin.value.trim());       // CERCA MATCH NELL'EMAIL
    if (risultato != false) {
        setFormMessage(emailLogin, "success", 'Correct');
        TrovaPwd(pwdLogin, pwdLogin.value.trim(), risultato);        // CERCA MATCH NELLA PWD 
    } else {
        setFormMessage(emailLogin, "error", 'L\' email non è memorizzata');
    }
}


function TrovaEmail(email_value) {                     // CONTROLLA NELL'OGGETTO NEL L.S. SE C'è EMAIL
    var jsonObjAsString = localStorage.getItem("json_users");
    const jsonObj = JSON.parse(jsonObjAsString)
    console.log(jsonObj)
    for (var i = 0; i < jsonObj.length; i++) {
        if (jsonObj[i].email == email_value) {

            return jsonObj[i];
        }
    }
    return false;
}


function TrovaPwd(pwdLogin, pwd_value, obj) {                    // CONTROLLA NELL'OGGETTO NEL L.S. SE C'è PWD
    console.log(obj)
    if (obj.password == pwd_value) {
        setFormMessage(pwdLogin, "success", 'Correct');
        localStorage.logged_user_email = JSON.stringify(obj.email);            // ricordo l'email dell'utente loggato
        setTimeout(function () {
            if (obj.tipoIscritto == "venditore") {
                window.location.href = 'Venditore/Sito_Venditore.html';      // VA ALLA PAG DELL'ACQUIRENTE
            } else {
                window.location.href = 'Acquirente/Sito_Acquirente.html';      // VA ALLA PAGINA DEL VENDITORE
            }
        }, 2000);
    } else {
        setFormMessage(pwdLogin, "error", 'La password non è valida');
    }

}





function addinfoLogin(emailV_value, pwdV_value, tipoIscritto) {      // AGGIUNGE INFO NELL'OGGETTO NEL L.S.
    var users_string = localStorage.getItem("json_users");
    var users = JSON.parse(users_string);

    var obj = {}
    obj['email'] = emailV_value;
    obj['password'] = pwdV_value;
    obj['tipoIscritto'] = tipoIscritto;

    users.push(obj);
    localStorage.setItem("json_users", JSON.stringify(users));

}



function addVenditore(nomeV_value, cognomeV_value, dataNascitaV_value, numeroCell_value, emailV_value, pwdV_value, nomeNegozio_value, indirizzoNegozioV_value, numeroIndirizzoV_value, cityV_value, statoV_value, IVA_value, prezzoVenditore) {                                  // AGGIUNGE INFO NELL'OGGETTO NEL L.S. SPECIFICO PER I VENDITORI

    var seller_string = localStorage.getItem("json_seller");
    var seller = JSON.parse(seller_string)
    console.log(seller)
    var obj = {}
    obj['nome'] = nomeV_value;
    obj['cognome'] = cognomeV_value;
    obj['dataNascita'] = dataNascitaV_value;
    obj['numeroCell'] = numeroCell_value;
    obj['email'] = emailV_value;
    obj['password'] = pwdV_value;
    obj['nomeNegozio'] = nomeNegozio_value;
    obj['indirizzoNegozio'] = indirizzoNegozioV_value;
    obj['numeroIndirizzo'] = numeroIndirizzoV_value;
    obj['city'] = cityV_value;
    obj['stato'] = statoV_value;
    obj['IVA'] = IVA_value;
    obj['prezzoVenditore'] = prezzoVenditore;
    obj['listaFilmSelezionati'] = []
    obj['recensioni'] = []

    seller.push(obj);
    console.log(seller)
    localStorage.setItem("json_seller", JSON.stringify(seller));
}



// AGGIUNGE IL NUOVO CLIENTE NEL LOCAL STORAGE 
function addAcquirente(nomeA_value, cognomeA_value, dataA_value, telefonoA_value, emailA_value, pwdA_value, cityA_value, statoA_value, generePreferito) {                              // AGGIUNGE INFO NELL'OGGETTO NEL L.S. SPECIFICO PER I ACQUIRENTI

    var customer_string = localStorage.getItem("json_customer");
    var customer = JSON.parse(customer_string);

    var obj = {}
    obj['nome'] = nomeA_value;
    obj['cognome'] = cognomeA_value;
    obj['dataNascita'] = dataA_value;
    obj['numeroCell'] = telefonoA_value;
    obj['email'] = emailA_value;
    obj['password'] = pwdA_value;
    obj['city'] = cityA_value;
    obj['stato'] = statoA_value;
    obj['generePreferito'] = generePreferito
    obj['listaFilmSelezionati'] = []
    obj['acquistiFatti'] = []
    obj['cards'] = []
    obj['purchase_history'] = []

    customer.push(obj);
    localStorage.setItem("json_customer", JSON.stringify(customer));
}

