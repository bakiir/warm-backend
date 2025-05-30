const User = require("../models/User")
const Product = require("../models/Product");

exports.getAllUsers = async (req, res)=>{
    const { role } = req.query;
    try {
        const filter = role ? { role } : {};
        const products = await User.find(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.updateUser = async (req, res)=>{
    try{
        const {id} = req.params
        const updates = req.body

        const user = await User.findByIdAndUpdate(id, updates, {new: true})
        if (!user) return res.status(404).json({message: "User not found!"})

        res.json(user)
    }catch (err){
        res.status(500).json({message: "Server error"})
    }
}

