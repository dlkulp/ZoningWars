// Colyseus + Express
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import {ZWRoom} from "./multiplayer/ZWRoom";
import cors from "cors";
const port = Number(process.env.port) || 2567;

const app = express();
app.use(cors());
app.use(express.json());

const gameServer = new Server({
  server: createServer(app)
});

gameServer.define("ZoningWars", ZWRoom);

gameServer.listen(port);