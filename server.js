const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());

// Подключение к базе
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// доступ к картинкам
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


// Роуты
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/orders", require("./routes/dropRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/pickers", require("./routes/orderRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/users", require("./routes/userRoutes"))
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
