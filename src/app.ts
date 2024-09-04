import express from "express";
import { getCoursesRoutes, getInterestingRouter } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";
import { db } from "./db/db";

export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRoutes(db));
app.use("/__tests__", getTestsRouter(db));
app.use("/intertesting", getInterestingRouter(db));
