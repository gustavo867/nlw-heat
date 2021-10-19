import { Request, Response, NextFunction, response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;
  const [, token] = authToken.split(" ");

  if (!token) {
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }

  try {
    const { sub } = verify(token, process.env.JWT_SECRET);

    req.user_id = sub as unknown as string;

    return next();
  } catch (err) {
    return response.status(401).json({
      errorCode: "token.expired",
    });
  }
}
