import { CourseType, db } from "../db/db";

export const coursesRepositories = {
  filteredCourses(title: any) {
    let foundCourses = db.courses;

    if (title) {
      foundCourses = foundCourses.filter((c) => c.title.indexOf(title) > -1);
      console.log("in");
    }

    return foundCourses;
  },

  findCourseById(id: any) {
    return db.courses.find((c) => c.id === id);
  },

  createCourse(title: any) {
    const createdCourse: CourseType = {
      id: +new Date(),
      title: title,
      studentsCount: 0,
    };
    db.courses.push(createdCourse);
    return createdCourse;
  },

  deleteCourse(id: any) {
    for (let i = 0; i < db.courses.length; i++) {
      if (db.courses[i].id === id) {
        db.courses.splice(i, 1);
        return true;
      }
    }
    return false;
  },

  updateCourse(id: any, title: any) {
    const foundCourse = db.courses.find((c) => c.id === id);
    if (!foundCourse) {
      return null;
    }
    return (foundCourse.title = title);
  },
};
