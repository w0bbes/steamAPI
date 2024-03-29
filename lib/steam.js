(function(){
  var http = require('http');
  var utils = require('./utils');

  var Steam = function (options, apikey) {


    this.host = 'api.steampowered.com';

    this.defaults = {
      format: 'json',
      steamid: '76561197960435530',
      steamids: ['76561197960435530'], //In case method accepts multiple steamids
      gameid: '440',
      appid: '440',
      count: '5',
      language: 'en',
      maxlength: '300',
      version: '0001'
    }
  };

 Steam.prototype.execute = function(path, callback) {
    http.get({host: this.host,
              port: 80,
              path: path
            }, function(res) {
      if(res.statusCode !== 200) {
        return callback(res.statusCode);
      } else {
        var result = '';
        res.setEncoding('binary');
        res.on('data', function(chunk) {
          result += chunk;
        });
        res.on('end', function() {
          callback(null, result);
        });
      }
    });
  };

  Steam.prototype.prepare = function(params, callback) {
    var params = utils.merge(this.settings, params);
    this.execute('/' + params.interface + '/' + params.method + '/v' + params.version
               + '/?key=' + this.apikey + '&format=' + params.format
               + params.methodSpecific, function(err, result) {
      if(!err)
        result = params.format === 'json' ? JSON.parse(result) : result;
      callback(err, result);
    });
  };

  Steam.prototype.getPlayerItems = function(params, callback) {
    if(arguments.length === 1) {
      callback = arguments[0];
      params = {};
    }
    this.prepare(utils.merge(params, {
      interface: 'IEconItems_' + (params.gameid || this.settings.gameid),
      method: 'GetPlayerItems',
      methodSpecific: '&steamid=' + (params.steamid || this.settings.steamid)
    }), callback);
  };

  Steam.prototype.getSchema = function(params, callback) {
    if(arguments.length === 1) {
      callback = arguments[0];
      params = {};
    }
    this.prepare(utils.merge(params, {
      interface: 'IEconItems_' + (params.gameid || this.settings.gameid),
      method: 'GetSchema',
      methodSpecific: '&language=' + (params.language || this.settings.language)
    }), callback);
  };

  Steam.prototype.getNewsForApp = function(params, callback) {
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
  };

  Steam.prototype.getGlobalAchievementPercentagesForApp = function(params, callback) {
    if(arguments.length === 1) {
      callback = arguments[0];
      params = {};
    }
    this.prepare(utils.merge(params, {
      interface: 'ISteamUserStats',
      method: 'GetGlobalAchievementPercentagesForApp',
      methodSpecific: '&gameid=' + (params.gameid || this.settings.gameid)
    }), callback);
  };

  Steam.prototype.getPlayerSummaries = function(params, callback) {
    if(arguments.length === 1) {
      callback = arguments[0];
      params = {};
    }
    this.prepare(utils.merge(params, {
      interface: 'ISteamUser',
      method: 'GetPlayerSummaries',
      methodSpecific: '&steamids=' + (params.steamids ? params.steamids.toString() : this.settings.steamids.toString())
    }), callback);
  };

  exports.configure = function(options, apikey) {
    var steam = new Steam();
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
