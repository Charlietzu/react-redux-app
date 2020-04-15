import React from "react";
import CourseForm from "./CourseForm";
import { shallow } from "enzyme";

/**Factory function to call React components with some default values. This will keep our tests simple. */
function renderCourseForm(args) {
  const defaultProps = {
    authors: [],
    course: {},
    saving: false,
    errors: {},
    onSave: () => {},
    onChange: () => {},
  };

  /**The args will overwrite the defaultProps, the spread operator will blend the two together. */
  const props = { ...defaultProps, ...args };
  /**Using spread operator to assing all the props to the component. */
  return shallow(<CourseForm {...props} />);
}

it("renders forms and header", () => {
  const wrapper = renderCourseForm();
  //console.log(wrapper.debug());

  /**Expects 1 form */
  expect(wrapper.find("form").length).toBe(1);

  /**Expects a H2 selector to have the text equal to "Add Course"*/
  expect(wrapper.find("h2").text()).toEqual("Add Course");
});

it('labels save buttons as "Save" when not saving', () => {
  const wrapper = renderCourseForm();
  expect(wrapper.find("button").text()).toBe("Save");
});

it('labels save buttons as "Saving..." when not saving', () => {
  const wrapper = renderCourseForm({ saving: true });
  expect(wrapper.find("button").text()).toBe("Saving...");
});
