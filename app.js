require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8000
const cookieParser = require('cookie-parser');
const {checkCookie} = require('./middleware/authentication');
const {restrictToLoginUserOnly,restrictToUser} = require('./middleware/auth');
// Setting Up View Engine
app.set('view engine', 'ejs');

// Importing the routes 
const staticRoute = require('./routes/staticRoutes');
const userRoute = require('./routes/userRoutes');
const jobRoute = require('./routes/jobsRoutes');
const applyRoute = require('./routes/applyRoutes');
const notFoundMiddleware = require('./middleware/notFound');
const errorHandleMiddleware = require('./middleware/error-handler'); 

// Setting the path for our views
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());

// For checkCookie
app.use(checkCookie("token"));
// Connect JS
const connect = require('./middleware/connect');

// Setting the routes
app.use('/user',userRoute);
app.use('/job',restrictToLoginUserOnly,jobRoute);
app.use('/apply',applyRoute);
app.use('/',staticRoute);

app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);

const start = async()=>{
    try {
        await connect(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();