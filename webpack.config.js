const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const CompressionPlugin = require('compression-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');

const mode = process.env.NODE_ENV;
const IS_DEV = mode === 'development';
const IS_PROD = !IS_DEV;

let htmlPageNames = [
	'about',
	'products-live-interview-platform',
	'jd-to-cv-match',
	'on-demand-interviews',
	'applicant-tracking-system',
	'you-source-you-interview',
	'signin',
	'you-source-we-interview',
	'automated-bot-based-interview',
	'interview-structuring',
	'demo-popup',
	'freelancers',
];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
	return new HtmlWebpackPlugin({
		template: `./src/${name}.html`, // relative path to the HTML files
		filename: `${name}.html`, // output HTML files
		// chunks: [`${name}`], // respective JS files
		minify: !IS_DEV && {
			html5: true,
			collapseWhitespace: true,
			caseSensitive: true,
			removeComments: true,
			removeEmptyElements: true,
		},
	});
});

const PATHS = {
	src: path.join(__dirname, 'src'),
};

const config = {
	//	mode: mode ? mode : 'development',
	mode: 'production',
	devtool: 'none',
	entry: path.resolve(__dirname, './src/index.js'),

	output: {
		filename: 'main.[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '/',
		assetModuleFilename: 'assets/[name][ext][query]',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/,

				use: [
					{
						loader: 'html-loader',
						options: { minimize: true },
					},
				],
			},

			{
				test: /\.(jpe?g|png|gif|svg|webp)$/i,
				// loader: 'url-loader',
			},

			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					'css-loader',
					{
						loader: 'resolve-url-loader',
					},
					// Compiles Sass to CSS
					{
						loader: 'sass-loader',
					},
				],
			},

			// 		{
			//     test: /\.(sa|sc|c)ss$/,
			//     use: [
			//       MiniCssExtractPlugin.loader,
			//       'css-loader',
			//       'postcss-loader',
			//       'sass-loader',
			//     ],
			//   },

			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader', // turns css into common JS
				],
			},

			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
		],
	},

	devtool: 'eval-cheap-source-map',
	devServer: {
		watchContentBase: true,
		// enabling below code hot reloads only JS changes not html
		//contentBase: path.resolve(__dirname, './dist/'),
		//contentBase: path.resolve(__dirname, './src/views/'),
		hot: true,
	},

	optimization: {
		minimize: true,
		minimizer: [
			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
			`...`,
			new TerserPlugin(),
			new CssMinimizerPlugin(),
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './src/home.html'),
			chunks: ['main'],
			// filename: 'index.html',
			inject: true,
			minify: !IS_DEV && {
				html5: true,
				collapseWhitespace: true,
				caseSensitive: true,
				removeComments: true,
				removeEmptyElements: true,
			},
		}),

		// new HtmlWebpackPlugin({
		// 	template: path.resolve(__dirname, './src/about.html'),
		// 	chunks: ['main'],
		// 	inject: true,
		// 	minify: !IS_DEV && {
		// 		html5: true,
		// 		collapseWhitespace: true,
		// 		caseSensitive: true,
		// 		removeComments: true,
		// 		removeEmptyElements: true,
		// 	},
		// }),

		//new MiniCssExtractPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles/[name].css',
			linkType: 'text/css',
		}),
		// new CompressionPlugin({
		// 	filename: '[path][base].gz',
		// }),
		new HtmlWebpackPartialsPlugin([
			{
				path: path.join(__dirname, './src/footer.html'),
				location: 'myfooter',
				priority: 'replace',
				template_filename: [
					'index.html',
					'about.html',
					'products-live-interview-platform.html',
					'jd-to-cv-match.html',
					'on-demand-interviews.html',
					'applicant-tracking-system.html',
					'you-source-you-interview.html',
					'you-source-we-interview',
					'signin.html',
					'automated-bot-based-interview.html',
					'interview-structuring.html',
					'you-source-we-interview.html',
					'freelancers.html',
				],
			},
		]),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/nav.html'),
			location: 'mynav',
			priority: 'replace',
			template_filename: [
				'index.html',
				'about.html',
				'products-live-interview-platform.html',
				'jd-to-cv-match.html',
				'on-demand-interviews.html',
				'applicant-tracking-system.html',
				'you-source-you-interview.html',
				'you-source-we-interview.html',
				'automated-bot-based-interview.html',
				'interview-structuring.html',
				'freelancers.html',
			],
		}),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/hero-startup.html'),
			location: 'hero-startup',
			priority: 'replace',
		}),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/hero-tabs.html'),
			location: 'hero-tabs',
			priority: 'replace',
			inject: true,
		}),
		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/solutions.html'),
			location: 'solutions',
			priority: 'replace',
			inject: true,
		}),
		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/products.html'),
			location: 'products',
			priority: 'replace',
			inject: true,
		}),
		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/testimonials.html'),
			location: 'testimonials',
			priority: 'replace',
			inject: true,
		}),
		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/whyflo.html'),
			location: 'whyflo',
			priority: 'replace',
			inject: true,
		}),
		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/customer-logos.html'),
			location: 'customer-logos',
			priority: 'replace',
			inject: true,
		}),
		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/stats.html'),
			location: 'stats',
			priority: 'replace',
			inject: true,
			template_filename: [
				'index.html',
				'about.html',
				'products-live-interview-platform.html',
				'jd-to-cv-match.html',
				'on-demand-interviews.html',
				'applicant-tracking-system.html',
				'you-source-you-interview.html',
				'you-source-we-interview.html',
				'automated-bot-based-interview.html',
				'interview-structuring.html',
				'freelancers.html',
			],
		}),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/howitworks.html'),
			location: 'howitworks',
			priority: 'replace',
			inject: true,
		}),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/upnav.html'),
			location: 'upnav',
			priority: 'replace',
			inject: true,
			template_filename: [
				'index.html',
				'about.html',
				'products-live-interview-platform.html',
				'jd-to-cv-match.html',
				'on-demand-interviews.html',
				'applicant-tracking-system.html',
				'you-source-you-interview.html',
				'you-source-we-interview.html',
				'automated-bot-based-interview.html',
				'interview-structuring.html',
				'freelancers.html',
			],
		}),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/demo.html'),
			location: 'demo',
			priority: 'replace',
			inject: true,
			template_filename: [
				'index.html',
				'products-live-interview-platform.html',
				'jd-to-cv-match.html',
				'on-demand-interviews.html',
				'applicant-tracking-system.html',
				'you-source-you-interview.html',
				'you-source-we-interview.html',
				'automated-bot-based-interview.html',
				'interview-structuring.html',
			],
		}),

		new HtmlWebpackPartialsPlugin({
			path: path.join(__dirname, './src/demo-popup.html'),
			location: 'demo-popup',
			priority: 'replace',
			inject: true,
			template_filename: [
				'index.html',
				'products-live-interview-platform.html',
				'jd-to-cv-match.html',
				'on-demand-interviews.html',
				'applicant-tracking-system.html',
				'you-source-you-interview.html',
				'you-source-we-interview.html',
				'automated-bot-based-interview.html',
				'interview-structuring.html',
			],
		}),

		new CopyPlugin({
			patterns: [{ from: './src/assets', to: 'assets' }],
		}),
		new CleanWebpackPlugin(),
		new ExtraWatchWebpackPlugin({
			dirs: [path.join(__dirname, 'src')],
		}),
		new PurgeCSSPlugin({
			paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
		}),
	].concat(multipleHtmlPlugins),
};

module.exports = config;

// https://github.com/colbyfayock/html-webpack-partials-plugin/blob/master/examples/basic-multi/webpack.config.js

// https://github.com/colbyfayock/html-webpack-partials-plugin/issues/2

// DINESH PENDING
// Rework on webconfig, make individual css modules if possible.
