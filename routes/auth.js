const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
    if (req) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString(),
        });
        if (newUser.username && newUser.email && newUser.password) {
            try {
                const savedUser = await newUser.save();
                console.log(savedUser);
                res.status(200).json(savedUser);
            } catch (err) {
                res.status(500).json(err);
                console.log(err);
            }
        } else {
            res.status(400).json({ message: "Please fill all the fields" });
        }
    } else {
        res.status(500).json("error");
    }
});

//login

router.post("/login", async (req, res) => {
    if (req) {
        try {
            const user = await User.findOne({
                username: req.body.username,
            });

            if (user) {
                const decryptedPass = CryptoJS.AES.decrypt(
                    user.password,
                    process.env.PASS_SEC
                ).toString(CryptoJS.enc.Utf8);
                if (decryptedPass === req.body.password) {
                    const accessToken = jwt.sign(
                        {
                            id: user._id,
                            isAdmin: user.isAdmin,
                        },
                        process.env.JWT_SEC,
                        { expiresIn: "3d" }
                    );

                    const { password, ...others } = user._doc;
                    res.status(200).json({ ...others, accessToken });
                    console.log(others);
                } else {
                    res.status(400).json({ message: "Invalid password" });
                }
            } else {
                res.status(400).json({ message: "Invalid username" });
                console.log("Invalid username");
            }
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    } else {
        res.status(500).json("error");
    }
});

module.exports = router;
