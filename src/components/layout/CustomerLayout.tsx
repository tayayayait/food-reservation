import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export default function CustomerLayout() {
  return (
    <div className="relative min-h-screen bg-neutral-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen shadow-2xl relative">
        <div className="pb-24">
            <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
