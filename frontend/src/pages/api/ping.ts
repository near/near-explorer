import { NextApiHandler } from "next";

const handler: NextApiHandler = (_req, res) => {
  res.send("pong");
};

export default handler;
