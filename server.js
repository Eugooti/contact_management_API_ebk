const express = require('express')
require('dotenv').config()
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require("crypto");
const {modelsSync} = require("./models/index.model");
const usersRouts = require('./router/users.route')
const authRoutes = require('./router/auth.route')
const contactRoutes = require('./router/contacts.route')
const organizationRoutes = require('./router/organizations.route')
const {notFound} = require("./utils/errorHandlers");
const {authenticateToken} = require("./config/auth/JWTAuthentication");

const port = process.env.PORT || 3000
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const app = express()

modelsSync().then(connection=>{
    if (!connection) {
        console.error('Error connecting to database')
    }

    app.use(cors({
        origin: ['http://localhost:5174','http://localhost:5173'], // Frontend URL
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true
    }));
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        secret: generateSecretKey(),
        resave: false,
        saveUninitialized: false,
    }));

    app.use('/ebk',authRoutes)
    app.use('/ebk',contactRoutes)
    app.use('/ebk',organizationRoutes)
    app.use('/ebk',usersRouts)

    app.use(notFound)

    app.listen(port,()=>{
        console.log(`Server started on http://localhost:${port}/ebk`)
    })
})

