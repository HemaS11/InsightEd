
import { useEffect, useState } from 'react';

import { getAllFeedback, type FeedbackResponse } from '../services/api';

type Feedback = FeedbackResponse & {
  sentiment?: string | null;
};

function Reports({ token }: { token?: string }) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getAllFeedback(token);
        setFeedback(response);
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

  const total = feedback.length;

  const averageRating =
    total > 0
      ? feedback.reduce((sum, item) => sum + Number(item.rating), 0) / total
      : 0;

  const positive = feedback.filter(
    (item) => item.sentiment?.toLowerCase() === 'positive'
  ).length;

  const negative = feedback.filter(
    (item) => item.sentiment?.toLowerCase() === 'negative'
  ).length;

  const neutral = feedback.filter(
    (item) => item.sentiment?.toLowerCase() === 'neutral'
  ).length;

  const courseCount = new Set(
    feedback.map((item) => item.course_name)
  ).size;

  const downloadReport = () => {
    const headers = [
      'ID',
      'Course',
      'Instructor',
      'Rating',
      'Sentiment',
      'Comment',
      'Date',
    ];

    const escapeCSV = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = feedback.map((item) => [
      item.id,
      item.course_name,
      item.instructor_name,
      item.rating,
      item.sentiment || 'Not available',
      item.comment,
      item.created_at || '',
    ]);

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'FeedbackIQ_Report.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="panel">Preparing your report...</div>;
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <h1>Reports</h1>
          <p>View feedback summaries and download your report.</p>
        </div>

        <button
          onClick={downloadReport}
          disabled={feedback.length === 0}
          style={{
            background: '#C8792C',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 10,
            cursor: feedback.length === 0 ? 'not-allowed' : 'pointer',
            opacity: feedback.length === 0 ? 0.5 : 1,
          }}
        >
          Download CSV Report
        </button>
      </div>

      {error && <div className="panel">{error}</div>}

      <div className="stats-grid">
        <div className="panel">
          <h3>Total Feedback</h3>
          <h2>{total}</h2>
        </div>

        <div className="panel">
          <h3>Average Rating</h3>
          <h2>{averageRating.toFixed(1)} / 5</h2>
        </div>

        <div className="panel">
          <h3>Courses Covered</h3>
          <h2>{courseCount}</h2>
        </div>
      </div>

      <div className="stats-grid">
        <div className="panel">
          <h3>Positive</h3>
          <h2>{positive}</h2>
        </div>

        <div className="panel">
          <h3>Neutral</h3>
          <h2>{neutral}</h2>
        </div>

        <div className="panel">
          <h3>Negative</h3>
          <h2>{negative}</h2>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Feedback Report</h2>
          <span>{total} records</span>
        </div>

        {feedback.length === 0 ? (
          <p>No feedback is available to include in the report.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Course</th>
                  <th align="left">Instructor</th>
                  <th align="center">Rating</th>
                  <th align="center">Sentiment</th>
                  <th align="left">Comment</th>
                </tr>
              </thead>

              <tbody>
                {feedback.map((item) => (
                  <tr key={item.id}>
                    <td>{item.course_name}</td>
                    <td>{item.instructor_name}</td>
                    <td align="center">
                      {Number(item.rating).toFixed(1)} / 5
                    </td>
                    <td align="center">
                      {item.sentiment || 'N/A'}
                    </td>
                    <td>{item.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Report Information</h2>
        <p>
          This report summarizes feedback currently stored in the
          FeedbackIQ database. Download the CSV file to save or analyze
          the records in a spreadsheet application.
        </p>
      </div>
    </div>
  );
}

export default Reports;
