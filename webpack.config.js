const path = require('path'); 						//asi cesta, kde je
var helpers = require('./app/helpers');

const config = {
	entry: './index',	 							//vstupny bod
	resolve: {
    	extensions: ['.ts', '.js'],
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
						options: {
							configFileName: helpers.root('src', './app/tsconfig.json')
						}
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{ 
						loader: 'css-loader', options: { importLoaders: 1 } 
					},
					'less-loader'
				]
			}
		]
	}
}

module.exports = config;