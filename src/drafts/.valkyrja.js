module.exports = {

	// feel free to use any standards compliant Promise library you like
	// `true` in build, check and clean is treated as `Promise.resolve()`

	// recomended Promise library: npm i -S lie
	// recomended CLI prompt library: npm i -D inquirer
	// recomended CLI coloring library: npm i -D chalk

	// you can have custom commands, and your custom commands can have help
	// Help is optional. Its probably best to write it in a README file so we
	// don't enforce you to have an entry here for your custom commands, nor
	// provide any means of defining sophisticated help
	customCmds: {
		test: 'test build on localhost',
	},

	// This is a custom command! you can add as many as you want with any name
	// you want; so long as they don't conflict with valk regular commands
	// Use custom commands to implement specialized deployment features you
	// need; you can also add more entries to your .toml file and .user.toml
	test: function (cwd, args, conf, valk) {
		console.log('test command placeholder');
		return false; // replace with Promise
	},

	// the following are hooks for regular valk commands

	build: function (cwd, args, conf, type, category, host) {
		return true; // replace with Promise
	},

	check: function (cwd, args, conf, type, category, host) {
		return true; // replace with Promise
	},

	clean: function (cwd, args, conf) {
		return true; // replace with Promise
	},

	confexport: function (cwd, args, conf, rsync) {
		// extra settings
	},

	confdryrun: function (cwd, args, conf, rsync, ssh, host) {
		// extra settings
	},

	confdeploy: function (cwd, args, conf, rsync, ssh, host) {
		// extra settings
	},

	confdiff: function (cwd, args, conf, rsync, ssh, host) {
		// extra settings
	}

};
