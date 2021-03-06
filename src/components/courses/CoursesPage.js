/* eslint-disable no-unused-vars */
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
    order: false,
    filtered: false,
    searchTerm: "",
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

  handleFilterByGlobal = async (event) => {
    event.preventDefault();
    let searchTerm = event.target.filter.value;
    this.setState({ searchTerm });
    if (searchTerm === "") {
      this.setState({ filtered: false });
    } else {
      this.setState({ filtered: true });
    }
    let filter = await this.props.actions.filterCoursesByGlobal(searchTerm);
  };

  handleSortCourses = async (event) => {
    event.preventDefault();
    console.log("handleSortCourses");
    let field = event.target.id;
    this.setState({ order: !this.state.order });
    let ordenation = this.state.order ? "desc" : "asc";
    let sort = await this.props.actions.sortCourses(field, ordenation);
  };

  handleSortFilteredCourses = async (event) => {
    event.preventDefault();
    console.log("handleSortFilteredCourses");
    let field = event.target.id;
    this.setState({ order: !this.state.order });
    let ordenation = this.state.order ? "desc" : "asc";
    let sort = await this.props.actions.sortFilteredCourses(
      this.state.searchTerm,
      field,
      ordenation
    );
  };

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses ({this.props.courses.length})</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <div className="container-fluid">
              <div className="row mb-2">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    this.setState({ redirectToAddCoursePage: true })
                  }
                >
                  Add Course
                </button>
              </div>
              <div className="row mb-2">
                <form
                  className="form-inline float-left my-2 my-lg-0"
                  onSubmit={this.handleFilterByGlobal}
                >
                  <input
                    className="form-control"
                    type="text"
                    name="filter"
                    placeholder="Type and press ENTER"
                    onChange={this.handleChange.bind(this)}
                  />
                  <button
                    className="btn btn-outline-success mt-2 ml-0 mt-sm-0 ml-sm-2"
                    onClick={() => this.props.actions.loadCourses}
                  >
                    Clear
                  </button>
                </form>
              </div>
            </div>
            <CourseList
              filtered={this.state.filtered}
              handleSortFilteredCourses={this.handleSortFilteredCourses}
              handleSortCourses={this.handleSortCourses}
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
  history: PropTypes.object.isRequired,
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
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      filterCoursesByGlobal: bindActionCreators(
        courseActions.filterCoursesByGlobal,
        dispatch
      ),
      sortCourses: bindActionCreators(courseActions.sortCourses, dispatch),
      sortFilteredCourses: bindActionCreators(
        courseActions.sortFilteredCourses,
        dispatch
      ),
    },
  };
}

/**connect returns a function, that function then calls our component.
 * when we omit mapDispatchToProps, our component gets a dispatch prop
 * injected automatically.
 */
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
