import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  ChartNoAxesCombined,
  Lightbulb,
  FileText,
  Settings,
  GraduationCap,
  LogOut,
  Users,
  type LucideIcon,
} from 'lucide-react';

interface Props {
  activePage: string;
  setActivePage: (page: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

const menu: Array<{ name: string; icon: LucideIcon; roles: readonly string[] }> = [
  { name: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
  { name: 'Feedback', icon: MessageSquare, roles: ['student'] },
  { name: 'Course Analytics', icon: BookOpen, roles: ['admin', 'faculty'] },
  { name: 'Sentiment Analysis', icon: ChartNoAxesCombined, roles: ['admin', 'faculty'] },
  { name: 'Topic Insights', icon: GraduationCap, roles: ['admin', 'faculty'] },
  { name: 'Recommendations', icon: Lightbulb, roles: ['admin', 'faculty'] },
  { name: 'Reports', icon: FileText, roles: ['admin', 'faculty'] },
  { name: 'User Management', icon: Users, roles: ['admin'] },
];

export default function Sidebar({
  activePage,
  setActivePage,
  user,
  onLogout,
}: Props) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const visibleMenu = menu.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap />
        </div>
        <div>
          <h2>InsightEd</h2>
          <span>ACADEMIC INTELLIGENCE</span>
        </div>
      </div>

      <p className="menu-label">WORKSPACE</p>

      <nav>
        {visibleMenu.map(({ name, icon: Icon }) => (
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
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>

        <button className="nav-item" onClick={onLogout}>
          <LogOut size={19} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
