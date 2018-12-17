import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as courseActions from "../../actions/courseActions";
import CourseList from "./CourseList";
import { coursePropType } from "../propTypes";
import Spinner from "../common/Spinner";
import { getCoursesSorted } from "../../reducers/courseReducer";
import { toast } from "react-toastify";

function CoursesPage({ actions, loading, courses }) {
  const [redirectToAddCoursePage, setRedirectToAddCoursePage] = useState(false);

  useEffect(() => {
    if (courses.length === 0) actions.loadCourses();
  }, []);

  function handleDeleteCourse(course) {
    // Since optimistically deleting, can consider showing success message immediately.
    // There's a tradeoff here though. If the delete ultimately fails, then the user will see a subsequent error message a moment later.
    toast.success("Course deleted");
    actions.deleteCourse(course, response => {
      if (response.error) return toast.error(response.error);
      // toast.success("Course deleted");
    });
  }

  return (
    <>
      {redirectToAddCoursePage && <Redirect to="/course" />}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h2>Courses</h2>

          <button
            className="btn btn-primary add-course"
            onClick={() => setRedirectToAddCoursePage(true)}
          >
            Add Course
          </button>

          <CourseList courses={courses} onDeleteClick={handleDeleteCourse} />
        </>
      )}
    </>
  );
}

CoursesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  courses: PropTypes.arrayOf(coursePropType).isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    courses: getCoursesSorted(state.courses),
    loading: state.ajaxCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPage);
