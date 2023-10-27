import express, { Express, Request, Response } from 'express';
import { config } from "../util/config";
import * as fs from "fs";

const app: Express = express();
const port: string = config.port || "433";

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: '/tokens' });
});

app.get('/tokens', (req: Request, res: Response) => {
  fs.readFile('./tokens.txt', 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading tokens');
    }
    res.set('Content-Type', 'text/plain');
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Website in localhost:${port}`);
});
