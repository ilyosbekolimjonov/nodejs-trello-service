import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use("/", routes);

// Xatoliklarni tutuvchi middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});