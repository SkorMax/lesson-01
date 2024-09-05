import express from "express";
import { getCoursesRoutes } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";
import { db } from "./db/db";

export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRoutes());
app.use("/__tests__", getTestsRouter(db));
