steamAPI
====================

[Steam Web API](http://steamcommunity.com/dev) for node.js

A [Steam API Key](http://steamcommunity.com/dev/apikey) is needed to use this module.

### Steam Documentation
*    [Steam Web API Methods](http://developer.valvesoftware.com/wiki/Steam_Web_API)
*    [TF2/Portal2 Methods](http://wiki.teamfortress.com/wiki/WebAPI)
*    [Application IDs](http://developer.valvesoftware.com/wiki/Steam_Application_IDs)

To install:

    npm install steamAPI

To use:

    var steam = require('steamAPI').configure('yourSteamAPIKey');
    
    //Returns a JSON object of Robin Walker's TF2 Backpack
    steam.getPlayerItems(console.log); 


Specify Settings
--------------------
Optionally, you can change all of the default settings by passing an object map to configure();

    var steam = require('steamAPI').configure({
      format: 'xml',
      gameid: '440',
      version: '0002'
    }, 'yourSteamAPIKey');

### Available Settings
These are the default settings.

    {
      format: 'json',                   // json returns a JSON object all other formats return a string of raw data
      version: '0001'                   // For Steam API methods the newest version is 0002
      steamid: '76561197960435530',     // Robin Walker
      steamids: ['76561197960435530'],  // getPlayerSummaries() uses an Array of steamids
      gameid: '440',                    // See steam documentation for gameids 
      appid: '440',                     // See steam documentation for appids 
      count: '5',                       // Number of news entries returned
      maxlength: '300',                 // Maximum length of each news entry
      language: 'en',                   // See steam documentation for available languages
    }

Supported methods
-----------------------
*   getNewsForApp
*   getGlobalAchievementPercentagesForApp
*   getPlayerSummaries
*   getPlayerItems
*   getSchema

### Examples

    //Returns a JSON object for Left 4 Dead 2
    steam.getNewsForApp({
      appid: 550,
      count: 10,
      maxlength: 300
    }, console.log);

    //Returns a raw XML string of the default appid (440) which is TF2 using method version 0002
    steam.getGlobalAchievementPercentagesForApp({
      format: 'xml',
      version: '0002'
    }, console.log);

    //This method uses an array of 64bit Steamids in the query.
    //The Steam Web API limits the request to 100 steamids.
    steam.getPlayerSummaries({
      steamids: ['76561197960435530']
    }, console.log);

    //Returns my TF2 backpack as a JSON object
    steam.getPlayerItems({
      steamid: '76561198010315856'
    }, console.log);

    //Returns the entire TF2 Item Schema as a JSON object
    steam.getSchema(console.log);

### Please Note
By default, all methods will use version 0001. Currently the Steam Web API (non-TF2) methods support version 0002. To use the newest version please specify within the parameter object.

    steam.getNewsForApp({
      appid: '440',
      version: '0002'
    }, console.log);
