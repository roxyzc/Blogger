import bcrypt from "bcrypt";

export const hash = async (candidateH: string) => {
  return await bcrypt.hash(candidateH, Number(process.env.SALT));
};

export const compare = async (v1: string, enc: string) => {
  return await bcrypt.compare(v1, enc);
};
