
import { useEffect, useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface Course {
  course_name: string;
  instructor_name: string;
  total_feedback: number;
  average_rating: number;
}

function CourseAnalytics() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/analytics/courses`);

        if (!response.ok) {
          throw new Error('Could not load course analytics.');
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
