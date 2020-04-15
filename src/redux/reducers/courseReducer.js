import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function courseReducer(state = initialState.courses, action) {
  switch (action.type) {
    case types.CREATE_COURSE_SUCCESS:
      return [...state, { ...action.course }];
    case types.UPDATE_COURSE_SUCCESS:
      /**map returns a new array. I'm replacing the element with the matching course.id. */
      return state.map((course) =>
        course.id === action.course.id ? action.course : course
      );
    case types.LOAD_COURSES_SUCCESS:
      return action.courses;
    case types.DELETE_COURSE_OPTIMISTIC:
      /**Returns a new array with all the courses, but with one course omitted, the course
       * that has the course ID that we're trying to delete.
       */
      return state.filter((course) => course.id !== action.course.id);
    default:
      return state;
  }
}
