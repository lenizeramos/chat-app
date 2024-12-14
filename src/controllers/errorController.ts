import { Response, Request } from "express";

export const get404 = (req: Request, res: Response) => {
  res.render("pages/notFound");
};
