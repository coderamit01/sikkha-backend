import express, { Request, Response } from 'express'
import { CookieUtils } from '../../utils/cookies';
import { JwtUtils } from '../../utils/jwt';
import { envVars } from '../../config/env';


const router = express.Router();

router.get("/me", async (req: Request, res: Response) => {
  const accessToken = CookieUtils.getCookie(req, "accessToken");

  if (!accessToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const result = JwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

  if (!result.success) {
    return res.status(401).json({ success: false, message: "Token expired or invalid" });
  }

  return res.status(200).json({
    success: true,
    data: result
  });
});

export const currentUser = router;