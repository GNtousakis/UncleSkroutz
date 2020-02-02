const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const url = require('url');

const loading = ora({
    text: 'Scraping web page...',
    color: 'green'
});

const addToList = (site, item, price, link) => {
	let data, linkList;
    if (fs.existsSync( './data/pricelist.json' )) {

    	data = require('../data/pricelist.json');
        linkList = require('../data/linklist.json');

        // If the item exists just push the updated price
		if (data.bookdepository[item] != undefined) {
			data[site][item].unshift(price, new Date());
        // If not, add it to the table and update the linkList    
		} else {
			data[site][item] = [price, new Date()];
            linkList[site][link] = [item];
		}

    } else {
    	data = {
    		[site] : {
    			[item] : [price, new Date()]
    		}
    	};

        linkList = {
            [site] : {
                [link] : [item]
            }
        }

	}

    data = JSON.stringify(data, null, 2);
    linkList = JSON.stringify(linkList, null, 2);

	fs.writeFile('./data/pricelist.json', data, (err) => {
    		if (err) throw err;
	});

    fs.writeFile('./data/linklist.json', linkList, (err) => {
            if (err) throw err;
    });
};

const getHost = (link) => {
    const urlInfo = url.parse(link, true);
    let host = urlInfo.host;
    host = host.split(".");

    return host[1];
}

const showPrices = () => {
    if (fs.existsSync( './data/pricelist.json' )) { 
        data = require('../data/pricelist.json');
        for (var site in data) {
            console.log(chalk.yellow.italic.underline(site),':');
            const currSite = data[site];
            for (var products in currSite){
                console.log(chalk.blue.bold(products),':',
                    chalk.red(currSite[products][0]));
            }
        }
    }
}

const getLatestPrices = (crawler) => {
    if (fs.existsSync( './data/linklist.json' )) { 
        data = require('../data/linklist.json');
        for (var site in data) {
            const currSite = data[site];
            const crawler = require("./crawlers/" + site + ".js")();
            for (var link in currSite){
                crawler.scrapPage(link);
            }
        }
    }
}

const getPriceHistory = (name) => {
    if (fs.existsSync('./data/pricelist.json')) {
        data = require('../data/pricelist.json');
        for (var site in data) {
            const currSite = data[site];
            for (var product in currSite) {
                if (product.includes(name)) {
                    const price = currSite[product];
                    console.log(chalk.blue.bold(product), price);
                }
            }
        }

    }
}

module.exports = () =>{
  return {
    loading : loading,
    addToList: addToList,
    getHost: getHost,
    showPrices: showPrices,
    getLatestPrices: getLatestPrices,
    getPriceHistory: getPriceHistory,
  }
};