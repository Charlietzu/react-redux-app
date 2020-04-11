import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

class CoursesPage extends React.Component {
  state = {
    course: {
      title: "",
    },
  };
  /** arrow functions don't use the "this" keyword, so the "this" keyword that we are using
   * references our class instance.
   */
  handleChange = (event) => {
    const course = { ...this.state.course, title: event.target.value };
    this.setState({ course });
  };

  handleSubmit = (event) => {
    //prevent the form from posting back to the server
    event.preventDefault();
    /**we don't need to call dispatch here since that's being handled in
     * mapDispatchToProps.
     */
    this.props.actions.createCourse(this.state.course);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Courses</h2>
        <input
          text="text"
          onChange={this.handleChange}
          value={this.state.course.title}
        />
        <input type="submit" value="Save" />
        {this.props.courses.map((course) => (
          <div key={course.title}>{course.title}</div>
        ))}
      </form>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

/**mapStateToProps determines what state is passed to our component via props */
function mapStateToProps(state) {
  return {
    courses: state.courses,
  };
}
/**mapDispatchToProps let us declare what actions to pass to our component on props */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch),
  };
}

/**connect returns a function, that function then calls our component.
 * when we omit mapDispatchToProps, our component gets a dispatch prop
 * injected automatically.
 */
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
