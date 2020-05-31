import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

/**We pass this object as a parameter is the same of using
 * const { courses, authors, loadAuthors, loadCourses } = this.props
 * with a class extending React.Component
 *
 * ...props means: "Assign any props i haven't destructured on the left
 * to a variable called props."
 */
export function ManageCoursePage({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  history,
  ...props
}) {
  /**useState hook allows us to add React state to function components,
   * it returns a pair of values, we use array destructuring to assign each value a name.
   *
   * The first value is the state variable, and the second value is the setter function
   * for that variable.
   */
  const [course, setCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /**useEffect will run everytime that the component renders, we only want it to run any time
   * that a new course is passed, so we declare a second argument, which is an array of items
   * for it to watch. And if anything in that array changes, it will re-run useEffect.
   *
   * The empty array as a second argument to effect means the effect will run once when the
   * component mounts.
   */
  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch((error) => {
        alert("Loading courses failed" + error);
      });
    } else {
      /**This will copy the course passed in on props to state anytime a new course is passed in. */
      setCourse({ ...props.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch((error) => {
        alert("Loading authors failed" + error);
      });
    }
  }, [props.course]);

  function handleChange(event) {
    /**This destructure avoids the event getting garbage collected so that it's avaiable
     * within the nested setCourse callback.
     */
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      /**This is JavaScript's computed property syntax. It allows us to reference a property via a variable.
       * For example, if the input that just changed was the title field, this code is equivalent to saying
       * "course.title".
       */
      [name]: name === "authorId" ? parseInt(value, 10) : value,
    }));
  }

  function formIsValid() {
    const { title, authorId, category } = course;
    const errors = {};

    if (!title) errors.title = "Title is required.";
    if (!authorId) errors.author = "Author is required.";
    if (!category) errors.category = "Title is required.";

    setErrors(errors);
    /**Form is valid if the errors object still has no properties. */
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    /**This is passed in on props, so it's already bound to dispatch.
     * history.push means that after the save is done the URL will be changed to "/courses".
     */
    saveCourse(course)
      .then(() => {
        toast.success("Course saved.");
        history.push("/courses");
      })
      .catch((error) => {
        /**This way the user can try submitting the form again after an error occurs. */
        setSaving(false);
        /**The error.onSave property is display in the CourseForm.  */
        setErrors({ onSave: error.message });
      });
  }

  return authors.length === 0 || courses.length === 0 ? (
    <Spinner />
  ) : (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  //actions: PropTypes.object.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  /**Any component loaded via <Route> gets history passed in on props from React Router. */
  history: PropTypes.object.isRequired,
};

/**This function is a selector, it selects data from the Redux store.
 * You could declare this in the course reducer for easy reuse.
 * For performance you could memorize the response using reselect.
 */
export function getCourseBySlug(courses, slug) {
  return courses.find((course) => course.slug === slug) || null;
}

/**ownProps lets us access the component's props. We can use this to read the URL data injected
 * on props by ReactRouter.
 */
function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  const course =
    /**We verify the array's length because we need to wait for the API call to finish,
     * otherwise we would get an empty array of courses.
     *
     * Also, mapStateToProps runs every
     * time the Redux sotre changes, so when courses are available, we'll call getCourseBySlug.
     */
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;

  return {
    /**We are setting course in the line above. */
    course,
    courses: state.courses,
    authors: state.authors,
  };
}

const mapDispatchToProps = {
  loadCourses: courseActions.loadCourses,
  saveCourse: courseActions.saveCourse,
  loadAuthors: authorActions.loadAuthors,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
