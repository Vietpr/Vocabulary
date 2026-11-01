import React from 'react';
import { BookOpen, Repeat, Library, BarChart3, Settings, Flame } from 'lucide-react';

export type NavTab = 'learn' | 'review' | 'library' | 'stats' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  dueReviewCount: number;
  streak: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  dueReviewCount,
  streak,
}) => {
  const navItems = [
    {
      id: 'learn' as NavTab,
      label: 'Học hôm nay',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'review' as NavTab,
      label: 'Ôn tập',
      icon: Repeat,
      badge: dueReviewCount > 0 ? dueReviewCount : null,
    },
    {
      id: 'library' as NavTab,
      label: 'Thư viện',
      icon: Library,
      badge: null,
    },
    {
      id: 'stats' as NavTab,
      label: 'Tiến độ',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Cài đặt',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('learn')}>
            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              E
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-900 tracking-tight text-base sm:text-lg">
                  English Restart
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-brand-100 text-brand-800">
                  IELTS UK
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Tự học từ vựng nền tảng · Chuẩn Anh - Anh
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-900 bg-brand-100/70 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-brand-700' : 'text-stone-500'} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Habit Streak Badge */}
          <div className="flex items-center space-x-2">
            <div
              title={`Chuỗi ngày học liên tục: ${streak} ngày`}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                streak > 0
                  ? 'bg-amber-50/80 border-amber-200/90 text-amber-900'
                  : 'bg-stone-100 border-stone-200 text-stone-500'
              }`}
            >
              <Flame
                size={15}
                className={streak > 0 ? 'text-amber-600 fill-amber-500' : 'text-stone-400'}
              />
              <span className="font-semibold">{streak}</span>
              <span className="hidden sm:inline text-stone-600">ngày liên tục</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBFBFA] border-t border-stone-200 py-1.5 px-2 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
                isActive ? 'text-brand-800' : 'text-stone-500'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'text-brand-700' : 'text-stone-500'} />
                {item.badge !== null && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
