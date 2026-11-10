import { Link } from 'react-router-dom';
import { profile } from '../data/profile';

/** Circular initials mark. Swap the inner span for an <img> once a logo file exists. */
export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${profile.name} — home`}>
      <span className="logo__mark">{profile.initials}</span>
    </Link>
  );
}
