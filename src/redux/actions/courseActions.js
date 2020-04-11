export function createCourse(course) {
  //"course" is equal to "course: course", this is called object shorthand syntax
  return { type: "CREATE_COURSE", course };
}
