import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { QueryCoursesModel } from "../models-or-dto/QueryCoursesModel";
import express, { Response } from "express";
import { CourseViewModel } from "../models-or-dto/CourseViewModel";
import { URIParamsCourseIdModel } from "../models-or-dto/URIParamsCourseIdModel";
import { CreateCourseModel } from "../models-or-dto/CreateCourseModel";
import { UpdateCourseModel } from "../models-or-dto/UpdateCourseModel";
import { CourseType, DBType } from "../db/db";
import { HTTP_STATUSES } from "../utils";

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getCoursesRoutes = (db: DBType) => {
  const coursesRouter = express.Router();

  coursesRouter.get(
    "/",
    (
      req: RequestWithQuery<QueryCoursesModel>,
      res: Response<CourseViewModel[]>,
    ) => {
      let foundCourses = db.courses;

      if (req.query.title) {
        foundCourses = foundCourses.filter(
          (c) => c.title.indexOf(req.query.title) > -1,
        );
      }

      res.json(foundCourses.map(getCourseViewModel));
    },
  );

  coursesRouter.get(
    "/:id",
    (
      req: RequestWithParams<URIParamsCourseIdModel>,
      res: Response<CourseViewModel>,
    ) => {
      const foundCourse = db.courses.find((c) => c.id === +req.params.id);

      if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.json(getCourseViewModel(foundCourse));
    },
  );

  coursesRouter.post(
    "/",
    (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseViewModel>,
    ) => {
      if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }

      const createdCourse: CourseType = {
        id: +new Date(),
        title: req.body.title,
        studentsCount: 0,
      };
      db.courses.push(createdCourse);

      res
        .status(HTTP_STATUSES.CREATED_201)
        .json(getCourseViewModel(createdCourse));
    },
  );

  coursesRouter.delete(
    "/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
      db.courses = db.courses.filter((c) => c.id !== +req.params.id);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  coursesRouter.put(
    "/:id",
    (
      req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
      res,
    ) => {
      if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }

      const foundCourse = db.courses.find((c) => c.id === +req.params.id);

      if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      foundCourse.title = req.body.title;

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );
  return coursesRouter;
};

export const getInterestingRouter = (db: DBType) => {
  const coursesRouter = express.Router();

  //Обрати  внимание на порядок роутов! Обобщённые роуты где есть юрай параметры опускать пониже

  coursesRouter.get(
    "/books",
    (req: RequestWithQuery<QueryCoursesModel>, res) => {
      res.json({ title: "books" });
    },
  );

  coursesRouter.get(
    "/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
      res.json({ title: "data by id: " + req.params.id });
    },
  );

  return coursesRouter;
};
