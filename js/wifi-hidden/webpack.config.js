module.exports = {
	entry: "./wifi-hidden.js",
	output: {
		path: __dirname,
		filename: "wifi-hidden-pd.js",
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: "babel",
			query: {
				presets: ["es2015"],
			}
		}]
	},
	devtool: "source-map",
}