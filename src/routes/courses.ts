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
import { coursesRepositories } from "../repositiries/courses-repository";

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getCoursesRoutes = () => {
  const coursesRouter = express.Router();

  coursesRouter.get(
    "/",
    (
      req: RequestWithQuery<QueryCoursesModel>,
      res: Response<CourseViewModel[]>,
    ) => {
      let courses = coursesRepositories.filteredCourses(req.query.title);

      res.json(courses.map(getCourseViewModel));
    },
  );

  coursesRouter.get(
    "/:id",
    (
      req: RequestWithParams<URIParamsCourseIdModel>,
      res: Response<CourseViewModel>,
    ) => {
      const foundCourse = coursesRepositories.findCourseById(+req.params.id);
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

      const createdCourse = coursesRepositories.createCourse(req.body.title);

      res
        .status(HTTP_STATUSES.CREATED_201)
        .json(getCourseViewModel(createdCourse));
    },
  );

  coursesRouter.delete(
    "/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
      const isDeleted = coursesRepositories.deleteCourse(+req.params.id);
      if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }
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

      const foundCourse = coursesRepositories.updateCourse(
        +req.params.id,
        req.body.title,
      );

      if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  return coursesRouter;
};
