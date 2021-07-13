import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
	mode: 'production',
	entry: './src/index.ts',   // <------- the entry file

	// output bundle
	output: {
    	    path: path.resolve(__dirname, 'dist'),      // <------- bundles location
    	    filename: 'main.bundle.js'     // <------------- setup bundle  file
	},

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
          })
    ],

	// file resolutions
	resolve: {
    	    extensions: [ '.ts', '.js' ],
    },

	// loaders
	module: {
    	    rules: [
        	        {
            	            test: /\.tsx?/,
            	            use: 'ts-loader',
            	            exclude: /node_modules/,
        	       }
    	    ]
	}
};

export default config;
