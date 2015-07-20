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

if (['--help', '-help', '-h', '/?'].indexOf(cmd) != -1) {
	cmd = 'help';
}

if (['-v', '-version', '--version'].indexOf(cmd) != -1) {
	cmd = 'version';
}

if (cmd == 'version') {
	var pkg = require(__dirname + '/../package.json');
	console.log(pkg.version);
	process.exit(0);
}

if (['export', 'send', 'make', 'clean', 'help', 'deploy', 'ls', 'diff', 'dry-run', 'check', 'build', 'diff-file'].indexOf(cmd) == -1) {
	console.log(c.red('valkyrja') + ': never heard of the command ' + c.magenta(cmd));
	console.log('Need help? type ' + c.dim('valk help'));
	process.exit(500);
}

var main = require('cmds/' + cmd);
main(cwd, args, draftdir);
