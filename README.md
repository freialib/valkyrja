Vakyrja is a very light deployment helper that uses `rsync`, `ssh` and a few
other basic tools.

Install via,

	npm i valkyrja -g

You will have access to the `valk` command.

If you ever need a specific copy of `valkyrja` for a project simply install
that version into the project:

	npm i -S valkyrja

After doing so, whenever you run any `valk` commands they will be executed by
the specific version of `valkyrja` you have installed in the project instead of
the global `valkyrja`

## Command Help

You can setup project via `valk make`. For a full setup run `valk make all`.

You can also setup any specific files at any time via `valk make user` and
`valk make tools`

Type `valk` for **command and usage help**

Here is a potentially incomplete list of available commands, more details
on the command help.

	make       - create required files
	deploy     - deploy local copy
	dry-run    - simulate deploy
	diff       - diff servers with local copy
	diff-file  - diff file with local copy
	ls         - list servers
	clean      - remove junk
	check      - run tools.check
	build      - run tools.build
	version    - print version
	help       - help page

## Files

The `valk` command understands the following files,

 - `.valkyrja.toml`, main configuration file and only mandatory file. Specify
   servers, deploy actions, files to sync, files to ignore, etc in here; you
   can also pass any `rsync` options you like

 - `.valkyrja.user.toml`, main user file. You can create a default one via
   `valk make user`. The contents of this file will be merged into
   `.valkyrja.toml` before any command is executed.

 - `.valkyrja.js` is an optional tools file. `valk` will call the
   corresponding function exported by the file and expect a `Promise`. Based 
   on the `Promise` the deploy process will continue or halt. The expectation 
   is that you perform any production build steps or any checks and resolve or 
   reject the promise based on the result of your tooling; deployment will 
   continue only if promise is fulfilled.

## Testing Deployment Strategy

You don't need a server. 

Just point `valkyrja` to `localhost` and the path somewhere in your home 
directory. For running commands you will also need to install a `ssh` server. 

For ubuntu you can install a `ssh` server very easily like so,

	sudo apt-get install openssh-server

It's annoying but even though you're `ssh`'ing to your machine and the user
you're already logged in as the ssh server will still request you to 
authenticate, to avoid this you can just add add your local ssh keys to your
local ssh keys... err, it makes sense trust me.

First check you have ssh keys generated,

	ls -la ~/.ssh

If you don't see `id_rsa` or `id_rsa.pub` run `ssh-keygen` to create them.

Now you just need to copy your key to the server, in our case your local 
machine, this works exactly like it would for any non-`localhost` server,

	ssh-copy-id `whoami`@localhost

You'll be asked for your local password. You can test it worked using:

	ssh `whoami`@localhost 'ls -la'

You should see it list your home directory; if you didn't do the `ssh-copy-id`
it would ask you for the password to do that.

## Useful .valkyrja.js

The generated `.valkyrja.js` is designed to only provide placeholders and not 
blow up in your face when you try to do anything. Here is an example of one
that is actually useful:

	var Promise = require('lie');
	var cmdspawn = require('cmdspawn');
	var _ = require('shadow.lodash');
	
	var cmd = cmdspawn({
		tracking : false, // show start and end of command
		verbose  : false  // write executed commands to console
	});
	
	var excludeNPMDevDeps = function (rsync) {
		var pkg = require('./package.json');
		_.each(pkg.devDependencies, function (version, name) {
			rsync.exclude('node_modules/' + name);
		});
	}
	
	module.exports = {
		
		build: function (type, category, host) {
			var p = Promise.resolve();
			p = p.then(cmd.f('gulp build --color'), cmd.silent);
			return p;
		},
		
		check: function (type, category, host) {
			var p = Promise.resolve();
			
			if (type == 'all' || type == 'php') {
				p = p.then(cmd.f([
						'phpunit',
						'-c src/server/api/phpunit.xml',
						'--coverage-text',
						'--color'
					].join(' ')), cmd.silent);
			}
			
			if (type == 'all' || type == 'js') {
				p = p.then(cmd.f([
						'mocha',
						'--color',
						'--recursive',
						'src/client/node_modules/.spec'
					].join(' ')), cmd.silent);
			}
			
			return p;
		},
		
		confdryrun: function (conf, rsync, ssh, host) {
			excludeNPMDevDeps(rsync);
		},
		
		confdeploy: function (conf, rsync, ssh, host) {
			excludeNPMDevDeps(rsync);
		},
		
		confdiff: function (conf, rsync, ssh, host) {
			excludeNPMDevDeps(rsync);
		}
		
	};

## Gotchas

### User must belong to group he is trying to change

If the user trying to sync does not belong to the group he is trying to sync to,
the sync command will fail when `chgrp` is executed due to the command in 
question returning non `0` exit code.

To add a user to the group the following must be executed on the server,

	sudo usermod -a -G GROUPNAME YOURUSERNAME

**Important Note!** make sure to have `-a` (ie. append) flag there or you will 
remove the user from every other group. If you do that to yourself on your local 
machine where you are in the `sudo`'er group you will remove yourself from the 
`sudo`'er group preventing you from executing commands with `sudo`

If you wish to run your own custom `chgrp` command you can disable the in-built
one by setting `autogroup = false` on the root of the configuration file.

You can access the host group via the `<<group>>` variable when adding 
`postdeploy` commands. eg. `chgrp -R -P <<group>> .`

If you need extra variables to achieve the command you can add them to servers,
then they will be available just like how `group` is available as `<<group>>`. 
But make sure they are strings and can never be anything but strings. If you 
add a non-string parameter to the server, it will not be available.

### Ignore exit status of some commands

You may find some commands just annoyingly return non `0` for certain cases.
Cases you don't really consider error cases. eg. `grep` returns non-`0` if it
can't match anything. If you have `ssh.stop-on-errors` this can be even more
annoying then just a little bit of red text every deploy. 

To ignore the exit code of a commands simply pass their output though another 
command. eg. if you want to ignore the exit status of a `grep` commands then 
you would write the command as `grep ... | cat`

## Q&A

Q. What options does valkyrja pass to rsync by default?  
A. Except dry-run flags, none. Only options in `.valkryja.toml` are passed.

Q. What options does valkyrja pass to ssh by default?  
A. If `ssh` key is missing, timeout will be set to 10 minutes.

Q. What's a TOML file?  
A. [JSON with comments, for humans](https://github.com/toml-lang/toml).

Q. What's "valkyrja" a reference to?  
A. Old Norse for "chooser of the slain", aka. "valkyrie"
