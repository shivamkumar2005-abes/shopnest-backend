const Order = require("../model/Order");

const sendemail = require("../utils/sendemail");

//create order
const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, address, paymentId } = req.body;
    if (!products || products.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    else{
        const order = new Order({
            user: req.user._id,
            products,
            totalAmount,
            address,
            paymentId
        });
        await order.save();
        const message = `dear ${req.user.name}, your order has been created successfully. Your order ID is ${order._id}\nTotal Amount: ${order.totalAmount}\nShipping Address: ${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}\nPayment ID: ${order.paymentId}\nStatus: ${order.status}`;

        await sendemail(req.user.email, "Order Created", message);
        res.status(201).json({ message: "Order created successfully", order });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const myorders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.productId", "name price");
    res.json(orders);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "id name")
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "error occurred while fetching orders", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id);
    if (order){
        order.status = status;
        await order.save();
        res.json({ message: "Order status updated successfully", order });
    }else{
        res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "error updating order status", error: error.message });
  }
};

module.exports = { createOrder, getOrders, myorders, updateOrderStatus };

