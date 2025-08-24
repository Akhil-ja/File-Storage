import jwt from "jsonwebtoken";

const generateTokens = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const accessTokenExpiration = process.env
    .JWT_ACCESS_TOKEN_EXPIRATION as string;
  const refreshTokenExpiration = process.env
    .JWT_REFRESH_TOKEN_EXPIRATION as string;

  if (!jwtSecret || !accessTokenExpiration || !refreshTokenExpiration) {
    throw new Error("Missing JWT environment variables");
  }

  const accessToken = jwt.sign({ id }, jwtSecret, {
    expiresIn: accessTokenExpiration as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ id }, jwtSecret, {
    expiresIn: refreshTokenExpiration as jwt.SignOptions["expiresIn"],
  });

  return { accessToken, refreshToken };
};

export default generateTokens;
