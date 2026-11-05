import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: ReactNode;
  warning?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  description,
  icon,
  warning = false,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
        <span className={warning ? 'warning-tag' : 'change-tag'}>{change}</span>
      </div>

      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <span className="stat-description">{description}</span>
    </article>
  );
}
