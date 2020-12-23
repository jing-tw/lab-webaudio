import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

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
          }),

		  new CopyPlugin({
			patterns: [
			  { from: path.resolve(__dirname, 'src') + path.sep + 'white-noise-processor.js', to: path.resolve(__dirname, 'dist')},
			],
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
	},

	// for webpack-dev-server
	devtool: "source-map",  // <---- Enable sourcemaps for debugging webpack's output.
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	}
};

export default config;
