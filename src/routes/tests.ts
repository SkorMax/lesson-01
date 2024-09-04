import express from "express";
import { DBType } from "../db/db";
import { HTTP_STATUSES } from "../utils";

export const getTestsRouter = (db: DBType) => {
  const testsRouter = express.Router();

  testsRouter.delete("/data", (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  return testsRouter;
};
