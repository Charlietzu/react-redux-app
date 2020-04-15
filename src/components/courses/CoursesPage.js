import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false,
  };

  componentDidMount() {
    /**Declare this const so we don't have to call this.props everytime we use these words.
     * For example: this.props.courses....
     */
    const { courses, authors, actions } = this.props;

    /**We only want to load the list of courses if its length is equal to 0,
     * otherwise it will load every time we click on link in the header.
     */
    if (courses.length === 0) {
      actions.loadCourses().catch((error) => {
        alert("Loading courses failed" + error);
      });
    }

    if (authors.length === 0) {
      actions.loadAuthors().catch((error) => {
        alert("Loading authors failed" + error);
      });
    }
  }

  handleDeleteCourse = async (course) => {
    toast.success("Course deleted");
    try {
      /**In async calls, it pauses on each await keyword and continue when the async call is completed.  */
      await this.props.actions.deleteCourse(course);
    } catch (error) {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    }
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>

            <CourseList
              onDeleteClick={this.handleDeleteCourse}
              courses={this.props.courses}
            />
          </>
        )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

/**mapStateToProps determines what state is passed to our component via props */
function mapStateToProps(state) {
  return {
    /**For each course we can return the existing course,
     * but also add an authorName property to our object.
     *
     * To get the authorName property we will look into our redux store for that
     * list of authors and find the author that has the relevant ID. And we'll
     * return the name property.
     */
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map((course) => {
            return {
              ...course,
              authorName: state.authors.find((a) => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
    /**The app is loading if it have at least 1 API calls in progress */
    loading: state.apiCallsInProgress > 0,
  };
}
/**mapDispatchToProps let us declare what actions to pass to our component on props */
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
    },
  };
}

/**connect returns a function, that function then calls our component.
 * when we omit mapDispatchToProps, our component gets a dispatch prop
 * injected automatically.
 */
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
