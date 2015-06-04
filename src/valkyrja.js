var _ = { clone: require('lodash.clone') };
var c = require('chalk');
// ----------------------------------------------------------------------------

var cwd = process.cwd();
var draftdir = __dirname + '/drafts';

var args = _.clone(process.argv);
args.shift(); // remove node
args.shift(); // remove executable file

var cmd = args.shift();

if ( ! cmd) {
	cmd = 'help';
}

if (['make', 'clean', 'help', 'deploy', 'ls', 'diff', 'dry-run'].indexOf(cmd) == -1) {
	console.log('Err: unrecognized command "' + cmd + '"');
	console.log(c.red('valkyrja') + ': never heard of the command ' + c.magenta(cmd));
	process.exit(500);
}

var main = require('cmds/' + cmd);
main(cwd, args, draftdir);
