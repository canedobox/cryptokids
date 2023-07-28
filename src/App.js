import { BrowserRouter, Route, Routes } from "react-router-dom";

import WebsiteLayout from "./layouts/WebsiteLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import FamilyGroup from "./pages/FamilyGroup";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import Marketplace from "./pages/Marketplace";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Website */}
        <Route path="/" element={<WebsiteLayout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<FamilyGroup />} />
          <Route path="family-group" element={<FamilyGroup />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Route>
        {/* Page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
