node-steam
====================

[Steam Web API](http://steamcommunity.com/dev) for node

This documentation needs work. For now read the source code :/

A [Steam API Key](http://steamcommunity.com/dev/apikey) is needed to use this module.

    var steam = require('node-steam').createClient('yourSteamAPIKey');
    
    //Returns a JSON object of Robin Walker's TF2 Backpack
    steam.getPlayerItems(console.log); 

All methods accept an optional object for parameters, and require a callback function.

    steam.getPlayerItems({
      format: 'json',               // default - ['json', 'xml', 'vdf']
      gameid: '440',                // default - see valve documentation for more gameids
      steamid: '76561197960435530', // default -  Robin Walker's steam id <3
      version: '0001'               // default
    }, console.log);                // function(err, result){}

### Specify Default Settings
You can change all of the default settings when initializing the module.
    var steam = require('node-steam').createClient({
      format: 'json',
      steamid: '76561197960435530',
      steamids: ['76561197960435530'],
      gameid: '440',
      appid: '440',
      count: '5',
      language: 'en',
      maxlength: '300',
      version: '0001'
    }, 'yourSteamAPIKey');

### Supported methods
*   getNewsForApp
*   getGlobalAchievementPercentagesForApp
*   getPlayerSummaries
*   getPlayerItems
*   getSchema

### Please Note
By default, all methods will use version 0001. Currently the Steam Web API (non-TF2) methods support version 0002. To use the newest version please specify within the parameter object.

    steam.getNewsForApp({
      appid: '440',
      version: '0002'
    }, console.log);

More documentation to come.
