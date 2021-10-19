import axios from "axios";
import { sign } from "jsonwebtoken";
import prismaClient from "../prisma";

interface IAcessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    try {
      const url = "https://github.com/login/oauth/access_token";

      const {
        data: { access_token },
      } = await axios.post<IAcessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

      const { data } = await axios.get<IUserResponse>(
        "https://api.github.com/user",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      let user = await prismaClient.user.findFirst({
        where: {
          github_id: data.id,
        },
      });

      if (!user) {
        user = await prismaClient.user.create({
          data: {
            github_id: data.id,
            avatar_url: data.avatar_url,
            login: data.login,
            name: data.name,
          },
        });
      }

      const token = sign(
        {
          user: {
            name: user.name,
            avatar_url: user.avatar_url,
            id: user.id,
          },
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "1d",
        }
      );

      return { token, user };
    } catch (error) {
      console.log(error);

      return { error: error.message };
    }
  }
}

export { AuthenticateUserService };
