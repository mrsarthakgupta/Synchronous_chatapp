import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profilesetup: {
        type: Boolean,
        default: false
    }

});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('User', userSchema);
export default User;