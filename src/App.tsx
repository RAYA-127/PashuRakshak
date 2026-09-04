import { AppStateProvider, useAppState } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { FarmerPortal } from '@/components/FarmerPortal';
import { VetCommandCenter } from '@/components/VetCommandCenter';
import { PashuSakhiPortal } from '@/components/PashuSakhiPortal';
import { ToastContainer } from '@/components/ui/Toast';

function PortalRouter() {
  const { role } = useAppState();

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {role === 'farmer' && <FarmerPortal />}
      {role === 'vet' && <VetCommandCenter />}
      {role === 'worker' && <PashuSakhiPortal />}
    </main>
  );
}

function App() {
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-ink-50">
        <Navbar />
        <PortalRouter />
        <ToastContainer />
      </div>
    </AppStateProvider>
  );
}

export default App;
