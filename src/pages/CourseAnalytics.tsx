
import { useEffect, useState } from 'react';

interface Course {
  course_name: string;
  instructor_name: string;
  total_feedback: number;
  average_rating: number;
}

import { getCourseAnalytics } from '../services/api';

function CourseAnalytics({ token }: { token?: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourseAnalytics(token);
        setCourses(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const totalFeedback = courses.reduce(
    (total, course) => total + course.total_feedback,
    0
  );

  const averageRating =
    courses.length > 0
      ? courses.reduce(
          (total, course) =>
            total + course.average_rating * course.total_feedback,
          0
        ) / (totalFeedback || 1)
      : 0;

  if (loading) {
    return <div className="panel">Loading course analytics...</div>;
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <h1>Course Analytics</h1>
          <p>Understand course performance through student feedback.</p>
        </div>
      </div>

      {error && <div className="panel">{error}</div>}

      <div className="stats-grid">
        <div className="panel">
          <h3>Total Courses</h3>
          <h2>{courses.length}</h2>
        </div>

        <div className="panel">
          <h3>Total Feedback</h3>
          <h2>{totalFeedback}</h2>
        </div>

        <div className="panel">
          <h3>Overall Average Rating</h3>
          <h2>{averageRating.toFixed(1)} / 5</h2>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Course Performance</h2>
        </div>

        {courses.length === 0 ? (
          <p>No course feedback is available yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Course</th>
                  <th align="left">Instructor</th>
                  <th align="center">Feedback</th>
                  <th align="center">Average Rating</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course, index) => (
                  <tr key={`${course.course_name}-${course.instructor_name}-${index}`}>
                    <td>{course.course_name}</td>
                    <td>{course.instructor_name}</td>
                    <td align="center">{course.total_feedback}</td>
                    <td align="center">
                      {Number(course.average_rating).toFixed(1)} / 5
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseAnalytics;
