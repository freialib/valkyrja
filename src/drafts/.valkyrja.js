module.exports = {

	// feel free to use any standards compliant Promise library you like
	// `true` in build, check and clean is treated as `Promise.resolve()`

	// recomended Promise library: npm i -S lie

	export: function (cwd, args, conf, valk) {
		return valk.build().then(function () {
			return valk.rsyncTo(cwd + '/deploy/build');
		}).then(function () {
			// specifics for creating container
			// we recomend Docker workflow
		});
	},

	send: function (cwd, args, conf) {
		// specifics for sending container to server
	},

	build: function (cwd, args, conf, type, category, host) {
		return true; // replace with Promise
	},

	check: function (cwd, args, conf, type, category, host) {
		return true; // replace with Promise
	},

	clean: function (cwd, args, conf) {
		return true; // replace with Promise
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
