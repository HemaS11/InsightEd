
import { useEffect, useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface Feedback {
  id: number;
  course_name: string;
  instructor_name: string;
  rating: number;
  comment: string;
  sentiment?: string;
}

const topics = [
  {
    name: 'Teaching Quality',
    keywords: ['teaching', 'teacher', 'instructor', 'explain', 'explained', 'clarity'],
  },
  {
    name: 'Course Content',
    keywords: ['syllabus', 'content', 'topic', 'theory', 'concept', 'curriculum'],
  },
  {
    name: 'Practical Learning',
    keywords: ['practical', 'lab', 'project', 'hands-on', 'coding', 'assignment'],
  },
  {
    name: 'Course Pace',
    keywords: ['fast', 'slow', 'pace', 'time', 'duration', 'schedule'],
  },
  {
    name: 'Learning Resources',
    keywords: ['notes', 'material', 'resources', 'slides', 'books', 'reference'],
  },
];

function TopicInsights() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/feedback`);

        if (!response.ok) {
          throw new Error('Could not load feedback.');
        }

        const result = await response.json();
        setFeedback(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const topicCounts = topics.map((topic) => {
    const matchingFeedback = feedback.filter((item) => {
      const comment = item.comment.toLowerCase();
      return topic.keywords.some((keyword) => comment.includes(keyword));
    });

    return {
      name: topic.name,
      count: matchingFeedback.length,
      comments: matchingFeedback.map((item) => item.comment),
    };
  });

  const topicsFound = topicCounts.filter((topic) => topic.count > 0);

  if (loading) {
    return <div className="panel">Analyzing feedback topics...</div>;
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <h1>Topic Insights</h1>
          <p>Discover recurring themes in student feedback.</p>
        </div>
      </div>

      {error && <div className="panel">{error}</div>}

      <div className="stats-grid">
        <div className="panel">
          <h3>Total Comments Analyzed</h3>
          <h2>{feedback.length}</h2>
        </div>

        <div className="panel">
          <h3>Topics Identified</h3>
          <h2>{topicsFound.length}</h2>
        </div>

        <div className="panel">
          <h3>Courses Covered</h3>
          <h2>{new Set(feedback.map((item) => item.course_name)).size}</h2>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Common Feedback Topics</h2>
        </div>

        {feedback.length === 0 ? (
          <p>No student comments are available yet.</p>
        ) : topicsFound.length === 0 ? (
          <p>
            No matching topics were found. More detailed student comments
            may help identify common themes.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {topicsFound
              .sort((a, b) => b.count - a.count)
              .map((topic) => (
                <div key={topic.name}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <strong>{topic.name}</strong>
                    <span>{topic.count} matching comments</span>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: '#F0E9E1',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(topic.count / feedback.length) * 100}%`,
                        height: '100%',
                        background: '#C8792C',
                        borderRadius: 20,
                      }}
                    />
                  </div>

                  {topic.comments.map((comment, index) => (
                    <p key={index} style={{ marginTop: 8, fontSize: 14 }}>
                      “{comment}”
                    </p>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="panel">
        <h2>How topic analysis works</h2>
        <p>
          Student comments are grouped using predefined keywords related
          to teaching quality, course content, practical learning, course
          pace and learning resources. A comment may match more than one
          topic.
        </p>
      </div>
    </div>
  );
}

export default TopicInsights;
