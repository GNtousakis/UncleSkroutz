const argv = require('yargs').argv;
const url = require('url');
const chalk = require('chalk');
const utils = require('./lib/utils.js')();

if (argv.page === undefined) {
   	console.log(chalk.bold.red("You didnt gave a link"));
} else {
    const site = utils.getHost(argv.page);
    const crawler = require("./lib/crawlers/" + site + ".js")();
   	crawler.scrapPage(argv.page);
};

