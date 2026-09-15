import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastViewport from "./components/ToastViewport";
import Home from "./pages/Home";
import Deals from "./pages/Deals";
import Browse from "./pages/Browse";
import Genre from "./pages/Genre";
import GameDetail from "./pages/GameDetail";
import Profile from "./pages/Profile";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import Activity from "./pages/Activity";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Browse />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/genres/:genre" element={<Genre />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/lists/:id" element={<ListDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}

export default App;
