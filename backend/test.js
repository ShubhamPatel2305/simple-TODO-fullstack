//dotenv config
require('dotenv').config();

const uri=(process.env.MONGO_URI).toString();
const uriP=Math.floor((process.env.PORT).toString());
console.log(uriP);
console.log(uri);