const Base64 = require("crypto-js/enc-base64");
const hmacSHA256 = require("crypto-js/hmac-sha256");

const getSignature = (params, KEY) => {
  let contenu_signature = "";

  const sortedParams = Object.keys(params).sort().reduce(
      (obj, key) => { 
          obj[key] = params[key]; 
          return obj;
      }, 
      {}
  );

  for (let nom in sortedParams) {
      if (nom.substring(0, 5) === 'vads_') {
          contenu_signature += sortedParams[nom] + "+";
      }
  }

  contenu_signature += KEY;

  return Base64.stringify(hmacSHA256(contenu_signature, KEY)); // Signature
};

const getTransId = (length) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charLength = chars.length;
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};

const getDateUTC = () => {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
  const día = fechaActual.getUTCDate().toString().padStart(2, "0");
  const hora = fechaActual.getUTCHours().toString().padStart(2, "0");
  const minuto = fechaActual.getMinutes().toString().padStart(2, "0");
  const segundo = fechaActual.getSeconds().toString().padStart(2, "0");
  const formattedDate = año + mes + día + hora + minuto + segundo;

  return formattedDate; // AAAAMDDHHMMSS ``
};

module.exports = { getTransId, getDateUTC, getSignature };
