import express, { Request, Response, NextFunction } from "express";
import { getCoursesRoutes } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";
import { db } from "./db/db";

export const app = express();

export const jsonBodyMiddleware = express.json();

const blablaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  req.blabla = "Bla";
  //@ts-ignore
  req.bloblo = "Bloooooooooooooo";
  next();
};

const authGuard = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  if (req.query.code === "7777") {
    next();
  } else {
    res.send(400);
  }
};

app.use(blablaMiddleware);
app.use(authGuard);

app.get("/middlewares", (req, res) => {
  //@ts-ignore
  const blabla = req.blabla;
  //@ts-ignore
  res.send({ somedata: blabla });
});

app.get("/seniorses", (req, res) => {
  //@ts-ignore
  const blabla = req.bloblo;
  //@ts-ignore
  res.send({ somedata: blabla });
});

app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRoutes());
app.use("/__tests__", getTestsRouter(db));
