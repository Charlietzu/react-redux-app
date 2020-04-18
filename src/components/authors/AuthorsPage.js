import React from "react";
import { connect } from "react-redux";
import * as authorActions from "../../redux/actions/authorActions";
import * as courseActions from "../../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import AuthorList from "./AuthorList";

class AuthorsPage extends React.Component {
  state = {
    redirectToAddAuthorPage: false,
  };

  componentDidMount() {
    const { authors, courses, actions } = this.props;

    if (authors.length === 0) {
      actions.loadAuthors().catch((error) => {
        alert("Loading authors failed" + error);
      });
    }

    if (courses.length === 0) {
      actions.loadCourses().catch((error) => {
        alert("Loading courses failed" + error);
      });
    }
  }

  handleDeleteAuthor = async (author) => {
    toast.success("Author deleted");
    try {
      await this.props.actions.deleteAuthor(author);
    } catch (error) {
      toast.error("Delete failed" + error.message, { autoClose: false });
    }
  };

  render() {
    return (
      <>
        {this.state.redirectToAddAuthorPage && <Redirect to="/author" />}
        <h2>Authors</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-author"
              onClick={() => this.setState({ redirectToAddAuthorPage: true })}
            >
              Add Author
            </button>

            <AuthorList
              onDeleteClick={this.handleDeleteAuthor}
              authors={this.props.authors}
            />
          </>
        )}
      </>
    );
  }
}

AuthorsPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    courses: state.courses,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
