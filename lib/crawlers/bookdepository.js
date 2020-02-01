const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const utils = require('../utils.js')();

const scrapPage = (page) => {
    utils.loading.start();
   	request(page, function(error, response, body) {
    	if(error) {
        	utils.loading.fail();
          console.log("Error: " + error);
    	}
     	if(response.statusCode === 200) {
       		utils.loading.succeed();
       
       		// Parse the document body
       		var $ = cheerio.load(body);
       		var name = $("h1").text();
       		var price = $('.sale-price').text();	

 	      	console.log(chalk.bold.blue("Page title: ") + name);
    	   	console.log(chalk.bold.blue("Price: ") + price);
    	   	utils.addToList(utils.getHost(page), name, price); 
    	}
   	});
};

module.exports = () =>{
  console.log(chalk.blueBright("You are scraping from bookdepository"));
  return {
    scrapPage: scrapPage,
  }
};