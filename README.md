Vakyrja is a very light deployment helper that uses `rsync`, `ssh` and a few
other basic tools.

Install via,

	npm i valkyrja -g

You will have access to the `valk` command.

If you ever need a specific copy of `valkyrja` for a project simply install
that version into the project in question:

	npm i -S valkyrja

After doing so whenever you run any `valk` commands they will be executed by
the specific version of `valkyrja` you have installed in the project instead of
the global `valkyrja`

## Command Help

You can setup project via `valk make`. For a full setup run `valk make all`.

You can also setup any specific files at any time via `valk make user` and
`valk make tools`

Type `valk` for **command and usage help**

## Files

The valkyrja command understands the following files,

 - `.valkyrja.toml`, main configuration file and only mandatory file. Specify
   servers, deploy actions, files to sync, files to ignore, etc in here; you
   can also pass any `rsync` options you like

 - `.valkyrja.user.toml`, main user file. You can create a default one via
   `valk make user`. The contents of this file will be merged into
   `.valkyrja.user.toml` before any command is executed. If `.gitignore` is
   present an entry to it will also be automatically added when runnning
   `valk make user` if its not present already

 - `.valkyrja.js` is your main tools file. Not required unless specific options
   such as `check` or `build` are set to non-`false` on any server.
   `valkyrja` will call the corresponding function exported by the file and
   expect a `Promise`, based on the promise the deploy process will continue
   or halt. The expectation is that you perform any production build steps or
   any checks and resolve or reject the promise based on the result of your
   tools; deployment will continue only if promise is fulfilled.

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

## Gotchas

### User must belong to group he is trying to change

If the user trying to sync does not belong to the group he is trying to sync to
the sync command will fail when chgrp is executed due to the command in 
question returning non 0 exit code.

To add a user to the group the following must be executed on the server,

	sudo usermod -a -G GROUPNAME YOURUSERNAME

**Important:** make sure to have -a (ie. append) flag there or you will remove
the user from every other group; if you do that on your local machine where you
are in the `sudo`'er group for example ommiting it will remove you from the 
`sudo`'er group preventing you from executing commands with `sudo`

If you wish to run your own custom `chgrp` command you can disable the in-built
one by setting `autogroup = false` on the root of the configuration file.

You can access the host group via the `<<group>>` variable when adding 
postdeploy commands. So, for example, `chgrp -R -P <<group>> .` would add
the current command.

If you need extra variables to achieve the command you can add them to servers,
they will be available just like how `group` is available as `<<group>>`. But
make sure they are strings and can never be anything but strings. If you add a
non-string parameter to the server, it will not be available.

### Ignore exit status of some commands

You may find some commands just annoyingly return non `0` for certain cases.
Cases you don't really consider error cases. eg. `grep` returns non-zero if it
can't match anything. If you have `ssh.stop-on-errors` this can be even more
annoying then just a little bit of red text every deploy. 

To ignore the exit code of a commands simply pass their output though another 
command. eg. if we want to ignore the exit status of a `grep` commands then 
we would write the command as `grep "something" | cat`

## Q&A

Q. What options does valkyrja pass to rsync by default?  
A. Except dry-run flags, none. Only options in `.valkryja.toml` are passed.

Q. What options does valkyrja pass to ssh by default?  
A. If `ssh` key is missing, timeout will be set to 10 minutes.

Q. What's a TOML file?  
A. [JSON with comments, for humans](https://github.com/toml-lang/toml).

Q. What's "valkyrja" a reference to?  
A. Old Norse for "chooser of the slain", aka. "valkyrie"
