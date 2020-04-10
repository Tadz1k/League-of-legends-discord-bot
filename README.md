# League-of-legends-discord-bot

Discord bot - written for educational purposes as first contact with JS.
Project is using [api-wrapper LeagueJS](https://www.npmjs.com/package/leaguejs) and [discord.js](https://www.npmjs.com/package/discord.js?source=post_page-----7b5fe27cb6fa----------------------).

### Commands
Every command that is understandable for bot start with `;`. Smalltalks is written in polish language into code. 

```
;summoner <help> / <nickname> <item> - it shows basic info about account. SummonerId, SummonerLevel, ProfileIconId etc.
;current-match <help> / <nickname> - it shows info about current match of player. All participants, their champions, level, and champion mastery.
;rotation - current free rotation
;lore <championname> / <keyset> - it shows lore about champion passed as parameter. Keyset is for show current, available characters by their key.
```

### How to run
Except for nodejs you should install dependencies for discord and leaguejs wrapper.
`npm install discord.js`
`npm install leaguejs`

Project is using enviroment variables that storages riot api key, platform, and language.
`LEAGUE_API_KEY=apikey;LEAGUE_API_PLATFORM_ID=eun1;LEAGUE_VERSION=10.7.3;LANGUAGE=pl_pl`

After all - change your discord api key in `auth.json` file.

### Images    
![alt text](https://i.imgur.com/t4iixOl.png "Free rotation")
![alt-text](https://i.imgur.com/cc6Anmr.png "Current match")
