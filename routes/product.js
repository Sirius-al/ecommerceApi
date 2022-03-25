const router = require("express").Router();
const Product = require("../models/Product");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../routes/verifyToken");

//create a new product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const createdProduct = await newProduct.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all products
router.get("/", async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try {
        let products;
        if (queryNew) {
            products = await Product.find({ new: true })
                .sort({ createdAt: -1 })
                .limit(5);
        } else if (queryCategory) {
            products = await Product.find({
                catagories: {
                    $in: [queryCategory],
                },
            });
        } else {
            products = await Product.find().sort({ createdAt: -1 });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
