var http = require('http')
	, redis = require('redis')
	, db = redis.createClient()
	, util = require('util')
	, async	=	require('async')
	, xml2js = require('xml2js');

//just to make sure
db.select('0', function(err, reply) {
	if(err)
		console.log(err);
});

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

//gameMe API
var query =  exports.query = function(queryString, callback) {
	var options = {
		host: 'api.gameme.com'
	, port: 80
	, path: '/'+queryString
	}

	var parser = new xml2js.Parser();

	http.get(options, function(res) {
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function(err) {
			parser.addListener('end', function(result) {
				callback(err, result);
			});
			parser.parseString(data);
		});
	});
}

var getSteam64 = exports.getSteam64 = function(steam_0, callback) {
	match = steam_0.match(/STEAM_0:(\d):(\d+)/);
	//return as string - 64 bit value too large for js Number type
	if(match)
		callback(null, '7656' + ((parseInt(match[2], 10) * 2) + 1197960265728 + parseInt(match[1], 10)));
	else
		callback('Match error: '+steam_0, steam_0)
}

var updateSet = exports.updateSet = function(steamId, force, cb) {
	async.waterfall([function(callback) {
			if(force){
				db.del('backpack:'+steamId+':set', function(err, reply) {callback(err, false)});
			}else{
				db.exists('backpack:'+steamId+':set', callback);
			}
		},function(cached, callback) {
			cached ? callback(null, false) : db.hgetall('backpack:'+steamId, callback);
		}], function(err, result) {
			if(!err && result) {
				async.forEach(Object.keys(result), function(i, callback) {
					db.sadd('backpack:'+steamId+':set', i, callback); 
				}, cb);
			}else{
				cb(err, result);
			}
	});
}

var updateBackpack = exports.updateBackpack = function(steamId, force, cb) {
	async.waterfall([function(callback) {
		if(force){
			db.del('backpack:'+steamId, function(err, reply) {callback(err, false)});
		}else{
			db.exists('backpack:'+steamId, callback);
		}
	}, function(cached, callback) {
		cached ? callback(null, false) : steamAPI.getPlayerItems(steamId, callback);
	}],	function(err, result) {
		if(!err && result.result) {
			var items = result.result.items;
			async.forEach(Object.keys(items), function(i, callback) {
				if(items[i].defindex == 5022 || items[i].defindex == 5041){
					if(items[i].attributes[0].float_value < 2){
						db.hincrby('backpack:'+steamId, 'crates', 1);
					}
				}
				db.hincrby('backpack:'+steamId, items[i].defindex, 1, callback);
			}, function(err) {
				db.expire('backpack:'+steamId, (20*60), cb);
			});
		}else{
			cb(err, result);
		}
	});
}

var updateTradable = exports.updateTradable = function(steamId, cb) {
	async.series([function(callback) {
		db.del('backpack:'+steamId+':tradable', callback);
	}, function(callback) {
		db.sinterstore('backpack:'+steamId+':tradable', 'schema:items:type:weapons', 'backpack:'+steamId+':set', callback);
	}], cb);
}

var sinter = exports.sinter = function(key, steamId, cb) {
	db.sinter(key, 'backpack:'+steamId+':set', cb)
}

var sdiff = exports.sdiff = function(key, steamId, cb) {
	db.sdiff(key, 'backpack:'+steamId+':set', cb)
}

var hget = exports.hget = function(key, hash, cb) {
	db.hget(key, hash, cb);
}

var getImages = exports.getImages = function(list, cb) {
	async.map(list, function(i, callback) {
		db.hget('schema:item:'+i, 'image_url', callback);
	},cb);
}

//One time store to database
var updateSchema = exports.updateSchema = function(cb) {
	steamAPI.getSchema(function(err, result) {
		async.parallel([function(callback) {
			async.forEach(Object.keys(result.result.items), function(i, callback){
				var item = result.result.items[i];
				delete item.capabilites;
				delete item.atrributes;
				delete item.used_by_classes
				delete item.styles;
				delete item.tool

				async.parallel([function (callback) {
					db.hmset('schema:item:'+item.defindex, item, callback);
				}, function(callback) {
					db.sadd('schema:items:slot:'+item.item_slot, item.defindex, function() {
						if(item.item_slot == 'primary' || item.item_slot == 'secondary' || item.item_slot == 'melee' || item.item_slot == 'pda2')
							db.sadd('schema:items:type:weapons', item.defindex, callback);
						else
							callback();
					});
				}, function(callback) {
					db.sadd('schema:items:quality:'+item.item_quality, item.defindex, callback);
				}], callback);
			}, callback);

		}, function(callback) {
			async.forEach(Object.keys(result.result.qualities), function(i, callback){
				var quality = result.result.qualities[i];
				db.set('schema:quality:'+i, quality, callback);		
			}, callback);
		}, function(callback) {
			async.forEach(Object.keys(result.result.attributes), function(i, callback){
				var attribute = result.result.attributes[i];
				db.hmset('schema:attribute:'+attribute.defindex, attribute, callback);		
			}, callback);
		}], cb);
	});
}
