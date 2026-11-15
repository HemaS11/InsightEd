import { Bell, Search } from 'lucide-react';

interface Props {
  activePage: string;
  user: {
    name: string;
  };
}

export default function Navbar({ activePage, user }: Props) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="breadcrumb">
        Workspace / <strong>{activePage}</strong>
      </div>

      <div className="top-actions">
        <div className="search-box">
          <Search size={17} />
          <input placeholder="Search anything..." />
        </div>

        <button className="notification">
          <Bell size={19} />
          <span />
        </button>

        <div className="avatar">{initials}</div>
      </div>
    </header>
  );
}
