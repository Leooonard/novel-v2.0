module.exports = {
	entry: "./aodv.js",
	output: {
		path: __dirname,
		filename: "aodv-pd.js",
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