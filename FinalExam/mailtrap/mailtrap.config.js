const dotenv = require("dotenv");
const { MailtrapClient } = require("mailtrap");

dotenv.config(); // Load environment variables from .env file

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Primark Team",
};

module.exports = { mailtrapClient, sender };
