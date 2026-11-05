import { Bell, Search } from 'lucide-react';

interface Props {
  activePage: string;
}

export default function Navbar({ activePage }: Props) {
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

        <div className="avatar">AD</div>
      </div>
    </header>
  );
}
