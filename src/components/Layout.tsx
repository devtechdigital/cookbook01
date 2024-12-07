import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, Library, Menu, X, LogOut } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from './ThemeProvider';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { settings } = useSettings();
  const { theme } = useTheme();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/', icon: BookOpen },
    { name: 'Add Recipe', href: '/add-recipe', icon: PlusCircle },
    { name: 'Recipes', href: '/recipes', icon: Library },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 bg-white/80 backdrop-blur-lg border-r`}
      >
        <div className="p-6">
          {/* User Profile Section */}
          {user && (
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-xl font-semibold">{settings.name}</h1>
          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? theme === 'warm'
                          ? 'bg-amber-100 text-amber-900'
                          : theme === 'cool'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-100 text-gray-900'
                        : 'hover:bg-opacity-50 hover:bg-gray-100'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
              icon={LogOut}
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen p-6">{children}</main>
    </div>
  );
}