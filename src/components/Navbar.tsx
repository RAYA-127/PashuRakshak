import { ShieldCheck, Wifi, WifiOff, Stethoscope, Tractor, Users, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppState, type Role } from '@/context/AppContext';

const roleLabels: Record<Role, { label: string; icon: typeof Tractor }> = {
  farmer: { label: 'Farmer Portal', icon: Tractor },
  vet: { label: 'Vet Command Center', icon: Stethoscope },
  worker: { label: 'Pashu Sakhi Portal', icon: Users },
};

export function Navbar() {
  const { role, setRole, connectivity, toggleConnectivity } = useAppState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const CurrentIcon = roleLabels[role].icon;

  return (
    <header className="sticky top-0 z-40 glass border-b border-ink-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-safe-500 to-safe-700 shadow-md">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-bold text-ink-900 leading-tight">PashuRakshak AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-safe-400 opacity-75 animate-ping-slow" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-safe-500" />
                </span>
                <span className="text-xs text-ink-500 font-medium">System Operational</span>
              </div>
            </div>
          </div>

          {/* Desktop Role Switcher */}
          <div className="hidden md:flex items-center gap-1 rounded-xl bg-ink-100/80 p-1" ref={dropdownRef}>
            {(Object.keys(roleLabels) as Role[]).map((r) => {
              const Icon = roleLabels[r].icon;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    role === r
                      ? 'bg-white text-safe-700 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {roleLabels[r].label}
                </button>
              );
            })}
          </div>

          {/* Right side: connectivity + mobile menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleConnectivity}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                connectivity === 'online'
                  ? 'border-safe-200 bg-safe-50 text-safe-700 hover:bg-safe-100'
                  : 'border-danger-200 bg-danger-50 text-danger-700 hover:bg-danger-100'
              }`}
            >
              {connectivity === 'online' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span className="hidden sm:inline">{connectivity === 'online' ? 'Online' : 'Offline'}</span>
            </button>

            {/* Mobile role dropdown trigger */}
            <div className="md:hidden relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700"
              >
                <CurrentIcon className="h-4 w-4 text-safe-600" />
                <span className="max-w-[120px] truncate">{roleLabels[role].label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ink-200 bg-white shadow-lg overflow-hidden animate-scale-in">
                  {(Object.keys(roleLabels) as Role[]).map((r) => {
                    const Icon = roleLabels[r].icon;
                    return (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setDropdownOpen(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                          role === r ? 'bg-safe-50 text-safe-700' : 'text-ink-600 hover:bg-ink-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {roleLabels[r].label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
