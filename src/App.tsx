
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ComicsHome from "./pages/ComicsHome";
import ComicDetail from "./pages/ComicDetail";
import EpisodePreview from "./pages/EpisodePreview";
import { EpisodeReader } from "./pages/EpisodeReader";
import OurSeries from "./pages/OurSeries";
import ShopAll from "./pages/ShopAll";
import Announcements from "./pages/Announcements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import PreOrder from "./pages/PreOrder";
import SeriesPage from "./pages/SeriesPage";
import Checkout from "./pages/Checkout";
import DirectCheckout from "./pages/DirectCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Profile from "./pages/Profile";
import AffiliationPrograms from "./pages/AffiliationPrograms";
import DigitalReader from "./pages/DigitalReader";
import DigitalReaderSpecs from "./pages/DigitalReaderSpecs";
import ComicSeries from "./pages/ComicSeries";
import Coins from "./pages/Coins";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Copyright from "./pages/Copyright";
import OrderShipping from "./pages/OrderShipping";
import TermsConditions from "./pages/TermsConditions";
import Auth from "./pages/Auth";
import FAQ from "./pages/FAQ";
import ReturnExchange from "./pages/ReturnExchange";
import CustomerSupport from "./pages/CustomerSupport";
import LanguageTerms from "./pages/LanguageTerms";
import Wishlist from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import LibraryPage from "./pages/LibraryPage";
import ChatBot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollToTop";
import ReadersMode from "./pages/ReadersMode";
import PrintReader from "./pages/PrintReader";
import { AuthProvider as SupabaseAuthProvider } from "./hooks/useSupabaseAuth";
import { CartProvider } from "./hooks/useCart";
import AuthPage from "./pages/AuthPage";
import ProductDetails from "./pages/ProductDetails";
import MerchandiseDetail from "./pages/MerchandiseDetail";
import VolumeDetail from "./pages/VolumeDetail";
import VolumeReader from "./pages/VolumeReader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupabaseAuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/comics" element={<ComicsHome />} />
              <Route path="/comic/:id" element={<ComicDetail />} />
              <Route path="/episode/:id/preview" element={<EpisodePreview />} />
              <Route path="/episode/:id/read" element={<EpisodeReader />} />
              <Route path="/our-series" element={<OurSeries />} />
              <Route path="/comic-series" element={<ComicSeries />} />
              <Route path="/shop-all" element={<ShopAll />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcement/:id" element={<AnnouncementDetail />} />
              <Route path="/pre-order/:productId" element={<PreOrder />} />
              <Route path="/series/:seriesId" element={<SeriesPage />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/merchandise/:productId" element={<MerchandiseDetail />} />
              <Route path="/book/:bookId/volume/:volumeId" element={<VolumeDetail />} />
              <Route path="/volume-reader/:volumeId" element={<VolumeReader />} />
              <Route path="/checkout/:productId" element={<Checkout />} />
              <Route path="/direct-checkout/:productId" element={<DirectCheckout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/digital-reader/:seriesTitle" element={<DigitalReader />} />
              <Route path="/digital-reader-specs" element={<DigitalReaderSpecs />} />
              <Route path="/readers/:seriesTitle" element={<ReadersMode />} />
              <Route path="/print-reader/:bookId" element={<PrintReader />} />
              <Route path="/coins" element={<Coins />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/customer-support" element={<CustomerSupport />} />
              <Route path="/return-exchange" element={<ReturnExchange />} />
              <Route path="/order-shipping" element={<OrderShipping />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/copyright" element={<Copyright />} />
              <Route path="/language-terms" element={<LanguageTerms />} />
              <Route path="/affiliation-programs" element={<AffiliationPrograms />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </CartProvider>
      </SupabaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
