import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CourseList = ({
  courses,
  onDeleteClick,
  handleSortCourses,
  filtered,
  handleSortFilteredCourses,
}) => (
  /**i could declarate this component using (props) instead of ({ courses })
   * and then putting here the line below:
   * const { courses } = props;
   * i would have the same results
   */
  <table className="table">
    <thead>
      <tr>
        <th />
        <th>
          <span
            id="title"
            onClick={(e) =>
              filtered ? handleSortFilteredCourses(e) : handleSortCourses(e)
            }
          >
            Title
          </span>
        </th>
        <th>Author</th>
        <th>
          <span
            id="category"
            onClick={(e) =>
              filtered ? handleSortFilteredCourses(e) : handleSortCourses(e)
            }
          >
            Category
          </span>
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      {courses.map((course) => {
        return (
          <tr key={course.id}>
            <td>
              <a
                className="btn btn-light"
                href={"http://pluralsight.com/courses/" + course.slug}
              >
                Watch
              </a>
            </td>
            <td>
              <Link to={"/course/" + course.slug}>{course.title}</Link>
            </td>
            <td>{course.authorName}</td>
            <td>{course.category}</td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDeleteClick(course)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  handleSortCourses: PropTypes.func.isRequired,
  handleSortFilteredCourses: PropTypes.func.isRequired,
  filtered: PropTypes.bool.isRequired,
};

export default CourseList;
