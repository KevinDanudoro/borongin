import express from "express";

type Response = {
  data: Record<string, any> | null;
  message: string;
  statusCode: number;
};

export const response = (payload: Response, res: express.Response) => {
  res.status(payload.statusCode).json(payload).end();
};
