var http = require('http')
	, util = require('util')

var mySteamId = '76561198010315856';

var steamAPI = {
	host: 'api.steampowered.com'
, apiKey: '3163C611966C3C1193A17618A938A27A'
, cmd: ['/IEconItems_440/GetPlayerItems/v0001/', '/IEconItems_440/GetSchema/v0001/']
, executeCmd: function(command, param, callback) {
		http.get({host: this.host, port: 80, path: command+'?key='+param.apiKey+(param.steamId ? '&SteamId='+param.steamId : '') + '&format=json'},
			function(res) {
				var jsonString = '';
				res.setEncoding('binary');
				res.on('data', function(chunk) {
					jsonString += chunk;
				});
				res.on('end', function() {
					var jsonObj = JSON.parse(jsonString);
					if(jsonObj.result.status == 1)
						callback(null, jsonObj)
					else
						callback(jsonObj.result.status, jsonObj);
				});
		});
}
,	getPlayerItems: function(steamId, callback) {
		this.executeCmd(this.cmd[0], {steamId: steamId, apiKey: this.apiKey}, callback);
	}
,	getSchema: function(callback) {
		this.executeCmd(this.cmd[1], {apiKey: this.apiKey}, callback);
	}
};


