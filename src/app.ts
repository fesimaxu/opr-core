import express from "express";
import logger from "morgan";
import cors from "cors";
import { HttpError } from "http-errors";
import dotenv from "dotenv";
import { db } from "./config/db";
import config from "./config/db/dbConfig"
import errorHandler from "./middleware/errorHandler";
import UserRoutes from "./routes/user";
import SettingsRoutes from "./routes/settings";
import { BASE_URL } from "./utils/endpoints";

dotenv.config();
const { PORT } = config;

// Server Initialization
const app = express();

// PORT
const APP_PORT = PORT

// NPM Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(BASE_URL, UserRoutes);
app.use(BASE_URL, SettingsRoutes);


// Error Handling
app.use(errorHandler);

// Database Connection
db.sync({alter: true})
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err: HttpError) => {
    console.log(err);
  });


app.listen(APP_PORT, () => {
    console.log(`App running on port ${APP_PORT}`)
})


export default app;