import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";

export function createCourse(course) {
  //"course" is equal to "course: course", this is called object shorthand syntax
  return { type: types.CREATE_COURSE, course };
}

export function loadCoursesSuccess(courses) {
  return { type: types.LOAD_COURSES_SUCCESS, courses };
}

export function loadCourses() {
  /**Redux thunk injects dispatch so we don't have to. */
  return function (dispatch) {
    return courseApi
      .getCourses()
      .then((courses) => {
        /**we call this function loadCoursesSuccess because:
         * 1 -  we already have a function called loadCourses, which is our thunk
         * 2 - this action doesn't fire until authors have been
         * successfully returned by our API call
         */
        dispatch(loadCoursesSuccess(courses));
      })
      .catch((error) => {
        throw error;
      });
  };
}
