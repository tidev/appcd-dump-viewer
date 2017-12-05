'use strict';

process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const config = require('../config');
const ora = require('ora');
const path = require('path');
const rm = require('rimraf');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf');

const spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
	if (err) {
		throw err;
	}

	webpack(webpackConfig, function (err, stats) {
		spinner.stop();
		if (err) {
			throw err;
		}

		console.log(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n');

		if (stats.hasErrors()) {
			console.log(chalk.red('  Build failed with errors.\n'));
			process.exit(1);
		}

		console.log(chalk.cyan('  Build complete.\n'));
	});
});
