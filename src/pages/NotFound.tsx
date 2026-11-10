import { Link } from 'react-router-dom';
import PageTransition from './PageTransition';

export default function NotFound() {
  return (
    <PageTransition className="not-found">
      <h1>404</h1>
      <p>This page drifted off into space.</p>
      <Link to="/" className="btn btn--primary">
        Back home
      </Link>
    </PageTransition>
  );
}
