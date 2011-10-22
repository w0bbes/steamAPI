(function(){
  var http = require('http');
  var utils = require('./lib/utils');

  var steam = {
    host: 'api.steampowered.com',

    defaults: {
      format: 'json',
      steamid: '76561197960435530',
      steamids: ['76561197960435530'], //In case method accepts multiple steamids
      gameid: '440',
      appid: '440',
      count: '5',
      language: 'en',
      maxlength: '300',
      version: '0001'
    },

    execute: function(path, callback) {
      http.get({host: this.host,
                port: 80,
                path: path
              }, function(res) {
        var result = '';
        res.setEncoding('binary');
        res.on('data', function(chunk) {
          result += chunk;
        });
        res.on('end', function() {
            callback(null, result);
        });
      });
    },

    prepare: function(params, callback) {
      var params = utils.merge(this.settings, params);
      this.execute('/' + params.interface + '/' + params.method + '/v' + params.version
                 + '/?key=' + this.apikey + '&format=' + params.format
                 + params.methodSpecific, function(err, result) {
        result = params.format === 'json' ? JSON.parse(result) : result;
        callback(err, result);
      });
    },

    getPlayerItems: function(params, callback) {
      if(arguments.length === 1) {
        callback = arguments[0];
        params = {};
      }
      this.prepare(utils.merge(params, {
        interface: 'IEconItems_' + (params.gameid || this.settings.gameid),
        method: 'GetPlayerItems',
        methodSpecific: '&steamid=' + (params.steamid || this.settings.steamid)
      }), callback);
    },

    getSchema: function(params, callback) {
      if(arguments.length === 1) {
        callback = arguments[0];
        params = {};
      }
      this.prepare(utils.merge(params, {
        interface: 'IEconItems_' + (params.gameid || this.settings.gameid),
        method: 'GetSchema',
        methodSpecific: '&language=' + (params.language || this.settings.language)
      }), callback);
    },

    getNewsForApp: function(params, callback) {
      if(arguments.length === 1) {
        callback = arguments[0];
        params = {};
      }
      this.prepare(utils.merge(params, {
        interface: 'ISteamNews',
        method: 'GetNewsForApp',
        methodSpecific: '&appid=' + (params.appid || this.settings.appid)
                      + '&count=' + (params.count || this.settings.count)
                      + '&maxlength=' + (params.maxlength || this.settings.maxlength)
      }), callback);
    },

    getGlobalAchievementPercentagesForApp: function(params, callback) {
      if(arguments.length === 1) {
        callback = arguments[0];
        params = {};
      }
      this.prepare(utils.merge(params, {
        interface: 'ISteamUserStats',
        method: 'GetGlobalAchievementPercentagesForApp',
        methodSpecific: '&gameid=' + (params.gameid || this.settings.gameid)
      }), callback);
    },
    getPlayerSummaries: function(params, callback) {
      if(arguments.length === 1) {
        callback = arguments[0];
        params = {};
      }
      this.prepare(utils.merge(params, {
        interface: 'ISteamUser',
        method: 'GetPlayerSummaries',
        methodSpecific: '&steamids=' + (params.steamids ? params.steamids.toString() : this.settings.steamids.toString())
      }), callback);
    }
    
  };

  exports.createClient = function(options, apikey) {
    if(arguments.length === 2) {
      steam.apikey = apikey;
      steam.settings = utils.merge(steam.defaults, options);
    } else {
      steam.apikey = arguments[0];
      steam.settings = steam.defaults;
    }
    return steam;
  };
})();
