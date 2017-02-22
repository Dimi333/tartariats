const path = require('path'); 						//asi cesta, kde je
var helpers = require('./helpers');

const config = {
	entry: './index',	 							//vstupny bod
	resolve: {
    	extensions: ['.ts', '.js']
  	},
	output: {										//vystup
		path: path.resolve(__dirname, 'dist'),		//zlozka
		filename: 'balik.js' 						//a subor
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
        		loaders: [
					{
						loader: 'awesome-typescript-loader',
						options: { configFileName: helpers.root('src', 'tsconfig.json') }
					}
				]
			}
		]
	}
}

module.exports = config;