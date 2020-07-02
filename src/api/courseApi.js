import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/courses/";
const auxUrl = process.env.API_URL + "/courses";

export function getCourses() {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export function filterCoursesByGlobal(searchTerm) {
  return fetch(auxUrl + "?q=" + searchTerm)
    .then(handleResponse)
    .catch(handleError);
}

export function filterCoursesByAuthor(authorId) {
  return fetch(auxUrl + "?authorId=" + authorId)
    .then(handleResponse)
    .catch(handleError);
}

export function sortCourses(field, order) {
  return fetch(auxUrl + "?_sort=" + field + "&_order=" + order)
    .then(handleResponse)
    .catch(handleError);
}

export function sortFilteredCourses(searchTerm, field, order) {
  return fetch(
    auxUrl + "?q=" + searchTerm + "&_sort=" + field + "&_order=" + order
  )
    .then(handleResponse)
    .catch(handleError);
}

export function saveCourse(course) {
  return fetch(baseUrl + (course.id || ""), {
    method: course.id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
    headers: { "content-type": "application/json" },
    body: JSON.stringify(course),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteCourse(courseId) {
  return fetch(baseUrl + courseId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}
