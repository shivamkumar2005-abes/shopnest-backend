require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./model/user");
const Product = require("./model/Product");

const seedUsers = async () => {
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
      verified: true,
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password: "John@123",
      role: "user",
      verified: true,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "Jane@123",
      role: "user",
      verified: false,
    },
  ];

  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  const existingEmails = new Set(
    (await User.find({ email: { $in: users.map((u) => u.email) } })).map((u) => u.email)
  );

  const newUsers = hashedUsers.filter((user) => !existingEmails.has(user.email));

  if (newUsers.length > 0) {
    await User.insertMany(newUsers);
  }

  return newUsers.length;
};

const seedProducts = async () => {
  const products = [
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with silent clicks.",
      price: 29.99,
      category: "Electronics",
      stock: 50,
      imageURLs: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
      ratings: 4.5,
      numberOfReviews: 18,
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard for fast typing.",
      price: 79.99,
      category: "Electronics",
      stock: 30,
      imageURLs: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      ratings: 4.7,
      numberOfReviews: 25,
    },
    {
      name: "Coffee Mug",
      description: "Ceramic mug with a premium finish.",
      price: 12.5,
      category: "Home",
      stock: 100,
      imageURLs: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      ratings: 4.2,
      numberOfReviews: 10,
    },
    {
      name: "Running Shoes",
      description: "Lightweight running shoes for daily workouts.",
      price: 59.99,
      category: "Fashion",
      stock: 40,
      imageURLs: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      ratings: 4.6,
      numberOfReviews: 14,
    },
    {
      name: "Backpack",
      description: "Durable backpack for work and travel.",
      price: 45.0,
      category: "Accessories",
      stock: 25,
      imageURLs: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      ratings: 4.3,
      numberOfReviews: 9,
    },
  ];

  const existingProducts = await Product.find({
    name: { $in: products.map((p) => p.name) },
  });

  const existingNames = new Set(existingProducts.map((p) => p.name));
  const newProducts = products.filter((product) => !existingNames.has(product.name));

  if (newProducts.length > 0) {
    await Product.insertMany(newProducts);
  }

  return newProducts.length;
};

const seed = async () => {
  try {
    await connectDB();

    const createdUsers = await seedUsers();
    const createdProducts = await seedProducts();

    console.log(`Seed completed successfully.`);
    console.log(`Users created: ${createdUsers}`);
    console.log(`Products created: ${createdProducts}`);
    console.log("\n--- Login Credentials ---");
    console.log("Admin: admin@example.com / Admin@123");
    console.log("User:  john@example.com / John@123");
    console.log("User:  jane@example.com / Jane@123 (unverified)");
    console.log("-------------------------\n");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
};

seed();