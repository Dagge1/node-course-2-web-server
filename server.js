// kreiranje Node web servera sa Express modulom (framework za servere)

const express = require('express');
const hbs = require('hbs');  // handlebars, view engine za Express (dinamičke stranice)
const fs = require('fs');  // file system za snimiti log i GET requeste u fajl (ne treba)

var app = express();   // kreiranje express aplikacije (metode)

// Express middleware kojim tweakamo Express prema potrebi, za prikaz stranica u direktoriju
// __dirname je apsolutni path od server roota do našeg direktorija + naš direktorij
// za običan node app koji samo serva direktorij, dovoljno je ove tri linije koda + app.listen()
// u taj dir možemo staviti i pozvati bilo koji fajl, html, css, js, pdf, image itd
//  /public je javni direktorij gjdesvi mogu vidjeti sadržaj 

hbs.registerPartials(__dirname + '/views/partials');  // partials su templates za reusable kod (npr footer)
app.set('view engine', 'hbs');  // za view engine handlebars-a
// app.use je način kako Express registrira middleware. Public je direktorij gdje smještamo sve normalne fajlove...
// html, css, pdf, json, png (slike) itd. Pozivamo direktno bez /public direktorija... localhost:3000/help.html

app.use((req, res, next) => {  // next će reći Expressu kada smo gotovi, ako u funkciji nema ništa
// neće mi nikada do kraja downloadati stranicu home.hbs ili bilo koju drugu
// to je zato jer ovaj middleware nikada ne zove next pa program stane, iako server radi
// app.use nam omogućava korištenje middleware da npr pratimo kako nam server radi
    var now = new Date().toString();  // toString daje fini format datuma
    var log = now + ': '+ req.method + ' ' + req.url; // logira kada je netko pristupio stranici (prikaže u CLI)
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {  // sejva log podatke u fajl
        if (err) {
            console.log('Unable to append data to server.log');
        }
    });
    next();  // nakon ovog calla program radi dalje nesmetano
});
/*
app.use((req, res, next) => {  // sve ostalo će stati i javiti će se maintenance stranica jer nema next()
    res.render('maintenance.hbs');
});
*/
app.use(express.static(__dirname + '/public'));  // middleware, učimo Express kako da čita iz static direktorija

hbs.registerHelper('getCurrentYear', () => {  // helper služi da ubaci js kod ili funkciju na mjesto{{}} u .hbs
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {  // drugi primjer helpera za .hbs, toUppercase
    return text.toUpperCase();
});

// handler za HTTP GET request - kada netko posjeti našu stranicu šta da radi stranica
// 2 argumenta, prvi je URL, (/ je root), drugi je funkcija koja određuje
// šta poslati onom koji je pokrenuo request 
// req sprema info o requestu koji je došao, od headera, body informacija, path itd
// res sadrži metode za odgovor na HTTP request

// ovih par linija je cijeli server. Pokrećemo ga sa CLI terminala a gledamo u browseru
// kada je pokrenuta aplikacija stalno radi i sluša (listen). Isključio je u CLI sa Ctrl C
app.get('/', (req, res) => {    // root
    res.render('home.hbs', {
        pageTitle: 'Home page',  // object sa dinamičkim podacima za prikazati na str. home.hbs
        welcomeMessage: 'Welcome to the my site'
    });
}); 
// get za drugu stranicu (localhost:3000/about)
app.get('/about', (req, res) => { // about.hbs se nalazi u /views, render. dinamičkim template-ima stranica
    res.render('about.hbs', {  // render renderira moje template zavisno o mom view engineu
        pageTitle: 'About Page'   // objekt sa dinamičkim podacima koje će ubaciti u stranicu
    });    
});

// get request za error stranicu /bad, response je JSON poruka
app.get('/bad', (req, res) => {
    res.send({errorMessage: 'Something went wrong'});
    
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
// kada je app.listen() pokrenuta aplikacija stalno sluša (listen) naše requeste. Isključim je u CLI sa Ctrl + C
// listener spaja našu aplikaciju sa portom na local kompjuteru ili serveru (za localhost 3000)
// u browseru pokrećemo localhost:3000 To će pokrenuti root dir web stranice
// funkcija kao argument je opciona, u CLI prikazuje poruku dok čekamo da server starta

