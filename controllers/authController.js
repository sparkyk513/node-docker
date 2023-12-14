const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); // This package makes the password encrypted


exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashpassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashpassword,
        });
        req.session.user = newUser;
        res.status(200).json({
            status: 'Success! :D User created!',
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'Failed to create new user! :(',
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username })

        if (!user) {
            res.status(404).json({
                status: 'Failed! :(',
                message: 'User not found!',
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: 'Successful Login!',
            })
        } else {
            res.status(400).json({
                status: 'Failed!',
                message: 'Incorrect username or password!',

            })
        }
    } catch (e) {
        res.status(400).json({
            status: 'Failed to create new user! :(',
        });
    }
};