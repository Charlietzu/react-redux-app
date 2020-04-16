import * as courseActions from "./courseActions";
import * as types from "./actionTypes";
import { courses } from "../../../tools/mockData";
import thunk from "redux-thunk";
//use fetchMock to mock our fetch calls
import fetchMock from "fetch-mock";
//use configureMockStore to create a mock redux store
import configureMockStore from "redux-mock-store";

//Test an async action
const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe("Async Actions", () => {
  //initializes fetchMock for each test.
  afterEach(() => {
    fetchMock.restore();
  });

  describe("Load Courses Thunk", () => {
    it("should create BEGIN_API_CALL and LOAD_COURSES_SUCCESS when loading courses", () => {
      /**This captures all fetch calls and responds with some mock data. */
      fetchMock.mock("*", {
        //return a body that contains an array of courses
        body: courses,
        headers: { "content-hype": "application/json" },
      });

      /**Actions that i expect to be fired from the thunk. */
      const expectedActions = [
        { type: types.BEGIN_API_CALL },
        { type: types.LOAD_COURSES_SUCCESS, courses },
      ];

      /**Creation of the mock-redux-store and initialize the store to contain an empty array of courses. */
      const store = mockStore({ courses: [] });

      /**Dispatch of the loadCourses action. */
      return store.dispatch(courseActions.loadCourses()).then(() => {
        /**store.getActions() returns a list of actions that have occurred. And i assert that the list of actions
         * matches the expectedActions that we declared above.
         */
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});

/**this tests confirms when i call the createCourseSuccess action creator, i get the expected object shape back. */
describe("createCourseSuccess", () => {
  it("should create a CREATE_COURSE_SUCCESS action", () => {
    //arrange
    const course = courses[0];
    const expectedAction = {
      type: types.CREATE_COURSE_SUCCESS,
      course,
    };

    //act
    const action = courseActions.createCourseSuccess(course);

    //assert
    expect(action).toEqual(expectedAction);
  });
});
