declare namespace Express {
  export interface Request {
    session?: {
      username: string;
      email: string;
    };
  }
}
