import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import AuthorForm from "./AuthorForm";
import { newAuthor } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

export function ManageAuthorPage({
  authors,
  loadAuthors,
  saveAuthor,
  history,
  ...props
}) {
  const [author, setAuthor] = useState({ ...props.author });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authors.length === 0) {
      loadAuthors().catch((error) => {
        alert("Loading authors failed" + error);
      });
    } else {
      setAuthor({ ...props.author });
    }
  }, [props.author]);

  //TODO
  function handleChange({ target }) {
    setAuthor({
      ...author,
      [target.name]: target.value,
    });
  }

  function formIsValid() {
    const { name } = author;
    const errors = {};

    if (!name) errors.name = "Name is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    saveAuthor(author)
      .then(() => {
        toast.success("Author saved.");
        history.push("/authors");
      })
      .catch((error) => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  return authors.length === 0 ? (
    <Spinner />
  ) : (
    <AuthorForm
      author={author}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManageAuthorPage.propTypes = {
  author: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveAuthor: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export function getAuthorById(authors, id) {
  return authors.find((author) => author.id === id) || null;
}

function mapStateToProps(state, ownProps) {
  const id = parseInt(ownProps.match.params.id, 10);

  const author =
    id && state.authors.length > 0
      ? getAuthorById(state.authors, id)
      : newAuthor;

  return {
    author,
    authors: state.authors,
  };
}

const mapDispatchToProps = {
  loadAuthors: authorActions.loadAuthors,
  saveAuthor: authorActions.saveAuthor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthorPage);
