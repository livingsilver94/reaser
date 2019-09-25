module.exports = (config) => {
	config.set({
		singleRun: true,
		browsers: ["Firefox"],
		frameworks: ["mocha"],
		reporters: ["mocha", "coverage"],
		converageReporters: {
			dir: "build/coverage",
			reporters: [
				{
					type: "lcov",
					subdir: "lcov"
				},
				{
					type: "html",
					subdir(browser) {
						// normalization process to keep a consistent browser name
						// across different OS
						return browser.toLowerCase().split(/[ /-]/)[0]
					}
				},
				{
					type: "text-summary"
				}
			]
		},
		files: [
			"node_modules/sinon/pkg/sinon.js",
			"node_modules/sinon-chrome/bundle/sinon-chrome.min.js",
			"reaser/*.js",
			"test/unit/*.test.js"
		],
		preprocessors: { "reaser/*.js": ["coverage"] },
		plugins: [
			"karma-coverage",
			"karma-firefox-launcher",
			"karma-mocha",
			"karma-mocha-reporter"
		]
	})
}
