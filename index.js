const https = require('https'); // HTTPS client
const axios = require('axios'); // Promise-based HTTP client
const cheerio = require('cheerio');	// HTML parser (text-to-html)
const nodemailer = require('nodemailer'); // Node e-mail service
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

readline.question("What is your e-mail address ? ", function(email){
	let eMail = email;
	readline.question("What's the product you would like to search for ? ", function(searchTerm) {
		let term = searchTerm.indexOf(" ") > -1 ? searchTerm.replace(" ", "+") : searchTerm;
		let url = "https://www.amazon.co.uk/s?k=" + term + "&s=price-asc-rank"; // Results will display the search results with low to high price order
		let originalURL = "https://www.amazon.co.uk";
		let priceList = [], data = '', link;
		
		// HTTP request
		https.get(url, (res) => {
			//console.log('statusCode:', res.statusCode);
			//console.log('headers:', res.headers);
			
			// The response is being sent to the client
			res.on('data', (d) => {
				data += d;
			});
			
			// The whole response has been received. Deal with the result.
			res.on('end', () => {
				//let root = HTMLParser.parse(d.toString());
				let $ = cheerio.load(data.toString());
				// Gets the list of all available prices
				$('.a-price').each(function(){
					let priceWhole = $(this).find(".a-price-whole").text();
					let priceFraction = parseInt($(this).find(".a-price-fraction").text());
					priceList.push(parseFloat(priceWhole + priceFraction));
					
				});
				let lowestPrice = Math.min.apply(Math, priceList);
				let lowestPriceIndex = priceList.indexOf(lowestPrice);
				link = originalURL + $('.a-price').eq(lowestPriceIndex).parent('.a-link-normal').attr('href');
				
				console.log("The cheapest " + term + " found. Link below ...");
				console.log(link);

				// Generate a connection with a test email client (messages never get delivered)
				let transporter = nodemailer.createTransport({
				    host: 'smtp.ethereal.email',
				    port: 587,
				    auth: {
				        user: 'mervin.predovic46@ethereal.email',
				        pass: 'JwHpgrvf9scu6cwtym'
				    }
				});

				// Format the email message, and set the email headers
				let mailOptions = {
					from: 'mervin.predovic46@ethereal.email',
					to: eMail,
					subject: 'Nodejs Amazon lowest price searched product',
					html: '<h2><b>Hello </b></h2>Below there is a link to the cheapest product that you were looking for. <br><b> Product searched : </b>' + searchTerm + ' <br>' + link + ' <br> Have a good day !' // html body
				};
				// Send the email to a chosen user
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});
			});
		}).on('error', (e) => {
			console.error(e);
		});
		readline.close();
	});
});

// Stops the entire process when Signal Interrupt (Control-C) issued in the console
process.on('SIGINT', function(){
	console.log('Signal Interrupt received. Exiting the process');
	process.exit(0);
});

