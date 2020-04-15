import React from "react";
/**Our system under test */
import CourseForm from "./CourseForm";
/**Render our component */
import renderer from "react-test-renderer";
/**Mock data to use in our test */
import { courses, authors } from "../../../tools/mockData";

/**Assure that the label on the save button is properly set when we set the save prop to true. */
it("sets submit button label 'Saving...' when saving is true", () => {
  const tree = renderer.create(
    <CourseForm
      course={courses[0]}
      authors={authors}
      /**jest.fn() creates an empty mock function. */
      onSave={jest.fn()}
      onChange={jest.fn()}
      saving
    />
  );

  expect(tree).toMatchSnapshot();
});

it("sets submit button label 'Save' when saving is false", () => {
  const tree = renderer.create(
    <CourseForm
      course={courses[0]}
      authors={authors}
      /**jest.fn() creates an empty mock function. */
      onSave={jest.fn()}
      onChange={jest.fn()}
      a
      saving={false}
    />
  );

  expect(tree).toMatchSnapshot();
});
