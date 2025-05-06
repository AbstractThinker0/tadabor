import { z } from "zod";

const validator = {
  password: z
    .string()
    .min(6, "Password cannot be less than 6 chars")
    .max(64, "Password cannot be longer than 64 chars"),
  email: z.string().email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username cannot be less than 3 chars")
    .max(32, "Username cannot be longer than 32 chars")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
  uuid: z.string().uuid("Invalid token format"),
};

export { validator };
