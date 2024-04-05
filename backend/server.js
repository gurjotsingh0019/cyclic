const app = require('./app');
const connectDatabase = require('./config/db');
const port = 3000;
const path = require('path');
const cloudinary = require('cloudinary').v2;
const express = require('express');

async function startServer() {
    try {
        await connectDatabase();

        cloudinary.config({
            cloud_name: 'dza9mvxzu',
            api_key: '856775584392823',
            api_secret: 'wL0KkCLJeHrpyzPyd3ikJTs5HXQ',
            secure: true
        });
        
        const __dirname = path.resolve();

        app.use(express.static(path.join(__dirname, '/frontend/build')));

        app.get('*', (req, res) =>
            res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')
            ));

        const server = app.listen(3000, process.env.HOST, () => {
            console.log(`Server is running on port 3000`);
        });

        process.on('uncaughtException', (err) => {
            console.error(`Uncaught Exception: ${err.message}`);
            shutdown(server);
        });

        // Handling unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error(`Unhandled Promise Rejection: ${err.message}`);
            shutdown(server);
        });
    }
    catch (err) {
        console.error(`Error during server start: ${err.message}`);
    }
}

function shutdown(server) {
    console.log('Shutting Down the Server');
    server.close(() => {
        process.exit(1);
    });
}

startServer();  