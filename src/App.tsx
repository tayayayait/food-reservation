import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Customer pages
import CustomerHome from "./pages/customer/Home";
import ShopDetail from "./pages/customer/ShopDetail";
import Cart from "./pages/customer/Cart";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import PaymentFail from "./pages/customer/PaymentFail";
import CustomerOrders from "./pages/customer/Orders";
import MyPage from "./pages/customer/MyPage";
import SearchPage from "./pages/customer/Search";
import OrderDetail from "./pages/customer/OrderDetail";

// Owner pages
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerOrders from "./pages/owner/Orders";
import OwnerMenu from "./pages/owner/Menu";
import OwnerSettings from "./pages/owner/Settings";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminShops from "./pages/admin/Shops";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import SlotSettings from "./pages/admin/SlotSettings";
import Settlement from "./pages/admin/Settlement";

// Auth
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Customer */}
            <Route path="/" element={<CustomerHome />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/mypage" element={<MyPage />} />

            {/* Owner */}
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/orders" element={<OwnerOrders />} />
            <Route path="/owner/menu" element={<OwnerMenu />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/shops" element={<AdminShops />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/slots" element={<SlotSettings />} />
            <Route path="/admin/settlement" element={<Settlement />} />

            {/* Auth */}
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
