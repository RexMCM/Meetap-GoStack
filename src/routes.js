import { Router } from "express";

const routes = new Router();

routes.get("/", (re, res) => {
  return res.json("Hello word");
});

export default routes;
