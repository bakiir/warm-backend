require("dotenv").config();
const { cloudinary } = require("./config/cloudinary"); // <-- фикс

cloudinary.api.ping()
    .then((res) => {
        console.log("✅ Успешно подключено к Cloudinary!");
        console.log(res);
    })
    .catch((err) => {
        console.error("❌ Ошибка подключения к Cloudinary:");
        console.error(err.message, err);
    });
