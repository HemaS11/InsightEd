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

const sentimentData = [
  { name: 'Positive', value: 68, color: '#C8792C' },
  { name: 'Neutral', value: 20, color: '#F4D9A0' },
  { name: 'Negative', value: 12, color: '#5B4632' },
];

const courseData = [
  { name: 'Data Science', rating: 4.8 },
  { name: 'DBMS', rating: 4.5 },
  { name: 'Networks', rating: 4.2 },
  { name: 'Java', rating: 3.9 },
  { name: 'AI/ML', rating: 4.6 },
];

const trendData = [
  { month: 'Aug', feedback: 40 },
  { month: 'Sep', feedback: 55 },
  { month: 'Oct', feedback: 48 },
  { month: 'Nov', feedback: 72 },
  { month: 'Dec', feedback: 85 },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <span className="eyebrow">ACADEMIC OVERVIEW · 2026</span>
          <h1>Good morning, Admin.</h1>
          <p>Here's what's happening across your academic ecosystem.</p>
        </div>

        <button className="semester-button">Semester 5</button>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Total Feedback"
          value="1,248"
          change="+12.8%"
          description="Compared to last semester"
          icon={<MessageSquare />}
        />

        <StatCard
          title="Average Rating"
          value="4.2/5"
          change="+0.4"
          description="Rating improvement"
          icon={<Star />}
        />

        <StatCard
          title="Positive Sentiment"
          value="68%"
          change="+8.2%"
          description="Compared to last semester"
          icon={<TrendingUp />}
        />

        <StatCard
          title="Courses to Review"
          value="06"
          change="Attention"
          description="Require improvement"
          icon={<AlertTriangle />}
          warning
        />
      </section>

      <div className="section-heading">
        <div>
          <h2>Performance overview</h2>
          <p>Understand student satisfaction at a glance.</p>
        </div>

        <button className="text-button">
          View analytics <ArrowUpRight size={16} />
        </button>
      </div>

      <section className="charts-grid">
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
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  stroke="none"
                >
                  {sentimentData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>68%</strong>
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

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Course performance</h3>
              <p>Average student ratings</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={285}>
            <BarChart
              data={courseData}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
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
              <Tooltip />
              <Bar
                dataKey="rating"
                fill="#C8792C"
                radius={[6, 6, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Feedback activity</h3>
              <p>Monthly feedback submissions</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#EEE5D8"
              />
              <XAxis dataKey="month" />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="feedback"
                stroke="#C8792C"
                strokeWidth={3}
                dot={{ fill: '#5B4632', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel insight-panel">
          <div className="insight-icon">
            <Lightbulb />
          </div>

          <span className="eyebrow">AI POWERED INSIGHT</span>

          <h3>What students are saying</h3>

          <p>
            Students appreciate teaching quality, but assignment workload is
            emerging as a recurring concern.
          </p>

          <button className="insight-button">
            Explore insights <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <footer className="dashboard-footer">
        InsightEd · Turning student voices into smarter education.
      </footer>
    </div>
  );
}
