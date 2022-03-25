const Cart = require("../models/Cart");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./../routes/verifyToken");

const router = require("express").Router();

//create a new cart
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const createdCart = await newCart.save();
        res.status(201).json(createdCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a product
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get All Cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
