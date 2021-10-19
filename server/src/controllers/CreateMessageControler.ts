import { Request, response, Response } from "express";
import { io } from "../app";
import { CreateMessageService } from "../services/CreateMessageService";

class CreateMessageController {
  async handle(req: Request, res: Response) {
    const { message } = req.body;

    const service = new CreateMessageService();

    try {
      const result = await service.execute(message, req.user_id);

      return res.json(result);
    } catch (err) {
      return response.json({
        error: err.message,
      });
    }
  }
}

export { CreateMessageController };
