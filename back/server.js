import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserModel } from "./model.js";
import cors from "cors";

dotenv.config();

const server = express();
const db = process.env.DB_URL || "mongodb://localhost:27017/users";
const port = process.env.PORT || 4000;

server.use(cors());
server.use(express.json());
server.use(urlencoded({ extended: true }));

server.get("/users/getAll", async (req, res, next) => {
  await UserModel.find({})
    .then((users) => res.json(users))
    .catch((err) => console.log(err));
});

server.post("/users/create", async (req, res, next) => {
  await UserModel.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

server.delete("/users/delete/:id", async (req, res, next) => {
  await UserModel.deleteOne({ id: req.params.id })
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

mongoose.connect(db);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully!");

  server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
});

mongoose.connection.on("error", (error) => {
  console.error("Failed to connect to MongoDB:\nError:", error);
});
