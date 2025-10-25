import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  res.json({ 
    status: 'ok',
    message: 'Gift of Hope API is running',
    timestamp: new Date().toISOString()
  });
}
