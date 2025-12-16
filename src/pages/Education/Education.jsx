// import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
import styles from "./Education.module.css";
import CollapsibleSection from "../../components/CollapsibleSection/CollapsibleSection";

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
        {Object.entries(courses).map(([id, course]) => {
          const topics = Array.isArray(course.topics) ? course.topics : [];
          return (
            <div key={id} className={styles.courseCard}>
              <CollapsibleSection
                title={<span className={styles.courseTitle}>{course.name}</span>}
                defaultOpen={false}
              >
                <a
                  className={styles.courseLink}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${course.name} original page`}
                >
                  View Course
                </a>
                <div className={styles.courseTopics}>
                  {topics.length > 0 ? (
                    <ul>
                      {topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No structured topics available yet.</p>
                  )}
                </div>
              </CollapsibleSection>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <h1>Education</h1>
      <h2>Bachelor&apos;s in Computer Science - FCUP</h2>

      {/* Course List */}
      <div>{courseList()}</div>
    </div>
  );
}
