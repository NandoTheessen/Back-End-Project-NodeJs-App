const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mysecret = require('../config');

router.post('/', (req, res) => {
    const { password, username } = req.body
    password === undefined || username === undefined ? res.status(400).json({ Error: 'Please provide a password and a username' }) : null

    User.findOne({ username }, (err, user) => {
        err ? res.status(403).json({ error: 'Invalid usernamen' }) : null
        if (user) {
            user
                .authenticate(password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        const payload = {
                            username: user.username
                        };
                        const token = jwt.sign(payload, mysecret)
                        res.status(200).json({ userid: user._id, notes: user.notes, token })
                    } else {
                        res.status(422).json({ error: 'passwords do not match' })
                    }
                })
        }
    })
})

module.exports = router;