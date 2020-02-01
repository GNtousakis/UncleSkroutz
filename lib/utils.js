const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const url = require('url');

const loading = ora({
    text: 'Scraping web page...',
    color: 'green'
});

const addToList = (site, item, price) => {
	let data;
    if (fs.existsSync( './pricelist.json' )) {

    	data = require('../pricelist.json');
		if (data.bookdepository[item] != undefined) {
			data.bookdepository[item].push(price, new Date());
		} else {
			data.bookdepository[item]= [price, new Date()];
		}

    } else {
    	data = {
    		bookdepository : {
    			[item] : [price, new Date()]
    		}
    	};

	}

    data = JSON.stringify(data, null, 2);
	fs.writeFile('./pricelist.json', data, (err) => {
    		if (err) throw err;
   			console.log(chalk.bold.blue('Data was saved!'));
	});
};

const getHost = (link) => {
    const urlInfo = url.parse(link, true);
    let host = urlInfo.host;
    host = host.split(".");

    return host[1];
}

module.exports = () =>{
  return {
    loading : loading,
    addToList: addToList,
    getHost: getHost,
  }
};