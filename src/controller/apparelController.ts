import { Request, Response } from "express";
import { apparelService } from "../services/apparelServices";

/**
 * apparelController
 */
export const apparelController = {
  updateApparel: (req: Request, res: Response) => {
    const { code, size, quantity, price } = req.body;
    const result = apparelService.updateApparel(code, size, quantity, price);
    res.json(result);
  },

  updateMultipleApparels: (req: Request, res: Response) => {
    const data = req.body;
    const result = apparelService.updateMultipleApparels(data);
    res.json(result);
  },

  checkFulfillment: (req: Request, res: Response) => {
    const order = req.body;
    const result = apparelService.checkFulfillment(order);
    res.json(result);
  },

  getLowestCost: (req: Request, res: Response) => {
    const order = req.body;
    const result = apparelService.getLowestCost(order);
    res.json(result);
  },
};
