const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const userRouter = require("./routes/user");

const port=Math.floor((process.env.PORT).toString());
app.use(bodyParser.json());
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});