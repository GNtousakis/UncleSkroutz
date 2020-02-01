#!/usr/bin/env node
const argv = require('yargs')
	.options({
    'add': {
      alias: 'a',
      describe: 'add product',
    },
    'show': {
      alias: 's',
      describe: 'show prices from list',
    },
    'run': {
      alias: 'r',
      describe: 'run price tracker for latest prices'
    }
  	})
	.argv;

const url = require('url');
const chalk = require('chalk');
const utils = require('./lib/utils.js')();

if (argv.add != undefined && argv.add != true) {
    const site = utils.getHost(argv.add);
    const crawler = require("./lib/crawlers/" + site + ".js")();
   	crawler.scrapPage(argv.add);
};

if (argv.show != undefined) {
	utils.showPrices();
}

if (argv.run != undefined) {
	utils.getLatestPrices();
}

