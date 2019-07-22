# Application description
This project is intended for a CLI use. It asks the user for an email address then searches for the user's product of choice on the Amazon website based on the keyword entered, finds the cheapest option, and sends a notification email to the user.

# Getting Started
1. Clone the repository (https://www.github.com/pjedra96/amazon-cheapest-product-finder) to a directory of your choice.
2. Ensure that you have NodeJS installed (v6+) on your system. 
3. Install all dependencies on your machine at the root of the repository clone, using `npm install`.
4. Execute `npm start` from the NodeJS Command Prompt at the root of the clone.

# Notice
The e-mail address provided in the code is only used for testing, and therefore it does not send actual an actual email to the user, should they enter their address. In order for the email functionality to actually send emails, nodemailer has to be configured with an actual gmail or hotmail account.