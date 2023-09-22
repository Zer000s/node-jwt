require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path'); 
const fileUpload = require('express-fileupload');
const sequelize = require('./db');
const cookieParser = require('cookie-parser')
const router = require('./routes/index');
const models = require('./models/models');
const ErrorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware');
const PORT = process.env.PORT || 5000;

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router);
app.use(ErrorHandlingMiddleware);

app.get('/', (req, res)=>{res.json("REST API")});

const start = async () =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,()=>{console.log("Server start!")});
    }
    catch(e)
    {
        console.log(e)
    }
}

start();