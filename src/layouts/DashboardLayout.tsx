// import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
// import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export function DashboardLayout() {
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => {}} />
      {/* <Navbar onMenuClick={() => setDrawerOpen(true)} /> */}
      <div className="flex flex-1">
        {/* <Sidebar isDrawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} /> */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
