const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
async function getProductState(productId) {
  try {
    const page_response = await axios.get(
      `https://api.bestbuy.com/v1/products/${productId}.json?apiKey=${process.env.BESTBUY_API_KEY}`
    );
    const product_details = page_response.data;
    console.log("cehcking product:id", productId);
    console.log("cehcking product:name", product_details.name);
    if (product_details.orderable === "Available") {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "amrayoub97@gmail.com, Ahmedazmy92@hotmail.com",
        subject: "RTX Are Not Availabe Now At BestBuy",
        text: "",
        html: `<h2>${product_details.name}</h2><p>You can order it now from ${product_details.url}</p>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function CheckBestBuyProducts() {
  const productIds = process.env.BESTBUY_PRODUCTS_IDS.split(",");
  for await (const productId of productIds) {
    getProductState(productId);
  }
}
CheckBestBuyProducts();
