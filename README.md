node-steam
====================

[Steam Web API](http://steamcommunity.com/dev) for node

This documentation needs work. For now read the source code :/

A [Steam API Key]() is needed to use this module.

    var steam = require('node-steam').createClient('yourSteamAPIKey');
    //Returns a JSON object of Robin Walker's TF2 Backpack
    steam.getPlayerItems(console.log); 

All methods accept an optional object for parameters, and require a callback function.

    steam.getPlayerItems({
      format: 'json', // default - ['json', 'xml', 'vdf']
      gameid: '440', // default - see valve documentation for more gameids
      steamid: '64bitSteamId', //defaults to Robin Walker's steam id
      version: '0001' //default
    }, console.log);

### Supported methods

  **getPlayerItems**
  **getSchema**
  **getNewsForApp**
  **getGlobalAchievementPercentagesForApp**
  **getPlayerSummaries**

More documentation to come.
