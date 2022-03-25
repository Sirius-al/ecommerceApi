const Order = require("../models/Order");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./../routes/verifyToken");

const router = require("express").Router();

//create a new Order
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const createdOrder = await newOrder.save();
        res.status(201).json(createdOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user Orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const Orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(Orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get All Order
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const Orders = await Order.find();
        res.status(200).json(Orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastMonth - 1));
    try {
        const Income = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousMonth,
                    },
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(Income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
