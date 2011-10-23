steamAPI
====================

[Steam Web API](http://steamcommunity.com/dev) for node

A [Steam API Key](http://steamcommunity.com/dev/apikey) is needed to use this module.

Please see the [Steam Web API]() and [TF2/Portal2]() wikis for documentation.

To install:

    npm install steamAPI

To use:

    var steam = require('steamAPI').configure('yourSteamAPIKey');
    
    //Returns a JSON object of Robin Walker's TF2 Backpack
    steam.getPlayerItems(console.log); 


Specify Settings
--------------------
Optionally, you can change all of the default settings by passing an object map.

    var steam = require('steamAPI').configure({
      format: 'xml',
      gameid: '440',
      version: '0002'
    }, 'yourSteamAPIKey');

### Available Settings
These are the default settings.

    {
      format: 'json',                   // json returns a JSON object all other formats return a string of raw data
      steamid: '76561197960435530',     // Robin Walker
      steamids: ['76561197960435530'],  // getPlayerSummaries() uses an Array of steamids
      gameid: '440',                    // See steam documentation for gameids 
      appid: '440',                     // See steam documentation for appids 
      count: '5',                       // Number of entries for getPLayerSummaries
      language: 'en',                   // See steam documentation for available languages
      maxlength: '300',                 // Maxlength of something or other
      version: '0001'                   // For Steam API methods the newest version is 0002
    }

Supported methods
-----------------------
*   getNewsForApp
*   getGlobalAchievementPercentagesForApp
*   getPlayerSummaries
*   getPlayerItems
*   getSchema

### getPlayerSummaries
This method uses an array of 64bit Steamids in the query. The Steam Web API limits the request to 100 steamids.

    steam.getPlayerSummaries({
      steamids: ['76561197960435530']
    }, console.log);

### Please Note
By default, all methods will use version 0001. Currently the Steam Web API (non-TF2) methods support version 0002. To use the newest version please specify within the parameter object.

    steam.getNewsForApp({
      appid: '440',
      version: '0002'
    }, console.log);
