
import { useEffect, useState } from 'react';

import { getAllFeedback, type FeedbackResponse } from '../services/api';

type Feedback = FeedbackResponse & {
  sentiment?: string | null;
};

function Recommendations({ token }: { token?: string }) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getAllFeedback(token);
        setFeedback(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const groups = Object.values(
    feedback.reduce<Record<string, {
      course_name: string;
      instructor_name: string;
      ratings: number[];
      comments: string[];
      negativeCount: number;
    }>>((result, item) => {
      const key = `${item.course_name}-${item.instructor_name}`;

      if (!result[key]) {
        result[key] = {
          course_name: item.course_name,
          instructor_name: item.instructor_name,
          ratings: [],
          comments: [],
          negativeCount: 0,
        };
      }

      result[key].ratings.push(Number(item.rating));
      result[key].comments.push(item.comment);

      if (item.sentiment?.toLowerCase() === 'negative') {
        result[key].negativeCount += 1;
      }

      return result;
    }, {})
  );

  const recommendations = groups.map((course) => {
    const average =
      course.ratings.reduce((sum, rating) => sum + rating, 0) /
      course.ratings.length;

    const suggestions: string[] = [];

    if (average < 3) {
      suggestions.push(
        'Review the course structure and provide additional student support.'
      );
    } else if (average < 4) {
      suggestions.push(
        'Identify challenging topics and collect more detailed student feedback.'
      );
    } else {
      suggestions.push(
        'Maintain the current teaching approach and continue collecting feedback.'
      );
    }

    if (course.negativeCount > 0) {
      suggestions.push(
        'Review negative comments and address the concerns raised by students.'
      );
    }

    if (course.comments.length >= 2) {
      suggestions.push(
        'Look for recurring themes in student comments to identify improvements.'
      );
    }

    return { ...course, average, suggestions };
  });

  if (loading) return <div className="panel">Generating recommendations...</div>;

  return (
    <div>
      <div className="section-heading">
        <div>
          <h1>Recommendations</h1>
          <p>Practical suggestions based on student feedback.</p>
        </div>
      </div>

      {error && <div className="panel">{error}</div>}

      <div className="stats-grid">
        <div className="panel">
          <h3>Courses Analyzed</h3>
          <h2>{groups.length}</h2>
        </div>
        <div className="panel">
          <h3>Feedback Reviewed</h3>
          <h2>{feedback.length}</h2>
        </div>
        <div className="panel">
          <h3>Courses Needing Attention</h3>
          <h2>{recommendations.filter((item) => item.average < 3).length}</h2>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="panel">
          <h2>No recommendations yet</h2>
          <p>Submit student feedback to generate recommendations.</p>
        </div>
      ) : (
        recommendations.map((course, index) => (
          <div className="panel" key={`${course.course_name}-${course.instructor_name}-${index}`}>
            <div className="panel-heading">
              <h2>{course.course_name}</h2>
              <span>{course.average.toFixed(1)} / 5</span>
            </div>

            <p>Instructor: {course.instructor_name}</p>
            <p>Feedback entries: {course.ratings.length}</p>

            <h3>Suggested Actions</h3>
            <ul>
              {course.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        ))
      )}

      <div className="panel">
        <p>
          These recommendations are generated using feedback ratings and
          sentiment counts. They are rule-based suggestions, not AI-generated
          predictions.
        </p>
      </div>
    </div>
  );
}

export default Recommendations;
