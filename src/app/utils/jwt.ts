
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, options: SignOptions) => {
  const token = jwt.sign(payload, secret, options);
  return token;
}

const verifyToken = (token: string, secret: string) => {
  try {
    const decode = jwt.verify(token, secret);
    return {
      success: true,
      message: "Successfully verify",
      data: decode
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error
    }
  }
}

const decodeToken = (token: string) => {
  const decoded = jwt.decode(token);
  return decoded;
}


export const JwtUtils = {
  createToken,
  verifyToken,
  decodeToken
}