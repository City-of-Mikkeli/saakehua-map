/*
 * Database configuration
 */

var HOST = 'localhost';
var DB = 'saakehua';

exports.getConnectionUrl = function(){
	return 'mongodb://'+HOST+'/'+DB;
};