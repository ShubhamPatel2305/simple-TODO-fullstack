const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const todoRouter = require("./routes/todo");
const port=Math.floor((process.env.PORT).toString());
app.use(bodyParser.json());
app.use("/todo", todoRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});