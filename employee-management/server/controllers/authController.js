const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { f_userName, f_Pwd } = req.body;
        let user = await User.findOne({ f_userName });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        user = new User({ f_userName, f_Pwd });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.loginUser = async (req, res) => {
    try {
        const { f_userName, f_Pwd } = req.body;
        const user = await User.findOne({ f_userName });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, userName: user.f_userName });
        });
    } catch (err) { res.status(500).send('Server Error'); }
};
