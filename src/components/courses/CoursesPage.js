import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";

class CoursesPage extends React.Component {
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

  render() {
    return (
      <>
        <h2>Courses</h2>
        <CourseList courses={this.props.courses} />
      </>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
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
  };
}
/**mapDispatchToProps let us declare what actions to pass to our component on props */
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
    },
  };
}

/**connect returns a function, that function then calls our component.
 * when we omit mapDispatchToProps, our component gets a dispatch prop
 * injected automatically.
 */
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
