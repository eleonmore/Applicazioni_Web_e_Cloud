var loggedUserEmail = localStorage.getItem("logged_user_email");
var loggedUserEmailObj = JSON.parse(loggedUserEmail);

var jsonObjAsString = localStorage.getItem("json_users");
var jsonObj = JSON.parse(jsonObjAsString);

var jsonAcquirenteAsString = localStorage.getItem("json_customer");
var jsonAcquirenteObj = JSON.parse(jsonAcquirenteAsString);

var jsonVenditoreAsString = localStorage.getItem("json_seller");
var jsonVenditoreObj = JSON.parse(jsonVenditoreAsString);

var jsoninfoFilmString = localStorage.getItem("film_da_acquistare");
var jsoninfoFilmObj = JSON.parse(jsoninfoFilmString);



const carte = document.getElementById('carteRegistrate');       // mostra carte registrate
jsonAcquirenteObj.forEach(acquirente => {
    if (acquirente.email == loggedUserEmailObj) {
        var clientCards = acquirente.cards
        if (clientCards.length == 0) {
            carte.innerHTML =
                `<div>
                    Nessuna carta registrata
                    </div>
                    `
        } else {
            clientCards.forEach(card => {
                const { nomeC, numeroC, scadenza } = card;
                console.log(card)
                carte.innerHTML += `
                <div class="mb-4 mx-2 flex-even">
                    <input type="radio" class="btn-check" name="carta" autocomplete="off" id="${numeroC}">
                    <label class="btn btn-outline-danger p-4 h-100 w-100" for="${numeroC}">
                        <b class="text-dark">${nomeC}</b><br>
                            <hr>
                            <div>
                                <b class="text-danger">Numero Carta:</b><br>
                                <span class="text-white">${numeroC}</span></br></br>
                            
                                <b class="text-danger">Scadenza:</b><br>
                                <span class="text-white">${scadenza}</span></br>
                            </div>
                    </label>
                </div>
                `
            });
        }
    }
});

document.getElementById("effettuoAcquisto").addEventListener("click", () => {
    var prosegui = false
    var nomeC = ""
    jsonAcquirenteObj.forEach(acquirente => {
        if (acquirente.email == loggedUserEmailObj) {
            var clientCards = acquirente.cards
            clientCards.forEach(card => {
                if (document.getElementById(card.numeroC).checked == true) {        // controllo selezione di una carta per proseguire
                    prosegui = true
                    nomeC = card.nomeC

                }
            })
            if (prosegui == false) {
                alert("Pagamento non riuscito, riprovare")
            } else {
                var recensione = ""
                recensione = prompt("Inserisci una recensione al venditore");
                MemorizzaRecensione(recensione, acquirente.nome)
                MemorizzaFilmComprato(nomeC)
            }
        }
    })
})



function MemorizzaRecensione(recensione, nomeA) {
    if (recensione != null) {
        var obj = {}
        obj['nome'] = nomeA;
        obj['recensione'] = recensione;
        obj['tipoAcquisto'] = jsoninfoFilmObj.tipo;
        obj['nomeFilm'] = jsoninfoFilmObj.titolo;

        jsonVenditoreObj.forEach(venditore => {
            if (venditore.email == jsoninfoFilmObj.email_V) {
                venditore.recensioni.push(obj)
            }
        });

        localStorage.setItem("json_seller", JSON.stringify(jsonVenditoreObj));
    }
}


function MemorizzaFilmComprato(nomeC) {
    var time = new Date();
    var obj = {}
    obj['poster_path'] = jsoninfoFilmObj.poster_path;
    obj['id'] = jsoninfoFilmObj.id;
    obj['titolo'] = jsoninfoFilmObj.titolo;
    obj['tipo'] = jsoninfoFilmObj.tipo;
    obj['prezzo'] = jsoninfoFilmObj.prezzo;
    obj['nomeC'] = nomeC;
    obj['giorno'] = time.getTime();

    jsonAcquirenteObj.forEach(acquirente => {
        if (acquirente.email == loggedUserEmailObj) {
            acquirente.acquistiFatti.push(obj)
        }
    });

    localStorage.setItem("json_customer", JSON.stringify(jsonAcquirenteObj));
    alert("Acquisto avvenuto con successo")
    window.location.href = "informazioniGenerali-A.html"
}



// MEMORIZZA CARTA
/////////////////////////////////////////////////////////////////////////////////////

function DatiCarta() {
    const form = document.getElementById("datiCarta");
    jsonAcquirenteObj.forEach(acquirente => {
        if (acquirente.email == loggedUserEmailObj) {
            var clientCards = acquirente.cards
            console.log(clientCards)
            if (clientCards.length > 3) {
                alert("Non è possibile memorizzare altre carte")
            } else {
                form.innerHTML = ` 
    </br>
    <div class="row justify-content-center">
    <form class="col-sm-10 col-md-8 col-lg-6 needs-validation" action="" name="registaCarta" id="registaCarta">

        <div class="form-floating mb-3">
            <input class="form-control" type="text" name="nomeC" id="nomeC" placeholder="Nome Intestatario" />
            <label for="nomeC">Nome Intestatario</label>
            <p>Error Message</p>
        </div>

        <div class="form-floating mb-3">
            <input class="form-control" type="number" name="numeroC" id="numeroC" placeholder="Numero Carta" />
            <label for="numeroC">Numero Carta</label>
            <p>Error Message</p>
        </div>

        <div class="row g-2">
            <div class="col-md">
                <div class="form-floating">
                    <input class="form-control" type="month" id="scadenza" name="scadenza" placeholder="Data scadenza">
                    <label for="scadenza">Data Scadenza</label>
                    <p>Error Message</p>
                </div>
            </div>

            <div class="col-md">
                <div class="form-floating">
                    <input class="form-control" type="number" name="cvv" id="cvv" placeholder="CVV" />
                    <label for="cvv">CVV</label>
                    <p>Error Message</p>
                </div>
            </div>
        
            <button type="submit" class="btn btn-lg btn-danger">Aggiungi Carta</button>
        </div>
    </form>
    </div>
    `

                document.getElementById("registaCarta").addEventListener("submit", event => {
                    event.preventDefault();
                    if (ControlloDati() == true) {
                        RegistraCarta();
                        setTimeout(function () {
                            window.location.href = 'Pagamento.html';
                        }, 2000);
                    }
                })
            }
        }
    })
}


function setFormMessage(formElement, type, message) {       // INSERISCE MESSAGGIO 

    if (type === "error") {
        formElement.style.border = '3px red solid';
        const parent = formElement.parentElement;           // restituisce div specifico
        const p = parent.querySelector('p');                // spazio dedicato al messaggio 
        p.textContent = message;
        p.style.visibility = 'visible';

    } else if (type === "success") {
        formElement.style.border = '3px green solid';
        const parent = formElement.parentElement;
        const p = parent.querySelector('p');
        p.style.visibility = 'hidden';

    } else {
        formElement.style.border = '3px black solid';
    }
}


function ControlloDati() {                              // controlli dati registrazione carta
    const nomeC = document.getElementById('nomeC')
    const numeroC = document.getElementById('numeroC')
    const scadenza = document.getElementById('scadenza')
    const cvv = document.getElementById('cvv')

    const nomeC_value = nomeC.value.trim();
    const numeroC_value = numeroC.value.trim();
    const scadenza_value = scadenza.value.trim();
    const cvv_value = cvv.value.trim();

    var valoreCorretto = true
    var cartaEsistente = false

    jsonAcquirenteObj.forEach(acquirente => {
        if (acquirente.email == loggedUserEmailObj) {
            var elencoCarte = acquirente.cards
            elencoCarte.forEach(carta => {
                if (numeroC_value == carta.numeroC) {
                    cartaEsistente = true;
                }
            });
        }
    })


    if (cartaEsistente == true) {
        alert("Carta inserita già registrata sul sito")
        valoreCorretto = false
    }


    if (nomeC_value === "") {
        setFormMessage(nomeC, "error", "Campo da compilare");
        valoreCorretto = false
    } else {
        setFormMessage(nomeC, "success", 'Correct');
    }


    if (numeroC_value === "") {
        setFormMessage(numeroC, "error", "Campo da compilare");
        valoreCorretto = false
    } else if (numeroC_value.length < 13 || numeroC_value.length > 16) {
        setFormMessage(numeroC, "error", 'Numero carta non valido');
        valoreCorretto = false
    } else {
        setFormMessage(numeroC, "success", 'Correct');
    }


    if (scadenza_value === "") {
        setFormMessage(scadenza, "error", "Campo da compilare");
        valoreCorretto = false
    } else {
        setFormMessage(scadenza, "success", 'Correct');
    }

    if (cvv_value === "") {
        setFormMessage(cvv, "error", "Campo da compilare");
        valoreCorretto = false
    } else if (cvv_value.length !== 3) {
        setFormMessage(cvv, "error", "Campo non valido");
        valoreCorretto = false
    } else {
        setFormMessage(cvv, "success", 'Correct');
    }

    if (valoreCorretto == true) {
        return true
    } else {
        return false
    }
}


function RegistraCarta() {
    const nomeC = document.getElementById('nomeC')
    const numeroC = document.getElementById('numeroC')
    const scadenza = document.getElementById('scadenza')
    const cvv = document.getElementById('cvv')

    const nomeC_value = nomeC.value.trim();
    const numeroC_value = numeroC.value.trim();
    const scadenza_value = scadenza.value.trim();
    const cvv_value = cvv.value.trim();

    var obj = {}

    obj['nomeC'] = nomeC_value;
    obj['numeroC'] = numeroC_value;
    obj['scadenza'] = scadenza_value;
    obj['cvv'] = cvv_value;

    jsonAcquirenteObj.forEach(acquirente => {
        if (acquirente.email == loggedUserEmailObj) {
            acquirente.cards.push(obj)
        }
    })
    localStorage.setItem("json_customer", JSON.stringify(jsonAcquirenteObj));
}


/////////////////////////////////////////////////////////////////////////////////////////