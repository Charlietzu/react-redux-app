import React from "react";

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
    alert(this.state.course.title);
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
      </form>
    );
  }
}

export default CoursesPage;
