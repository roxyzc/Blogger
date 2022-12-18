import jwt from "jsonwebtoken";

export const generateAccessToken = async (id: String, role: String) => {
  const accessToken = jwt.sign(
    { role, id },
    process.env.ACCESSTOKENSECRET as string,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { role, id },
    process.env.REFRESHTOKENSECRET as string,
    { expiresIn: "30m" }
  );

  return Promise.resolve({ accessToken, refreshToken });
};

export const refreshToken = (id: string, role: string) => {
  const accessToken = jwt.sign(
    { id, role },
    process.env.ACCESSTOKENSECRET as string,
    { expiresIn: "15m" }
  );
  return Promise.resolve({ accessToken });
};
