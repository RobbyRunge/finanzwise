import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    const baseClass = 'px-4 py-2 rounded-lg transition-colors';
    return isActive(path)
      ? `${baseClass} bg-blue-600 text-white`
      : `${baseClass} text-gray-700 hover:bg-gray-200`;
  };

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            💰 FinanzWise
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link to="/" className={navLinkClass('/')}>
              Dashboard
            </Link>
            <Link to="/users" className={navLinkClass('/users')}>
              Users
            </Link>
            <Link to="/accounts" className={navLinkClass('/accounts')}>
              Accounts
            </Link>
            <Link to="/transactions" className={navLinkClass('/transactions')}>
              Transactions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
