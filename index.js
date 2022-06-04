const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.port || 8000;
const corsOptions = {
    origin: '*'
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const authRoute = require('./src/routes/auth.route');
const stationRoute = require('./src/routes/station.route');
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/stations', stationRoute);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to rest api application.' });
});
app.use(function (error, req, res, next) {
    // eslint-disable-next-line no-console
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is listening in port ${PORT}`);
        });
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('database connection failed. Server not started');
        console.log(err);
    });