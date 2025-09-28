// import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
import styles from "./Education.module.css";

// Simple Education component inspired by ProjectsList structure.
// Fetches courses data directly (no props) from public/data/fcup/courses.json
// and provides a minimal search over course name and program content.
export default function Education() {
  const [courses, setCourses] = useState({});

  const fetchFcupData = async () => {
    const FCUP_COURSES_FILE_PATH = "/data/fcup/courses.json";
    try {
      const response = await fetch(FCUP_COURSES_FILE_PATH);
      setCourses(await response.json());
    } catch (error) {
      console.error(`Error fetching courses.json: ${error}`);
      return null;
    }
  };

  useEffect(() => {
    fetchFcupData();
  }, []);

  const courseList = () => {
    if (Object.keys(courses).length === 0) {
      return <p>Loading courses...</p>;
    }

    return (
      <div>
        {Object.entries(courses).map(([id, course]) => (
          <div key={id} className={styles.courseCard}>
            <h3 className={styles.courseName}>{course.name}</h3>
            <a
              className={styles.courseLink}
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${course.name} original page`}
            >
              View Course
            </a>
            <p>{course.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Education</h1>
      <h2>Bachelor&apos;s in Computer Science - FCUP</h2>

      {/* Filters */}

      {/* Course List */}
      <div>{courseList()}</div>
    </div>
  );
}
