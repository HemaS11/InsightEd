
import { useEffect, useMemo, useState } from 'react';

import {
  MessageSquare,
  Star,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

import StatCard from '../components/StatCard';

import {
  getAnalytics,
  getCourseAnalytics,
  getSentimentAnalytics,
  type AnalyticsData,
  type CourseAnalytics,
  type SentimentAnalytics,
} from '../services/api';

// Chart colors
const COLORS = {
  positive: '#C8792C',
  neutral: '#F4D9A0',
  negative: '#5B4632',
};

export default function Dashboard() {
  // Backend data
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const [courses, setCourses] = useState<CourseAnalytics[]>([]);

  const [sentiments, setSentiments] = useState<SentimentAnalytics[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  // Fetch analytics from backend
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError('');

        const [
          analyticsResult,
          coursesResult,
          sentimentResult,
        ] = await Promise.all([
          getAnalytics(),
          getCourseAnalytics(),
          getSentimentAnalytics(),
        ]);

        setAnalytics(analyticsResult);
        setCourses(coursesResult);
        setSentiments(sentimentResult);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Calculate sentiment distribution
  const sentimentData = useMemo(() => {
    const totals = sentiments.reduce(
      (acc, item) => {
        acc.positive += item.positive || 0;
        acc.neutral += item.neutral || 0;
        acc.negative += item.negative || 0;

        return acc;
      },
      {
        positive: 0,
        neutral: 0,
        negative: 0,
      }
    );

    const total =
      totals.positive + totals.neutral + totals.negative;

    return [
      {
        name: 'Positive',
        value: total
          ? Math.round((totals.positive / total) * 100)
          : 0,
        color: COLORS.positive,
      },
      {
        name: 'Neutral',
        value: total
          ? Math.round((totals.neutral / total) * 100)
          : 0,
        color: COLORS.neutral,
      },
      {
        name: 'Negative',
        value: total
          ? Math.round((totals.negative / total) * 100)
          : 0,
        color: COLORS.negative,
      },
    ];
  }, [sentiments]);

  // Combine instructor-level results into course-level results
  const courseData = useMemo(() => {
    const grouped: Record<
      string,
      {
        name: string;
        totalFeedback: number;
        weightedRating: number;
      }
    > = {};

    courses.forEach((course) => {
      const name = course.course_name;

      if (!grouped[name]) {
        grouped[name] = {
          name,
          totalFeedback: 0,
          weightedRating: 0,
        };
      }

      grouped[name].totalFeedback += course.total_feedback;

      grouped[name].weightedRating +=
        course.average_rating * course.total_feedback;
    });

    return Object.values(grouped).map((course) => ({
      name: course.name,
      rating: course.totalFeedback
        ? Number(
            (course.weightedRating / course.totalFeedback).toFixed(2)
          )
        : 0,
      feedback: course.totalFeedback,
    }));
  }, [courses]);

  // Courses requiring attention: average rating below 3.5
  const coursesToReview = courseData.filter(
    (course) => course.rating < 3.5
  ).length;

  // Feedback volume by course
  const activityData = [...courseData].sort(
    (a, b) => b.feedback - a.feedback
  );

  // Dynamic positive sentiment percentage
  const positivePercentage = sentimentData[0].value;

  // Dynamic insight
  const insight = useMemo(() => {
    if (!analytics || analytics.total_feedback === 0) {
      return 'No feedback has been submitted yet. Submit course feedback to start generating useful academic insights.';
    }

    if (positivePercentage >= 70) {
      return 'Students are responding positively overall. Continue monitoring course feedback to maintain teaching quality.';
    }

    if (positivePercentage >= 40) {
      return 'Student satisfaction is mixed. Review course ratings and sentiment to identify areas that need improvement.';
    }

    return 'Negative feedback is significant. Review course performance and student comments to identify teaching and curriculum improvements.';
  }, [analytics, positivePercentage]);

  // Loading screen
  if (loading) {
    return (
      <div className="dashboard">
        <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Loading dashboard...</h2>
          <p>Fetching your academic analytics.</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="dashboard">
        <div className="panel" style={{ padding: '30px' }}>
          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <button
            className="submit-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalFeedback = analytics?.total_feedback ?? 0;

  const averageRating = analytics?.average_rating ?? 0;

  return (
    <div className="dashboard">

      {/* Welcome section */}
      <section className="welcome-section">
        <div>
          <span className="eyebrow">
            ACADEMIC OVERVIEW · 2026
          </span>

          <h1>Good morning, Admin.</h1>

          <p>
            Here's what's happening across your academic ecosystem.
          </p>
        </div>

        <button className="semester-button">
          Semester 5
        </button>
      </section>


      {/* Statistics cards */}
      <section className="stats-grid">

        <StatCard
          title="Total Feedback"
          value={totalFeedback.toLocaleString()}
          change="Live"
          description="Total submitted responses"
          icon={<MessageSquare />}
        />

        <StatCard
          title="Average Rating"
          value={`${averageRating.toFixed(1)}/5`}
          change="Live"
          description="Average student rating"
          icon={<Star />}
        />

        <StatCard
          title="Positive Sentiment"
          value={`${positivePercentage}%`}
          change="Live"
          description="Positive student responses"
          icon={<TrendingUp />}
        />

        <StatCard
          title="Courses to Review"
          value={String(coursesToReview).padStart(2, '0')}
          change="Attention"
          description="Courses rated below 3.5"
          icon={<AlertTriangle />}
          warning
        />

      </section>


      {/* Performance heading */}
      <div className="section-heading">
        <div>
          <h2>Performance overview</h2>

          <p>
            Understand student satisfaction at a glance.
          </p>
        </div>

        <button
          className="text-button"
          onClick={() => {
            window.location.href = '/course-analytics';
          }}
        >
          View analytics <ArrowUpRight size={16} />
        </button>
      </div>


      {/* Main charts */}
      <section className="charts-grid">

        {/* Sentiment distribution */}
        <div className="panel">

          <div className="panel-heading">
            <div>
              <h3>Sentiment distribution</h3>

              <p>Student opinion breakdown</p>
            </div>
          </div>

          <div className="donut-container">

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>

                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  stroke="none"
                >
                  {sentimentData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />

              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>{positivePercentage}%</strong>

              <span>Positive</span>
            </div>

          </div>

          <div className="legend">

            {sentimentData.map((item) => (
              <div key={item.name}>

                <span>
                  <i style={{ background: item.color }} />

                  {item.name}
                </span>

                <strong>{item.value}%</strong>

              </div>
            ))}

          </div>

        </div>


        {/* Course performance */}
        <div className="panel">

          <div className="panel-heading">
            <div>
              <h3>Course performance</h3>

              <p>Average student ratings</p>
            </div>
          </div>

          {courseData.length > 0 ? (

            <ResponsiveContainer width="100%" height={285}>
              <BarChart
                data={courseData}
                margin={{
                  top: 20,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#EEE5D8"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}/5`,
                    'Average rating',
                  ]}
                />

                <Bar
                  dataKey="rating"
                  fill="#C8792C"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />

              </BarChart>
            </ResponsiveContainer>

          ) : (
            <p>No course data available yet.</p>
          )}

        </div>

      </section>


      {/* Bottom charts and insights */}
      <section className="bottom-grid">

        {/* Feedback activity */}
        <div className="panel">

          <div className="panel-heading">
            <div>
              <h3>Feedback activity</h3>

              <p>Feedback submissions by course</p>
            </div>
          </div>

          {activityData.length > 0 ? (

            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={activityData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#EEE5D8"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip
                  formatter={(value) => [
                    value,
                    'Feedback submissions',
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="feedback"
                  stroke="#C8792C"
                  strokeWidth={3}
                  dot={{
                    fill: '#5B4632',
                    r: 4,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          ) : (
            <p>No feedback activity available yet.</p>
          )}

        </div>


        {/* Dynamic insight */}
        <div className="panel insight-panel">

          <div className="insight-icon">
            <Lightbulb />
          </div>

          <span className="eyebrow">
            FEEDBACK INSIGHT
          </span>

          <h3>What students are saying</h3>

          <p>{insight}</p>

          <button
            className="insight-button"
            onClick={() => {
              window.location.href = '/sentiment';
            }}
          >
            Explore insights <ArrowUpRight size={16} />
          </button>

        </div>

      </section>


      {/* Footer */}
      <footer className="dashboard-footer">
        InsightEd · Turning student voices into smarter education.
      </footer>

    </div>
  );
}
