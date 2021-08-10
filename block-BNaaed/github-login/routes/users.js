var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    console.log(req.session, req.user);
    res.send('Respond with a resource');
})

module.exports = router;