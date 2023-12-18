const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const { getDateUTC, getTransId, getSignature } = require("./utils");

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let KEY = ""
if(process.env.MODE == "TEST"){
    KEY = process.env.CLAVE_TEST
}else{
    KEY = process.env.CLAVE_PRODUCCION
}

app.post("/api/init", async (req, res) => {
   
  const {
    amount = 1,
    email = "example@gmail.com",
    currency = "PEN",
    orderId = new Date().getTime(),
  } = req.body;
  // Par
  const obj = {
    vads_action_mode: "INTERACTIVE",
    vads_amount: amount * 100,
    vads_ctx_mode: process.env.MODE,
    vads_currency: currency == "PEN" ? 604 : 840,
    vads_cust_email: email && "example@gmail.com",
    vads_cust_first_name: "Jerson German",
    vads_cust_last_name: "Example Example",
    vads_order_id: orderId,
    vads_page_action: "PAYMENT",
    vads_payment_cards: "VISA;MASTERCARD;DINERS;AMEX",
    vads_payment_config: "SINGLE",
    vads_site_id: process.env.ID_TIENDA,
    vads_theme_config: "SIMPLIFIED_DISPLAY=true",
    vads_trans_date: getDateUTC(),
    vads_trans_id: getTransId(6),
    // Utilice los campos a continuación para gestionar el regreso a la aplicación móvil al final del pago.
    vads_url_cancel: "http://webview.cancel",
    vads_url_error: "http://webview.error",
    vads_url_refused: "http://webview.refused",
    vads_url_success: "http://webview.success",
    vads_version: "V2",
  };
  
  const signature = getSignature(obj, KEY);
  
  const params = new URLSearchParams();
  for (const property in obj) {
    params.append(property, obj[property]);
  }
  params.append("signature", signature);

  try {
    const response = await (
      await fetch(process.env.URL_WEBVIEW, { method: "POST", body: params })
    ).json();

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/api/ipn", (req, res) => {
  const body = req.body;
  console.log(req.body);
  if (!body) return res.status(400).send("POST is empty");
  if (!body.vads_hash) return res.status(400).send("Hash not found");

  if(!(body.signature === getSignature(body, KEY ))) return res.status(404).send("An error occurred while computing the signature.")
    
  console.log(`Order ${body.vads_order_id} successfully updated`);

  res.status(200).send(`Order ${body.vads_order_id} successfully updated.`);
});

module.exports = { app };
