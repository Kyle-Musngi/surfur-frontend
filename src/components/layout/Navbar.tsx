import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Heart, Bell, User, ChevronDown, Globe, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/pets', label: t.nav.findPet },
    { to: '/map', label: t.nav.shelterMap },
    { to: '/shelters', label: t.nav.shelters },
    { to: '/report', label: t.nav.reportStray },
    { to: '/quiz', label: t.nav.quiz },
    { to: '/guide', label: t.nav.adoptionGuide },
    { to: '/events', label: t.nav.events },
    { to: '/donate', label: t.nav.donate },
    { to: '/about', label: t.nav.about },
  ];

  return (
    <nav className="bg-white dark:bg-[#2A1A2A] border-b border-[#F1D5DF] dark:border-[#4D2E4D] sticky top-0 z-50 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/images/surfur-logo.jpg"
              alt="SurFur Logo"
              className="h-10 w-auto max-w-[42px] object-contain rounded-lg shadow-xs transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/sulfor-logo.jpeg';
              }}
            />
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-[#F4435A] dark:text-[#F48FB1] tracking-tight">Sur</span>
                <span className="text-xl font-black text-[#E94EAA] tracking-tight">Fur</span>
              </div>
              <span className="hidden sm:inline text-[9px] font-bold text-[#786875] dark:text-[#C9B8C7] tracking-wider uppercase">
                Surf for Paws, Find Your Furever Home
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 5).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#D4FFC6] text-[#352633] border border-[#bce8ad] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-transparent'
                      : 'text-[#786875] dark:text-[#C9B8C7] hover:text-[#FF81AB] dark:hover:text-[#F48FB1] hover:bg-[#FFEBF1] dark:hover:bg-[#382338]/50 border border-transparent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Dropdown for Community */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#FF81AB] dark:hover:text-[#F48FB1] hover:bg-[#FFEBF1] dark:hover:bg-[#382338]/50 flex items-center gap-1 cursor-pointer">
                Community <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-[#2A1A2A] rounded-2xl shadow-xl border border-[#F1D5DF] dark:border-[#4D2E4D] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                {navLinks.slice(5).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-xs font-semibold text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] hover:text-[#FF81AB] dark:hover:text-[#F48FB1] transition-colors"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#786875] dark:text-[#C9B8C7] hover:text-[#FF81AB] dark:hover:text-[#F48FB1] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] border border-transparent hover:border-[#F1D5DF] dark:hover:border-[#4D2E4D] transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#F48FB1]" />
              ) : (
                <Moon className="h-4 w-4 text-[#352633]" />
              )}
            </button>

            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ceb' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] hover:bg-[#FCE4EC] dark:hover:bg-[#382338] border border-transparent hover:border-[#F1D5DF] dark:hover:border-[#4D2E4D] transition-all cursor-pointer"
              title="Switch language"
            >
              <Globe className="h-3.5 w-3.5 text-[#E94EAA]" />
              <span>{lang === 'en' ? 'EN | Ceb' : 'CEB | En'}</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="p-2 rounded-xl text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] hover:bg-[#FCE4EC] dark:hover:bg-[#382338] transition-colors"
                  title={t.nav.favorites}
                >
                  <Heart className="h-4 w-4" />
                </Link>
                <Link
                  to="/notifications"
                  className="p-2 rounded-xl text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] hover:bg-[#FCE4EC] dark:hover:bg-[#382338] transition-colors"
                  title={t.nav.notifications}
                >
                  <Bell className="h-4 w-4" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-[#352633] dark:text-[#FCE4EC] bg-[#FCE4EC]/50 dark:bg-[#382338] border border-[#F1D5DF] dark:border-[#4D2E4D] hover:border-[#F4435A] dark:hover:border-[#F48FB1] transition-all cursor-pointer">
                    <User className="h-3.5 w-3.5 text-[#F4435A] dark:text-[#F48FB1]" />
                    <span className="max-w-24 truncate">{user?.full_name?.split(' ')[0]}</span>
                    <ChevronDown className="h-3 w-3 text-[#786875]" />
                  </button>
                  <div className="absolute top-full right-0 mt-1.5 w-52 bg-white dark:bg-[#2A1A2A] rounded-2xl shadow-xl border border-[#F1D5DF] dark:border-[#4D2E4D] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#F1D5DF] dark:border-[#4D2E4D] text-xs">
                      <p className="font-bold text-[#352633] dark:text-[#FCE4EC] truncate">{user?.full_name}</p>
                      <p className="text-[#786875] dark:text-[#C9B8C7] truncate text-[11px]">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-xs font-semibold text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FCE4EC] dark:hover:bg-[#382338]"
                    >
                      {t.nav.profile}
                    </Link>
                    <Link
                      to="/inquiries"
                      className="block px-4 py-2 text-xs font-semibold text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FCE4EC] dark:hover:bg-[#382338]"
                    >
                      {t.nav.myInquiries}
                    </Link>
                    {user?.role === 'shelter_admin' && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-xs font-bold text-[#F4435A] dark:text-[#F48FB1] hover:bg-[#FCE4EC] dark:hover:bg-[#382338]"
                      >
                        {t.nav.shelterDashboard}
                      </Link>
                    )}
                    {user?.role === 'platform_admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-xs font-bold text-[#F4435A] dark:text-[#F48FB1] hover:bg-[#FCE4EC] dark:hover:bg-[#382338]"
                      >
                        {t.nav.adminDashboard}
                      </Link>
                    )}
                    <div className="my-1 border-t border-[#F1D5DF] dark:border-[#4D2E4D]" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-xs font-bold text-[#F4435A] hover:bg-rose-50 dark:hover:bg-[#382338] cursor-pointer"
                    >
                      {t.nav.logout}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-[#FF81AB] dark:text-[#F48FB1] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent rounded-xl shadow-xs transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Theme toggle + Menu button */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#786875] dark:text-[#C9B8C7] hover:bg-[#FCE4EC] dark:hover:bg-[#382338] cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-[#F48FB1]" />
              ) : (
                <Moon className="h-5 w-5 text-[#352633]" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#786875] dark:text-[#C9B8C7] hover:bg-[#FCE4EC] dark:hover:bg-[#382338] cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer & Backdrop */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Semi-transparent dark backdrop/overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-out Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-[75vw] max-w-[320px] bg-white dark:bg-[#2A1A2A] shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-[#F1D5DF] dark:border-[#4D2E4D] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="flex items-center gap-2">
              <img
                src="/images/surfur-logo.jpg"
                alt="SurFur"
                className="h-8 w-8 rounded-lg object-contain shadow-xs"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/sulfor-logo.jpeg';
                }}
              />
              <span className="font-black text-sm tracking-tight text-[#F4435A] dark:text-[#F48FB1]">
                Sur<span className="text-[#E94EAA]">Fur</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-[#786875] dark:text-[#C9B8C7] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="px-4 py-3 space-y-1 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-[#D4FFC6] text-[#352633] border border-[#bce8ad] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-transparent'
                      : 'text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FFEBF1] dark:hover:bg-[#382338]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D] my-2">
              <button
                onClick={() => {
                  setLang(lang === 'en' ? 'ceb' : 'en');
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#786875] dark:text-[#C9B8C7] w-full hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl transition-colors cursor-pointer"
              >
                <Globe className="h-4 w-4 text-[#E94EAA]" />
                <span>{lang === 'en' ? 'Switch to Cebuano (Bisaya)' : 'Switch to English'}</span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-1 pt-1 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                <Link
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl"
                >
                  {t.nav.favorites}
                </Link>
                <Link
                  to="/inquiries"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl"
                >
                  {t.nav.myInquiries}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-[#352633] dark:text-[#FCE4EC] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl"
                >
                  {t.nav.profile}
                </Link>
                {user?.role === 'shelter_admin' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-[#FF81AB] dark:text-[#F48FB1] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl"
                  >
                    {t.nav.shelterDashboard}
                  </Link>
                )}
                {user?.role === 'platform_admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-[#FF81AB] dark:text-[#F48FB1] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] rounded-xl"
                  >
                    {t.nav.adminDashboard}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-[#F4435A] font-bold hover:bg-rose-50 dark:hover:bg-[#382338] rounded-xl cursor-pointer"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : null}
          </div>

          {/* Drawer Footer Block */}
          {!isAuthenticated ? (
            <div className="p-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#1E121E] space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 border-2 border-[#FF81AB] text-[#FF81AB] dark:text-[#F48FB1] dark:border-[#F48FB1] rounded-xl text-xs font-bold transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 bg-[#D4FFC6] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:text-white dark:border-transparent rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                {t.nav.register}
              </Link>
            </div>
          ) : (
            <div className="p-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/40 dark:bg-[#1E121E] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-[#FFEBF1] dark:bg-[#382338] flex items-center justify-center text-[#FF81AB] dark:text-[#F48FB1] font-bold text-xs shrink-0">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#352633] dark:text-[#FCE4EC] truncate">{user?.full_name}</p>
                  <p className="text-[10px] text-[#786875] dark:text-[#C9B8C7] truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
