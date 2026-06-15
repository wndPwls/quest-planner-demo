import { NavLink } from 'react-router-dom';
import { HomeIcon, TargetIcon, CharacterIcon, CalendarIcon, UserIcon, UsersIcon } from './Icons';
import './Nav.css';

const navItems = [
  { to: '/', label: '홈', Icon: HomeIcon },
  { to: '/goals', label: '계획', Icon: TargetIcon },
  { to: '/community', label: '커뮤니티', Icon: UsersIcon },
  { to: '/character', label: '캐릭터', Icon: CharacterIcon },
  { to: '/calendar', label: '캘린더', Icon: CalendarIcon },
  { to: '/myinfo', label: '내 정보', Icon: UserIcon },
];

export default function Nav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={22} />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
