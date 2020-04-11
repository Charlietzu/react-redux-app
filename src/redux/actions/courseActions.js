import * as types from "./actionTypes";

export function createCourse(course) {
  //"course" is equal to "course: course", this is called object shorthand syntax
  return { type: types.CREATE_COURSE, course };
}
