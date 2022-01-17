const express = require('express');

const router = express.Router();
const subforum = require('../model/subforum');
const printDebugInfo = require('./middleware/printDebugInfo');


router.get('/', printDebugInfo, (req, res) => {
    subforum.getSubjects((err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.status(200).send(result)
        }
    })
})

module.exports = router;