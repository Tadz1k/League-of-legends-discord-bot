const LeagueJS = require('leaguejs');
const api = new LeagueJS(process.env.LEAGUE_API_KEY);
let globalVariable = "";
let globalStaticData = "";

async function getBySummonerName(summonerName, item) {
    try {
        const data = await api.Summoner.gettingByName(summonerName);
        assignData(data, item);
    } catch (e) {
        globalVariable = "Brak danych";
        console.log(e);
    }
    return globalVariable;
}
async function getCurrentMatchParticipants(summonerName)    {
    try {
        const summonerId = await getBySummonerName(summonerName, "id");
        const data = await api.Spectator.gettingActiveGame(summonerId.toString());
        assignData(data, "participants");
        let team1 = [];
        let team2 = [];
        let team1Index = 0;
        let team2Index = 0;
        for(let champion in globalVariable) {
            if(globalVariable[champion]["teamId"] == "100")   {
                team1[team1Index++] = champion;
            }
            if(globalVariable[champion]["teamId"] == "200")   {
                team2[team2Index++] = champion;
            }
        }
        let team1_final = await teamScrapper(team1);
        let team2_final = await teamScrapper(team2);
        let output = "\n***BLUE TEAM:***```\n"+team1_final+"```\n***RED TEAM:***```"+team2_final+"```";
        return output;
    }   catch (e) {
        console.log(e);
        return ["BRAK_DANYCH\nNie jest rozgrywany żaden mecz?"];
    }
    return globalVariable;
}

async function championResolver(id) {
    var output;
    try {
        const staticData = await api.StaticData.gettingChampionById(id);
        output = staticData;
    } catch (e) {
        console.log(e);
        output = "BRAK DANYCH.\nZłe ID championa?";
    }
    return output;
}

async function summonerResolver(name)   {
    var output;
    try {
        const data = await api.Summoner.gettingByName(name);
        output = data;
    }   catch (e) {
        output = "NO DATA";
        console.log(e)
    }
    return output;
}

async function getChampionMastery(summonerId, championId)   {
    var output;
    try {
        const championMastery = await api.ChampionMastery.gettingBySummonerForChampion(summonerId, championId);
        output = championMastery["championPoints"];
    } catch (e) {
        output = "0";
        console.log(e);
    }
    return output;
}

async function assignData(data, item)  {
        globalVariable = data[item];
}

async function teamScrapper(team)   {
    let output = "";
    let summonerId;
    let championId;
    let summonerName;
    let summonerLevel;
    let championName;
   for(let item in team)   {
       summonerName = globalVariable[team[item]]["summonerName"];
       summonerId = globalVariable[team[item]]["summonerId"];
       championId = globalVariable[team[item]]["championId"];
       championName = championId;
       var mastery = await getChampionMastery(summonerId, championId);
       championName = await championResolver(championId);
       summonerLevel = await summonerResolver(summonerName)
       output = output+summonerName + " LVL: " + summonerLevel["summonerLevel"] + " Champion: " +championName["name"]+" Mastery: "+mastery+"\n";
   }
   return output
}

async function freeRotation()   {
    let championName;
    let championId;
    let output = "";
    try {
        const rotation = await api.Champion.gettingRotations();
        for(let item in rotation["freeChampionIds"])   {
            championId = rotation["freeChampionIds"][item];
            championName = await championResolver(championId);
            output = output + "`"+championName["name"]+"`" + ", ";
        }
    }   catch (e) {
        output = "Błąd";
        console.log(output);
    }
    return output;
}

async function staticData(item, key)    {
    let output = "";
    let championName;
    let championTitle;
    let championImage;
    let championId;
    let championLore;
    let allytips;
    let enemytips;
    let tags;
    let spells;
    let passive;
    let skins;
    let champions = await api.StaticData.ddragonHelper.gettingFullChampionsList("", process.env.LANGUAGE);
    //Image = https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/84.png
    //Image2 = https://raw.communitydragon.org/latest/game/assets/characters/aatrox/hud/aatrox_circle.png
    //All https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/
    //Skins https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/84/
    //SKils https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/aatrox/hud/icons2d/
    //Voices: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-choose-vo/
    if(item.toLowerCase() == "champion") {
        try {

            //const champions = await api.StaticData.gettingChampions(process.env.LEAGUE_API_PLATFORM_ID, {options: "championFull", version:"latest", locale:"pl_PL"})
            var pickedChampion;
            for(let champion in champions)  {
                let temp = champions[champion][key];
                if(temp != null) {
                    pickedChampion = champions[champion][key];
                }
            }
            championId = pickedChampion["id"];
            championName = pickedChampion["name"];
            championTitle = pickedChampion["title"];
            championImage = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/"+championId+".png";
            championLore = pickedChampion["lore"];
            allytips = pickedChampion["allytips"]; //tab
            enemytips = pickedChampion["enemytips"]; //tab
            tags = pickedChampion["tags"]; //tab
            spells = pickedChampion["spells"]; //tab
            passive = pickedChampion["passive"];
            skins = pickedChampion["skins"]; //tab
            //TABLICE------------------------------------------
            let allytips_final = await arrayToString(allytips);
            let enemytips_final = await arrayToString(enemytips);
            let tags_final = await arrayToString(tags);
            let skins_final = "";
            let spells_final = "";
            for(let spell in spells)    {
                spells_final = spells_final + "`"+spells[spell]["id"]+"`: "+spells[spell]["name"]+"\n"+spells[spell]["description"]+"\n";
            }
            spells_final = spells_final + "`Umiejęrność pasywna:`"+passive["name"]+"\n"+passive["description"]+"\n";
            for(let skin in skins)  {
                let name = skins[skin]["name"].replace("default", "Standard");
                skins_final = skins_final+name+"\nhttps://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/"+championId+"/"+skins[skin]["id"]+".jpg\n";
            }
            output = "***"+championName+"*** - "+championTitle+"\n"+tags_final+championImage+"\n"+championLore+"\n***"+championName+" w teamie:***\n"+allytips_final+"\n***"+championName+" w drużynie przeciwnej:***" +
                "\n"+enemytips_final+"***Umiejęrności:***\n"+spells_final+"***Skiny:***\n"+skins_final;

            return output;
        }   catch (e) {
            console.log(e)
            output = "Brak danych. Nieprawidłowa nazwa?";
        }
    }   else if(item.toLowerCase() == "keyset")   {
        output = "\n***Aktualny keyset:***\n"
        for(let champion in champions)  {
            let temp = champions[champion];
            for(let championData in temp)   {
                let champKey = temp[championData]["key"];
                if(champKey != null) {
                    output = output + champKey+", ";
                }
            }
        }
    }
    return output;
}

async function arrayToString(array)   {
    let output = ""
    for(let item in array)  {
        output = output + array[item] + "\n";
    }
    return output;
}

module.exports.getBySummonerName = getBySummonerName;
module.exports.getCurrentMatchParticipants = getCurrentMatchParticipants;
module.exports.freeRotation = freeRotation;
module.exports.staticData = staticData;
