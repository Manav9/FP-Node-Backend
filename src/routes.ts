import express from "express";
import { apparelController } from "../src/controller/apparelController";

export const routes = express.Router();

routes.post("/updateApparel", apparelController.updateApparel);
routes.post(
  "/updateMultipleApparels",
  apparelController.updateMultipleApparels
);
routes.post("/checkFulfillment", apparelController.checkFulfillment);
// we could have gone with the post here as well just for variety I went with get. ideally it should be POST
// as we are gathering data through body
routes.get("/lowestCost", apparelController.getLowestCost);
