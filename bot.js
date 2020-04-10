const Discord = require("discord.js");
const auth = require("./auth.json");
const functions = require("./functions.js");
const client = new Discord.Client();
//TODO: Smalltalki do pliku
const greetings = ["Cześć", "Siema", "Elo", "Sima", "Siemaneczko", "Joł"];
const thanks = ["Dzięki", "Dziękuję", "Dziena", "Danke"];
const thanks_reply = ["Nie ma za co. ;)", "Nie ma sprawy. :)", "Do usług!"];
const action = ["Co robisz?", "Co porabiasz?", "Co tam?", "Co u Ciebie?"];
const action_reply = ["Aktualnie pielę ziemniaki.", "Stawiam klocka... Oby nikt nie poczuł!", "spałem...", "Nie przeszkadzaj sobie. Jestem tylko jebanym botem :)", "Analizuję fenomen przypadkowej fluktuacji w czterowymiarowym kontinuum czasoprzestrzennym",
"leję wodę", "programuję bota do discorda"];
const understanding = ["Nie rozumiem :(", "Co?", "Weź napisz jeszcze raz", "Nie czaję", "Napisz po polsku!", "Udam, że zrozumiałem..."];
//----------------------------------------------------------------------------------------------------------------
const prefix = ";";
const botName = "Tad1";
client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message",  async ( message) => {
        if (message.toString().startsWith(prefix)) {                                                                    //Wywołanie komendy
        let command = message.toString().replace(";", "");
        if (greetings.some(word => command.toLowerCase().includes(word.toLowerCase()))) {                               //Przywitanie
            message.reply(greetings[Math.floor((Math.random() * greetings.length))]);
        }
        else if (thanks.some(word => command.toLowerCase().includes(word.toLowerCase()))) {                             //Dziękowanie
            message.reply(thanks_reply[Math.floor((Math.random() * thanks_reply.length))]);
         }
        else if (action.some(word => command.toLowerCase().includes(word.toLowerCase()))) {                             //Akcje
            message.reply(action_reply[Math.floor((Math.random() * action_reply.length))]);
        }
        // TODO: Parametry po myślniku
        else if(command.includes("summoner")) {                                                                         //Summoner API
            let vars = ["accountId", "profileIconId", "id", "summonerLevel", "puuid"];
            let output = "";
            let parameters = command.split(" ");
            if(parameters.length != 3 && !command.includes("help"))  {
                message.reply("Nieprawidłowy format. Jeśli Twój nick zawiera spację, zastąp ją `<>`. Użyj komendy `;summoner help` aby zobaczyć listę prametrów")
            }  if(parameters[1] == "help" && parameters.length != 3) {
                message.reply("Użycie: `;summoner >nazwa gracza< >parametr<`.\nDostępne parametry:\n `AccountId`, `ProfileId`, `Id`, `Puuid`, `SummonerLevel`");
                }   else    {
                if (!vars.includes(parameters[2])) {
                    message.reply("Nieprawidłowy parametr.")
                } else {
                    let summonerName = parameters[1].replace("<>", " ").toString();
                    let out = await functions.getBySummonerName(summonerName, parameters[2]);
                    message.reply(summonerName + " " + parameters[2] + " : " + out);

                }
            }
            } else if(command.includes("current-match"))  {                                                             //Aktualny mecz
            let parameters = command.split(" ");
            if(parameters.length != 2 && !command.includes("help"))  {
                message.reply("Nieprawidłowy format. Jeśli Twój nick zawiera spację, zastąp ją `<>`. Użyj komendy `;current-match help` aby zobaczyć listę prametrów")
            }
            else if(parameters[1] == "help" && parameters.length != 2) {
                message.reply("Użycie: `;current-match >nazwa gracza<`.\n Jeżeli mecz trwa - wyświetli aktualnych członków gry, ich postacie, poziomy, punkty masterii.");
            } else  {
                let summonerName = parameters[1].replace("<>", " ").toString();
                let out = await functions.getCurrentMatchParticipants(summonerName);
                message.reply(out)
            }
        } else if(command.includes("rotation")) {                                                                       //Rotacja
            let parameters = command.split(" ");
            if(parameters.length != 1)  {
                message.reply("Zły format. Użyj `;rotation`, aby zobaczyć aktualną rotację bohaterów.")
            }   else    {
                message.reply("Darmowa rotacja: \n"+ await functions.freeRotation());
            }
        } else if(command.includes("lore")) {                                                                     //Lore
            let parameters = command.split(" ");
            if(parameters.length != 2)  {
                message.reply("Zła liczba parametrów. Wpisz nazwę postaci bez spacji, oraz znaków dodatkowych. \n Użyj parametru `keyset`, aby poznać klucze bohaterów.");
            }   else if(parameters[1] == "keyset")  {
                let response = await functions.staticData("keyset", "");
                await partialResponse(message, response);
            }
            else    {
                let response = await functions.staticData("champion", parameters[1]);
                await partialResponse(message, response)
            }
        }


        else    {
                message.reply(understanding[Math.floor((Math.random() * understanding.length))]);                       //Nie rozumie
            }
        }
        async function partialResponse(message, response)  {
            let res = response;
            res = res.replace("undefined", "");
            let packages = Math.ceil(response.length/1500);
            let counter = 0;

            if(packages == 1)   {
                console.log("1 paczka")
                message.reply(res)
            }  else {
                for(let i = 0; i < packages; i++)   {
                    message.reply(res.substring(counter, counter+1500));
                    counter = counter+1500;
                }
            }
        }
});

client.login(auth.token);