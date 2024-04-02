import z from "zod";

export const transactionSchema = z.array(z.string());
