const express = require('express');
const router = express.Router();

//Example below
router.get('/routes', (req, res) => {
    res.send('This is a sample test route for an endpoint.');
})

module.exports = routes;