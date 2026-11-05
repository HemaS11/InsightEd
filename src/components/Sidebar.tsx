import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  ChartNoAxesCombined,
  Lightbulb,
  FileText,
  Settings,
  GraduationCap,
} from 'lucide-react';

interface Props {
  activePage: string;
  setActivePage: (page: string) => void;
}

const menu = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Feedback', icon: MessageSquare },
  { name: 'Course Analytics', icon: BookOpen },
  { name: 'Sentiment Analysis', icon: ChartNoAxesCombined },
  { name: 'Topic Insights', icon: GraduationCap },
  { name: 'Recommendations', icon: Lightbulb },
  { name: 'Reports', icon: FileText },
];

export default function Sidebar({ activePage, setActivePage }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><GraduationCap /></div>
        <div>
          <h2>InsightEd</h2>
          <span>ACADEMIC INTELLIGENCE</span>
        </div>
      </div>

      <p className="menu-label">WORKSPACE</p>

      <nav>
        {menu.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`nav-item ${activePage === name ? 'active' : ''}`}
            onClick={() => setActivePage(name)}
          >
            <Icon size={19} />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings size={19} />
          Settings
        </button>
        <div className="profile">
          <div className="avatar">AD</div>
          <div>
            <strong>Administrator</strong>
            <span>College Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
