module.exports = {

	// feel free to use any standards compliant Promise library you like
	// `true` in build, check and clean is treated as `Promise.resolve()`

	// recomended Promise library: npm i -S lie

	build: function (type, category, host) {
		return true; // replace with Promise
	},

	check: function (type, category, host) {
		return true; // replace with Promise
	},

	clean: function (cwd) {
		return true; // replace with Promise
	},

	confdryrun: function (conf, rsync, ssh, host) {
		// extra settings
	},

	confdeploy: function (conf, rsync, ssh, host) {
		// extra settings
	},

	confdiff: function (conf, rsync, ssh, host) {
		// extra settings
	}

};
