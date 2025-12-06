// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import { SidebarProvider } from "./components/SidebarContext";
// import Layout1 from "./components/Layout1";  // Your sidebar-push-content layout
// import { ThemeProvider } from "./ThemeContext";
// import { Toaster } from "react-hot-toast";

// // Import all your pages
// import Login from "./Pages/Login";
// import Configuration from "./components/Configuration";
// import AllChecklists from "./components/AllChecklists";
// import MyOngoingChecklist from "./components/MyInProgressSubmissions";
// import CheckerInbox from "./components/CheckerInbox";
// import CreatePurposePage from "./components/CreatePurposePage";
// import UserManagementSetup from "./components/UserManagementSetup";
// import ProjectDetails from "./components/Projectdetails";
// import Snagging from "./components/Snagging";
// import FlatMatrixTable from "./components/FlatMatrixTable";
// import ChecklistFloor from "./components/ChecklistFloor";
// import ChecklistPage from "./components/ChecklistPage";
// import CASetup from "./components/CASetup";
// import SiteConfig from "./SiteConfig";
// import UserHome from "./UserHome";
// import SlotConfig from "./SlotConfig";
// import RequestManagement from "./RequestManagement";
// import CoustemerHandover from "./CoustemerHandover";
// import Chif from "./Chif";
// import UserDashboard from "./components/UserDashboard";
// import PendingSupervisorItems from "./components/PendingSupervisorItems";
// import UsersManagement from "./components/UsersManagement";
// import InitializeChecklist from "./components/InitializeChecklist";
// import PendingInspectorChecklists from "./components/PendingInspectorChecklists";
// import PendingForMakerItems from "./components/PendingForMakerItems";
// import ChifSetup from "./ChifSetup";
// import Chifstep1 from "./Chifstep1";
// import Checklist from "./containers/setup/Checklist";
// import Setup from "./components/Setup";
// import UserSetup from "./containers/setup/UserSetup";
// import User from "./containers/setup/User";
// import CategoryChecklist from "./components/CategoryChecklist";
// import EditCheckList from "./containers/EditCheckList";
// import HierarchicalVerifications from "./components/HierarchicalVerifications";
// import FlatInspectionPage from "./components/FlatInspectionPage";
// // ... import any other needed components

// function AppRoutes() {
//   const location = useLocation();

//   // Show login page without sidebar/header
//   if (location.pathname === "/login") {
//     return (
//       <Routes>
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     );
//   }

//   // Everything else uses the push-content Layout1
//   return (
//     <Layout1>
//       <Routes>
//         <Route path="/config" element={<Configuration />} />
//         <Route path="/all-checklists" element={<AllChecklists />} />
//         <Route path="/my-ongoing-checklist" element={<MyOngoingChecklist />} />
//         <Route path="/checker-inbox" element={<CheckerInbox />} />
//         <Route path="/create-purpose" element={<CreatePurposePage />} />
//         <Route path="/user-management-setup" element={<UserManagementSetup />} />
//         <Route path="/project/:id" element={<ProjectDetails />} />
//         <Route path="/snagging/:id" element={<Snagging />} />
//         <Route path="/Level/:id" element={<FlatMatrixTable />} />
//         <Route path="/checklistfloor/:id" element={<ChecklistFloor />} />
//         <Route path="/checklistpage/:id" element={<ChecklistPage />} />
//         <Route path="/casetup" element={<CASetup />} />
//         <Route path="/SiteConfig" element={<SiteConfig />} />
//         <Route path="/UserHome" element={<UserHome />} />
//         <Route path="/SlotConfig" element={<SlotConfig />} />
//         <Route path="/RequestManagement" element={<RequestManagement />} />
//         <Route path="/CoustemerHandover" element={<CoustemerHandover />} />
//         <Route path="/Chif" element={<Chif />} />
//         <Route path="/analytics" element={<UserDashboard />} />
//         <Route path="/PendingSupervisorItems" element={<PendingSupervisorItems />} />
//         <Route path="/UsersManagement" element={<UsersManagement />} />
//         <Route path="/Initialize-Checklist" element={<InitializeChecklist />} />
//         <Route path="/PendingInspector-Checklist" element={<PendingInspectorChecklists />} />
//         <Route path="/Pending-For-MakerItems" element={<PendingForMakerItems />} />
//         <Route path="/chif-setup" element={<ChifSetup />} />
//         <Route path="/Chifstep1" element={<Chifstep1 />} />
//         <Route path="/Checklist" element={<Checklist />} />
//         <Route path="/setup" element={<Setup />} />
//         <Route path="/user-setup" element={<UserSetup />} />
//         <Route path="/user" element={<User />} />
//         <Route path="/category-sidebar" element={<CategoryChecklist />} />
//         <Route path="/edit-checklist/:id" element={<EditCheckList />} />
//         <Route path="/hierarchical-verifications" element={<HierarchicalVerifications />} />
//         <Route
//            path="/inspection/flat/:flatId"
//              element={<FlatInspectionPage />}
//         />
//         {/* Add any additional routes as needed */}
//       </Routes>
//     </Layout1>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <SidebarProvider>
//         <Router>
//           <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
//           <AppRoutes />
//         </Router>
//       </SidebarProvider>
//     </ThemeProvider>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "./components/SidebarContext";
import Layout1 from "./components/Layout1";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Toaster } from "react-hot-toast";

// ... imports for all your pages as before
import Login from "./Pages/Login";
import Configuration from "./components/Configuration";
import AllChecklists from "./components/AllChecklists";
import MyOngoingChecklist from "./components/MyInProgressSubmissions";
import CheckerInbox from "./components/CheckerInbox";
import CreatePurposePage from "./components/CreatePurposePage";
import UserManagementSetup from "./components/UserManagementSetup";
import ProjectDetails from "./components/Projectdetails";
import Snagging from "./components/Snagging";
import FlatMatrixTable from "./components/FlatMatrixTable";
import ChecklistFloor from "./components/ChecklistFloor";
import ChecklistPage from "./components/ChecklistPage";
import CASetup from "./components/CASetup";
import SiteConfig from "./SiteConfig";
import UserHome from "./UserHome";
import SlotConfig from "./SlotConfig";
import RequestManagement from "./RequestManagement";
import CoustemerHandover from "./CoustemerHandover";
import Chif from "./Chif";
import UserDashboard from "./components/UserDashboard";
import PendingSupervisorItems from "./components/PendingSupervisorItems";
import UsersManagement from "./components/UsersManagement";
import InitializeChecklist from "./components/InitializeChecklist";
import PendingInspectorChecklists from "./components/PendingInspectorChecklists";
import PendingForMakerItems from "./components/PendingForMakerItems";
import ChifSetup from "./ChifSetup";
import Chifstep1 from "./Chifstep1";
import Checklist from "./containers/setup/Checklist";
import Setup from "./components/Setup";
import UserSetup from "./containers/setup/UserSetup";
import User from "./containers/setup/User";
import CategoryChecklist from "./components/CategoryChecklist";
import EditCheckList from "./containers/EditCheckList";
import HierarchicalVerifications from "./components/HierarchicalVerifications";
import FlatInspectionPage from "./components/FlatInspectionPage";
import PrivacyPage from "./components/PrivacyPage";
import Scheduling from "./components/Scheduling";
import GuardOnboarding from "./components/GuardOnboarding";
import GuardAttendance from "./components/GuardAttendance";
import AttendanceProjectPage from "./components/AttendanceProjectPage";
import ProjectOverview from "./components/ProjectOverview";
import MIRCreatePage from "./components/MIRCreatePage";
import MIRInboxPage from "./components/MIRInboxPage";
import MIRDetailPage from "./components/MIRDetailPage";
import FlatReport from "./components/FlatReport";
// For body background
function BodyBgController() {
  const { theme } = useTheme();
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "dark" ? "#191922" : "#fcfaf7"; // dark or offwhite
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);
  return null;
}
// ----------------- ROLE GUARD for Project Overview -----------------
function ProjectOverviewGuard({ children }) {
  // ROLE read from localStorage / USER_DATA
  let role = localStorage.getItem("ROLE") || "";

  if (!role) {
    try {
      const raw = localStorage.getItem("USER_DATA");
      if (raw) {
        const data = JSON.parse(raw);
        role = data?.role || data?.roles?.[0] || "";
      }
    } catch (e) {
      // ignore parse error
    }
  }

  const r = (role || "").toLowerCase();

  // ✅ Allowed: Project Manager / Project Head only
  const isAllowed = [
    "project manager",
    "project_manager",
    "project head",
    "project_head",
  ].some((k) => r.includes(k));

  if (!isAllowed) {
    // ❌ allowed nahi → config page pe bhej do
    return <Navigate to="/config" replace />;
  }

  return children;
}


// Your main app routes
function AppRoutes() {
  const location = useLocation();

  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout1>
      <Routes>
         <Route
          path="/overview/project/:id"
          element={
            <ProjectOverviewGuard>
              <ProjectOverview />
            </ProjectOverviewGuard>
          }
        />
        <Route path="/config" element={<Configuration />} />
        <Route path="/all-checklists" element={<AllChecklists />} />
        <Route path="/my-ongoing-checklist" element={<MyOngoingChecklist />} />
        <Route path="/checker-inbox" element={<CheckerInbox />} />
        <Route path="/create-purpose" element={<CreatePurposePage />} />
        <Route
          path="/user-management-setup"
          element={<UserManagementSetup />}
        />
        <Route path="/projects/:id/flat-report/:flatId" element={<FlatReport />} />

        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/snagging/:id" element={<Snagging />} />
        <Route path="/Level/:id" element={<FlatMatrixTable />} />
        <Route path="/checklistfloor/:id" element={<ChecklistFloor />} />
        <Route path="/checklistpage/:id" element={<ChecklistPage />} />
        <Route path="/casetup" element={<CASetup />} />
        <Route path="/SiteConfig" element={<SiteConfig />} />
        <Route path="/UserHome" element={<UserHome />} />
        <Route path="/SlotConfig" element={<SlotConfig />} />
        <Route path="/RequestManagement" element={<RequestManagement />} />
        <Route path="/CoustemerHandover" element={<CoustemerHandover />} />
        <Route path="/Chif" element={<Chif />} />
        <Route path="/analytics" element={<UserDashboard />} />
        <Route
          path="/PendingSupervisorItems"
          element={<PendingSupervisorItems />}
        />
        <Route path="/mir/create" element={<MIRCreatePage />} />
        <Route path="/mir/:id" element={<MIRDetailPage />} />
        <Route path="/mir/inbox" element={<MIRInboxPage />} />
        <Route
  path="/attendance/project"
  element={<AttendanceProjectPage />}
/>


        <Route path="/UsersManagement" element={<UsersManagement />} />
        <Route path="/Initialize-Checklist" element={<InitializeChecklist />} />
        <Route
          path="/PendingInspector-Checklist"
          element={<PendingInspectorChecklists />}
        />
        <Route
          path="/Pending-For-MakerItems"
          element={<PendingForMakerItems />}
        />
        <Route path="/guard/onboarding" element={<GuardOnboarding />} />
        <Route path="/guard/attendance" element={<GuardAttendance />} />



        <Route path="/chif-setup" element={<ChifSetup />} />
        <Route path="/Chifstep1" element={<Chifstep1 />} />
        <Route path="/Checklist" element={<Checklist />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/user-setup" element={<UserSetup />} />
        <Route path="/user" element={<User />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/scheduling" element={<Scheduling />} />

        <Route path="/category-sidebar" element={<CategoryChecklist />} />
        <Route path="/edit-checklist/:id" element={<EditCheckList />} />
        <Route
          path="/hierarchical-verifications"
          element={<HierarchicalVerifications />}
        />
        <Route
          path="/inspection/flat/:flatId"
          element={<FlatInspectionPage />}
        />
        {/* Add more as needed */}
      </Routes>
    </Layout1>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <BodyBgController />
          <AppRoutes />
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
