const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    f_userName: { type: String, required: [true, 'Username is required'], unique: true },
    f_Pwd: { type: String, required: [true, 'Password is required'] }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('f_Pwd')) return next();
    const salt = await bcrypt.genSalt(10);
    this.f_Pwd = await bcrypt.hash(this.f_Pwd, salt);
    next();
});

module.exports = mongoose.model('t_login', UserSchema);
