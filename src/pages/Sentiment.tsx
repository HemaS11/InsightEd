
import { useEffect, useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface SentimentData {
  course_name: string;
  instructor_name: string;
  positive: number;
  negative: number;
  neutral: number;
}

function Sentiment() {
  const [data, setData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/analytics/sentiment`);

        if (!response.ok) {
          throw new Error('Could not load sentiment data.');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, []);

  const positive = data.reduce((sum, item) => sum + item.positive, 0);
  const negative = data.reduce((sum, item) => sum + item.negative, 0);
  const neutral = data.reduce((sum, item) => sum + item.neutral, 0);
  const total = positive + negative + neutral;

  const percentage = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  if (loading) {
    return <div className="panel">Loading sentiment analysis...</div>;
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <h1>Sentiment Analysis</h1>
          <p>Understand how students feel about their courses.</p>
        </div>
      </div>

      {error && <div className="panel">{error}</div>}

      <div className="stats-grid">
        <div className="panel">
          <h3>Positive Feedback</h3>
          <h2>{positive}</h2>
          <p>{percentage(positive)}% of total feedback</p>
        </div>

        <div className="panel">
          <h3>Neutral Feedback</h3>
          <h2>{neutral}</h2>
          <p>{percentage(neutral)}% of total feedback</p>
        </div>

        <div className="panel">
          <h3>Negative Feedback</h3>
          <h2>{negative}</h2>
          <p>{percentage(negative)}% of total feedback</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Overall Sentiment Distribution</h2>
        </div>

        {total === 0 ? (
          <p>No sentiment data is available yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Positive', value: positive, color: '#5D9870' },
              { label: 'Neutral', value: neutral, color: '#D6A34A' },
              { label: 'Negative', value: negative, color: '#C96C5D' },
            ].map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <strong>{item.label}</strong>
                  <span>
                    {item.value} ({percentage(item.value)}%)
                  </span>
                </div>

                <div
                  style={{
                    height: 12,
                    background: '#F0E9E1',
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage(item.value)}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: 20,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Course-wise Sentiment</h2>
        </div>

        {data.length === 0 ? (
          <p>No course sentiment data is available yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Course</th>
                  <th align="left">Instructor</th>
                  <th align="center">Positive</th>
                  <th align="center">Neutral</th>
                  <th align="center">Negative</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={`${item.course_name}-${item.instructor_name}-${index}`}
                  >
                    <td>{item.course_name}</td>
                    <td>{item.instructor_name}</td>
                    <td align="center">{item.positive}</td>
                    <td align="center">{item.neutral}</td>
                    <td align="center">{item.negative}</td>
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

export default Sentiment;
