import { Request, response, Response } from "express";
import { GetLast3MessageService } from "../services/GetLast3MessageService";

class Get3LastMessageController {
  async handle(req: Request, res: Response) {
    const service = new GetLast3MessageService();

    try {
      const result = await service.execute();

      return res.json(result);
    } catch (err) {
      return response.json({
        error: err.message,
      });
    }
  }
}

export { Get3LastMessageController };
