import { hash, compare } from 'bcrypt';

export const hashPassword = async (password: string) => {
  return hash(password, 7);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return compare(password, hashedPassword);
};
