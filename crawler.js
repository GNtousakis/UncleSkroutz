const request = require('request');
const cheerio = require('cheerio');
const argv = require('yargs').argv;
const ora = require('ora');
const url = require('url');
const chalk = require('chalk');
const fs = require('fs');


const loading = ora({
 	text: 'Scraping web page...',
    color: 'green'
});

const addToList = (site, item, price) => {
    if (fs.existsSync( './pricelist.json' )) {
    	let data = require('./pricelist.json');
		console.log(data.siteList);
    } else {
    	let dataToSave = {
		siteList: {
			siteName : site, 
		      	itemList: {
				name : item,
				priceList : {
						price : price,
						date : new Date(),
					},
				}
			}
		};
     	let dataJSON = JSON.stringify(dataToSave, null, 2);
		fs.writeFile('pricelist.json', dataJSON, (err) => {
    		if (err) throw err;
   			console.log('Data written to file');
		});
    }
}

const scrapPage = (page) => {
   	request(page, function(error, response, body) {
    	if(error) {
        	loading.fail();
			console.log("Error: " + error);
    	}
     	if(response.statusCode === 200) {
       		loading.succeed();
       
       		// Parse the document body
       		var $ = cheerio.load(body);
       		var name = $("h1").text();
       		var price = $('.sale-price').text();	
       		var urlInfo = url.parse(page, true);

 	      	console.log(chalk.blue("Page title: ") + name);
    	   	console.log(chalk.blue("Price: ") + price);
    	   	addToList(urlInfo.host, name, price); 
    	}
   	});
};

if (argv.page === undefined) {
   	console.log("You didnt gave a link");
} else {
   	loading.start();
   	scrapPage(argv.page);
};



