// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import projectImage from "../Images/Project.png";

// import {
//   Allprojects,
//   getProjectsByOwnership,
//   getProjectUserDetails,
// } from "../api";
// import toast from "react-hot-toast";

// // --- Helper for JWT decode ---
// function decodeJWT(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     return null;
//   }
// }

// const Configuration = () => {
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Color template palette
//   const palette =
//     theme === "dark"
//       ? {
//           bg: "bg-[#181820]", // page background
//           card: "bg-[#23232e] text-yellow-100", // card and text color
//           cardShadow: "shadow-lg border border-yellow-400/20",
//           title: "text-yellow-200",
//           overlay: "bg-gray-800 bg-opacity-50",
//           tileShadow: "shadow-md border border-yellow-300/30",
//           badge: "bg-yellow-700 text-yellow-200",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         }
//       : {
//           bg: "bg-gray-50",
//           card: "bg-white text-gray-800",
//           cardShadow: "shadow-lg border border-orange-200",
//           title: "text-[#ea6822]",
//           overlay: "bg-orange-800 bg-opacity-40",
//           tileShadow: "shadow-md border border-orange-100",
//           badge: "bg-orange-400 text-white",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);

//       let userData = null;
//       try {
//         const userDataStr = localStorage.getItem("USER_DATA");
//         if (userDataStr) {
//           userData = JSON.parse(userDataStr);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) userData = decodeJWT(token);
//         }
//       } catch {}

      
//       const rolee =
//         localStorage.getItem("ROLE") ||
//         userData?.role ||
//         userData?.roles?.[0] ||
//         "";

//       const isManager = userData?.is_manager;
//       const isSuperadmin = userData?.is_staff || userData?.superadmin;
//       const isClient = userData?.is_client;

//       try {
//         let response = null;

//         if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
//           response = await Allprojects();
//         } else if (rolee === "Admin") {
//           response = await getProjectUserDetails();
//         } else if (isManager) {
//           if (userData.entity_id) {
//             response = await getProjectsByOwnership({
//               entity_id: userData.entity_id,
//             });
//           } else if (userData.company_id) {
//             response = await getProjectsByOwnership({
//               company_id: userData.company_id,
//             });
//           } else if (userData.org || userData.organization_id) {
//             const orgId = userData.org || userData.organization_id;
//             response = await getProjectsByOwnership({ organization_id: orgId });
//           } else {
//             toast.error(
//               "No entity, company, or organization found for this manager."
//             );
//             setProjects([]);
//             setLoading(false);
//             return;
//           }
//         }

//         if (response && response.status === 200) {
//           setProjects(
//             Array.isArray(response.data) ? response.data : response.data.results || []
            
//           );
//                 console.log(projects,'sdfgtyhujikol');

//         } else if (response) {
//           toast.error(response.data?.message || "Failed to fetch projects.");
//           setProjects([]);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) {
//             const data = decodeJWT(token);
//             if (data && Array.isArray(data.accesses)) {
//               const uniqueProjects = [];
//               const seenIds = new Set();
//               data.accesses.forEach((access) => {
//                 if (access.project_id && !seenIds.has(access.project_id)) {
//                   uniqueProjects.push({
//                     id: access.project_id,
//                     project_name: access.project_name,
//                     roles: access.roles,
//                   });
//                   seenIds.add(access.project_id);
//                 }
//               });
//               setProjects(uniqueProjects);
//                   console.log(projects,'sdfgtyhujikol');
//             } else {
//               setProjects([]);
//             }
//           } else {
//             setProjects([]);
//           }
//         }
//       } catch (error) {
//         toast.error(error?.response?.data?.message || "Error fetching projects.");
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//                    console.log(projects,'sdfgtyhujikol');
//   }, []);

//   const handleProjectClick = (project) => {
//     navigate(`/project/${project.id}`, { state: { project } });
//   };

//   return (
//     <div className={`flex ${palette.bg} min-h-screen`}>
//       <div className="my-5 mx-auto max-w-7xl pt-3 px-5 pb-8 w-full">
//         <div className={`rounded-xl ${palette.cardShadow} ${palette.card}`}>
//           <h2 className={`text-3xl font-bold mb-6 text-center ${palette.title}`}>
//             Projects
//           </h2>
//           {loading ? (
//             <div className="flex justify-center items-center py-14 text-lg">
//               <svg
//                 className="animate-spin h-8 w-8 text-orange-400 dark:text-yellow-200 mr-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Loading projects...
//             </div>
//           ) : projects.length === 0 ? (
//             <div className="text-center py-10 text-xl font-semibold text-red-400">
//               No projects assigned.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {projects.map((project) => (
//                 <div
//                   key={project.id}
//                   className={`relative rounded-xl overflow-hidden cursor-pointer w-56 ${palette.card} ${palette.tileShadow} hover:scale-105 transition-transform duration-150`}
//                   onClick={() => handleProjectClick(project)}
//                 >
//                   <img
//                     src={projectImage}
//                     alt={`Project ${project.name}`}
//                     className="w-full h-80 object-cover"
//                   />
//                   <div
//                     className={`absolute bottom-0 left-0 right-0 ${palette.overlay} text-white text-lg font-semibold p-2`}
//                   >
//                     {project.name || `Project ${project.id}`}
//                   </div>
//                   {/* Role Badges */}
//                   <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
//                     {Array.isArray(project.roles) &&
//                       project.roles.map((role, i) => (
//                         <span
//                           key={i}
//                           className={`px-2 py-1 rounded text-xs font-bold shadow ${palette.badge}`}
//                         >
//                           {typeof role === "string" ? role : role?.role}
//                         </span>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Configuration;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import projectImage from "../Images/Project.png";
// import axios from "axios";

// import {
//   Allprojects,
//   getProjectsByOwnership,
//   getProjectUserDetails,
// } from "../api";
// import toast from "react-hot-toast";

// // --- Helper for JWT decode ---
// function decodeJWT(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     return null;
//   }
// }

// const Configuration = () => {
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nameCache, setNameCache] = useState({});

//   // Color template palette (unchanged)
//   const palette =
//     theme === "dark"
//       ? {
//           bg: "bg-[#181820]",
//           card: "bg-[#23232e] text-yellow-100",
//           cardShadow: "shadow-lg border border-yellow-400/20",
//           title: "text-yellow-200",
//           overlay: "bg-gray-800 bg-opacity-50",
//           tileShadow: "shadow-md border border-yellow-300/30",
//           badge: "bg-yellow-700 text-yellow-200",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         }
//       : {
//           bg: "bg-gray-50",
//           card: "bg-white text-gray-800",
//           cardShadow: "shadow-lg border border-orange-200",
//           title: "text-[#ea6822]",
//           overlay: "bg-orange-800 bg-opacity-40",
//           tileShadow: "shadow-md border border-orange-100",
//           badge: "bg-orange-400 text-white",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);

//       let userData = null;
//       try {
//         const userDataStr = localStorage.getItem("USER_DATA");
//         if (userDataStr) {
//           userData = JSON.parse(userDataStr);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) userData = decodeJWT(token);
//         }
//       } catch {}

//       const rolee =
//         localStorage.getItem("ROLE") ||
//         userData?.role ||
//         userData?.roles?.[0] ||
//         "";

//       const isManager = userData?.is_manager;

//       try {
//         let response = null;

//         if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
//           response = await Allprojects();
//         } else if (rolee === "Admin") {
//           response = await getProjectUserDetails();
//         } else if (isManager) {
//           if (userData.entity_id) {
//             response = await getProjectsByOwnership({
//               entity_id: userData.entity_id,
//             });
//           } else if (userData.company_id) {
//             response = await getProjectsByOwnership({
//               company_id: userData.company_id,
//             });
//           } else if (userData.org || userData.organization_id) {
//             const orgId = userData.org || userData.organization_id;
//             response = await getProjectsByOwnership({ organization_id: orgId });
//           } else {
//             toast.error(
//               "No entity, company, or organization found for this manager."
//             );
//             setProjects([]);
//             setLoading(false);
//             return;
//           }
//         }

//         if (response && response.status === 200) {
//           setProjects(
//             Array.isArray(response.data) ? response.data : response.data.results || []
//           );
//         } else if (response) {
//           toast.error(response.data?.message || "Failed to fetch projects.");
//           setProjects([]);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) {
//             const data = decodeJWT(token);
//             if (data && Array.isArray(data.accesses)) {
//               const uniqueProjects = [];
//               const seenIds = new Set();
//               data.accesses.forEach((access) => {
//                 if (access.project_id && !seenIds.has(access.project_id)) {
//                   uniqueProjects.push({
//                     id: access.project_id,
//                     name: access.project_name, // Set name directly if available
//                     roles: access.roles,
//                   });
//                   seenIds.add(access.project_id);
//                 }
//               });
//               setProjects(uniqueProjects);
//             } else {
//               setProjects([]);
//             }
//           } else {
//             setProjects([]);
//           }
//         }
//       } catch (error) {
//         toast.error(error?.response?.data?.message || "Error fetching projects.");
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Fallback: fetch project name by id if missing
//   const getProjectName = (project) => {
//     if (project.name) return project.name;
//     if (nameCache[project.id]) return nameCache[project.id];

//     // If name is not available and not cached, fetch and cache
//     if (!nameCache[project.id]) {
//       axios
//         .get(`https://konstruct.world/projects/projects/${project.id}/`, {
//         headers: {
//            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
//          },
//      })
//         .then((res) => {
//           if (res.data?.name) {
//             setNameCache((prev) => ({
//               ...prev,
//               [project.id]: res.data.name,
//             }));
//           }
//         })
//         .catch(() => {
//           setNameCache((prev) => ({
//             ...prev,
//             [project.id]: "Project " + project.id,
//           }));
//         });
//     }
//     // While loading, fallback to id as label
//     return "Project " + project.id;
//   };
// // if (!nameCache[project.id]) {
// //   axios
// //     .get(
// //       `https://konstruct.world/projects/projects/${project.id}/`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
// //         },
// //       }
// //     )
// //     .then((res) => {
// //       if (res.data?.name) {
// //         setNameCache((prev) => ({
// //           ...prev,
// //           [project.id]: res.data.name,
// //         }));
// //       }
// //     })
// //     .catch(() => {
// //       setNameCache((prev) => ({
// //         ...prev,
// //         [project.id]: "Project " + project.id,
// //       }));
// //     });
// // }

//   const handleProjectClick = (project) => {
//     navigate(`/project/${project.id}`, { state: { project } });
//   };

//   return (
//     <div className={`flex ${palette.bg} min-h-screen`}>
//       <div className="my-5 mx-auto max-w-7xl pt-3 px-5 pb-8 w-full">
//         <div className={`rounded-xl ${palette.cardShadow} ${palette.card}`}>
//           <h2 className={`text-3xl font-bold mb-6 text-center ${palette.title}`}>
//             Projects
//           </h2>
//           {loading ? (
//             <div className="flex justify-center items-center py-14 text-lg">
//               <svg
//                 className="animate-spin h-8 w-8 text-orange-400 dark:text-yellow-200 mr-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Loading projects...
//             </div>
//           ) : projects.length === 0 ? (
//             <div className="text-center py-10 text-xl font-semibold text-red-400">
//               No projects assigned.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {projects.map((project) => (
//                 <div
//                   key={project.id}
//                   className={`relative rounded-xl overflow-hidden cursor-pointer w-56 ${palette.card} ${palette.tileShadow} hover:scale-105 transition-transform duration-150`}
//                   onClick={() => handleProjectClick(project)}
//                 >
//                   <img
//                     src={project.image || projectImage}
//                     alt={getProjectName(project)}
//                     className="w-full h-80 object-cover"
//                     onError={e => { e.target.src = projectImage; }}
//                   />
//                   <div
//                     className={`absolute bottom-0 left-0 right-0 ${palette.overlay} text-white text-lg font-semibold p-2`}
//                   >
//                     {getProjectName(project)}
//                   </div>
//                   {/* Role Badges */}
//                   <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
//                     {Array.isArray(project.roles) &&
//                       project.roles.map((role, i) => (
//                         <span
//                           key={i}
//                           className={`px-2 py-1 rounded text-xs font-bold shadow ${palette.badge}`}
//                         >
//                           {typeof role === "string" ? role : role?.role}
//                         </span>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Configuration;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import projectImage from "../Images/Project.png";
// import axios from "axios";

// import {
//   Allprojects,
//   getProjectsByOwnership,
//   getProjectUserDetails,
// } from "../api";
// import toast from "react-hot-toast";

// // --- Helper for JWT decode ---
// function decodeJWT(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     return null;
//   }
// }


// const API_BASE = "https://konstruct.world";




// const Configuration = () => {
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nameCache, setNameCache] = useState({});

//   // THEME palette
//   const ORANGE = "#ffbe63";
//   const BG_OFFWHITE = "#fcfaf7";
//   const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
//   const cardColor = theme === "dark" ? "#23232c" : "#fff";
//   const borderColor = ORANGE;
//   const textColor = theme === "dark" ? "#fff" : "#222";
//   const iconColor = ORANGE;

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);

//       let userData = null;
//       try {
//         const userDataStr = localStorage.getItem("USER_DATA");
//         if (userDataStr) {
//           userData = JSON.parse(userDataStr);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) userData = decodeJWT(token);
//         }
//       } catch {}

//       const rolee =
//         localStorage.getItem("ROLE") ||
//         userData?.role ||
//         userData?.roles?.[0] ||
//         "";

//       const isManager = userData?.is_manager;

//       try {
//         let response = null;

//         if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
//           response = await Allprojects();
//         } else if (rolee === "Admin") {
//           response = await getProjectUserDetails();
//         } else if (isManager) {
//           if (userData.entity_id) {
//             response = await getProjectsByOwnership({
//               entity_id: userData.entity_id,
//             });
//           } else if (userData.company_id) {
//             response = await getProjectsByOwnership({
//               company_id: userData.company_id,
//             });
//           } else if (userData.org || userData.organization_id) {
//             const orgId = userData.org || userData.organization_id;
//             response = await getProjectsByOwnership({ organization_id: orgId });
//           } else {
//             toast.error(
//               "No entity, company, or organization found for this manager."
//             );
//             setProjects([]);
//             setLoading(false);
//             return;
//           }
//         }

//         if (response && response.status === 200) {
//           setProjects(
//             Array.isArray(response.data) ? response.data : response.data.results || []
//           );
//         } else if (response) {
//           toast.error(response.data?.message || "Failed to fetch projects.");
//           setProjects([]);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) {
//             const data = decodeJWT(token);
//             if (data && Array.isArray(data.accesses)) {
//               const uniqueProjects = [];
//               const seenIds = new Set();
//               data.accesses.forEach((access) => {
//                 if (access.project_id && !seenIds.has(access.project_id)) {
//                   uniqueProjects.push({
//                     id: access.project_id,
//                     name: access.project_name, // Set name directly if available
//                     roles: access.roles,
//                   });
//                   seenIds.add(access.project_id);
//                 }
//               });
//               setProjects(uniqueProjects);
//             } else {
//               setProjects([]);
//             }
//           } else {
//             setProjects([]);
//           }
//         }
//       } catch (error) {
//         toast.error(error?.response?.data?.message || "Error fetching projects.");
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Fallback: fetch project name by id if missing
//   const getProjectName = (project) => {
//     if (project.name) return project.name;
//     if (nameCache[project.id]) return nameCache[project.id];

//     // If name is not available and not cached, fetch and cache
//     if (!nameCache[project.id]) {
//       axios
//         .get(`https://konstruct.world/projects/projects/${project.id}/`, {
//         headers: {
//            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
//          },
//      })
//         .then((res) => {
//           if (res.data?.name) {
//             setNameCache((prev) => ({
//               ...prev,
//               [project.id]: res.data.name,
//             }));
//           }
//         })
//         .catch(() => {
//           setNameCache((prev) => ({
//             ...prev,
//             [project.id]: "Project " + project.id,
//           }));
//         });
//     }
//     // While loading, fallback to id as label
//     return "Project " + project.id;
//   };

//   const handleProjectClick = (project) => {
//     navigate(`/project/${project.id}`, { state: { project } });
//   };

//   const [flagsByProject, setFlagsByProject] = useState({});   // { [id]: flagsJson }
//   const [flagPanelOpen, setFlagPanelOpen] = useState({});     // { [id]: bool }
//   const [flagLoading, setFlagLoading] = useState({});         // { [id]: bool }
//   const [flagPosting, setFlagPosting] = useState({});         // { [id]: "path" | null }
//   const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
// });

// // GET /projects/{id}/flags/
// const fetchFlags = async (projectId) => {
//   setFlagLoading((p) => ({ ...p, [projectId]: true }));
//   try {
//     const res = await axios.get(`${API_BASE}/projects/projects/${projectId}/flags/`, {
//       headers: authHeaders(),
//     });
//     setFlagsByProject((p) => ({ ...p, [projectId]: res.data || {} }));
//     toast.success("Flags loaded");
//   } catch (e) {
//     toast.error(e?.response?.data?.detail || "Failed to load flags");
//   } finally {
//     setFlagLoading((p) => ({ ...p, [projectId]: false }));
//   }
// };

// // POST helpe
// const postFlagAction = async (projectId, path, body = {}) => {
//   setFlagPosting((p) => ({ ...p, [projectId]: path }));
//   try {
//     await axios.post(`${API_BASE}/projects/projects/${projectId}/${path}`, body, {
//       headers: { ...authHeaders(), "Content-Type": "application/json" },
//     });
//     toast.success("Updated");
//     await fetchFlags(projectId);
//   } catch (e) {
//     toast.error(e?.response?.data?.detail || "Failed to update");
//   } finally {
//     setFlagPosting((p) => ({ ...p, [projectId]: null }));
//   }
// };

// return (
//   <div
//     className="flex min-h-screen transition-colors duration-300"
//     style={{ backgroundColor: bgColor }}
//   >
//     <div className="my-8 mx-auto max-w-7xl pt-8 px-6 pb-10 w-full">
//       <div
//         className="relative rounded-3xl transition-all duration-300 hover:shadow-2xl"
//         style={{
//           backgroundColor: cardColor,
//           border: `2px solid ${borderColor}`,
//           boxShadow:
//             theme === "dark"
//               ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(255, 190, 99, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
//               : `0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(255, 190, 99, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
//           backdropFilter: "blur(20px)",
//           WebkitBackdropFilter: "blur(20px)",
//         }}
//       >
//         {/* Decorative Background Elements */}
//         <div
//           className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
//           style={{ backgroundColor: borderColor }}
//         />
//         <div
//           className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
//           style={{ backgroundColor: borderColor }}
//         />

//         {/* Header Section */}
//         <div className="relative z-10 text-center mb-12 pt-4">
//           <div
//             className="w-24 h-1 mx-auto mb-8 rounded-full"
//             style={{ backgroundColor: borderColor }}
//           />
//           <h2
//             className="text-5xl font-bold mb-4 tracking-tight relative inline-block"
//             style={{
//               color: textColor,
//               textShadow:
//                 theme === "dark"
//                   ? `0 2px 8px rgba(255, 190, 99, 0.3)`
//                   : `0 2px 8px rgba(0, 0, 0, 0.1)`,
//             }}
//           >
//             Projects
//           </h2>
//           <p
//             className="text-lg font-medium opacity-80"
//             style={{ color: textColor }}
//           >
//             Manage and explore your project portfolio
//           </p>
//         </div>

//         {/* Content Section */}
//         <div className="relative z-10 px-4">
//           {loading ? (
//             <div className="flex flex-col justify-center items-center py-20">
//               <div className="relative mb-6">
//                 <div
//                   className="w-16 h-16 rounded-full border-4 border-opacity-20 animate-spin"
//                   style={{
//                     borderColor: borderColor,
//                     borderTopColor: borderColor,
//                   }}
//                 />
//                 <div
//                   className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-transparent animate-pulse"
//                   style={{
//                     borderTopColor: borderColor,
//                     animationDuration: "1.5s",
//                   }}
//                 />
//               </div>
//               <p
//                 className="text-xl font-semibold animate-pulse"
//                 style={{ color: textColor }}
//               >
//                 Loading projects...
//               </p>
//             </div>
//           ) : projects.length === 0 ? (
//             <div className="text-center py-20">
//               <div
//                 className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
//                 style={{
//                   backgroundColor: theme === "dark" ? "#ffffff10" : "#00000005",
//                   border: `2px dashed ${borderColor}60`,
//                 }}
//               >
//                 <svg
//                   width="40"
//                   height="40"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke={borderColor}
//                   strokeWidth="1.5"
//                 >
//                   <path d="M12 4.5v15m7.5-7.5h-15" />
//                 </svg>
//               </div>
//               <h3
//                 className="text-2xl font-bold mb-3"
//                 style={{ color: textColor }}
//               >
//                 No Projects Available
//               </h3>
//               <p className="text-lg opacity-70" style={{ color: textColor }}>
//                 No projects have been assigned to your account yet
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-4">
//               {projects.map((project, index) => (
//                 <div
//                   key={project.id}
//                   className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-3 transform-gpu"
//                   style={{
//                     backgroundColor: cardColor,
//                     border: `2px solid ${theme === "dark" ? "#ffffff15" : "#00000010"}`,
//                     boxShadow:
//                       theme === "dark"
//                         ? `0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(255, 190, 99, 0.1)`
//                         : `0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(255, 190, 99, 0.15)`,
//                     animationDelay: `${index * 0.1}s`,
//                     width: "100%",
//                     maxWidth: "280px",
//                     margin: "0 auto",
//                   }}
//                   onClick={() => handleProjectClick(project)}
//                 >
//                   {/* Role Badges */}
//                   <div className="absolute top-3 left-3 z-20 flex gap-2 flex-wrap max-w-[calc(100%-24px)]">
//                     {Array.isArray(project.roles) &&
//                       project.roles.map((role, i) => (
//                         <span
//                           key={i}
//                           className="px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-all duration-300 group-hover:scale-105"
//                           style={{
//                             backgroundColor: borderColor,
//                             color: theme === "dark" ? "#1a1a1a" : "#ffffff",
//                             boxShadow: `0 2px 8px rgba(255, 190, 99, 0.4)`,
//                           }}
//                         >
//                           {typeof role === "string" ? role : role?.role}
//                         </span>
//                       ))}
//                   </div>

//                   {/* Image */}
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={project.image || projectImage}
//                       alt={getProjectName(project)}
//                       className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
//                       onError={(e) => {
//                         e.currentTarget.src = projectImage;
//                       }}
//                     />
//                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
//                       style={{
//                         background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 50%, ${borderColor}20 100%)`,
//                       }}
//                     />
//                     <div
//                       className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
//                       style={{
//                         backgroundColor: borderColor,
//                         boxShadow: `0 4px 12px rgba(255, 190, 99, 0.4)`,
//                       }}
//                     >
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="white"
//                         strokeWidth="2"
//                       >
//                         <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
//                         <polyline points="15,3 21,3 21,9"></polyline>
//                         <line x1="10" y1="14" x2="21" y2="3"></line>
//                       </svg>
//                     </div>
//                   </div>
//                   {/* Project Name – Top Bar */}
// <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
//   <div
//     className="p-3 pl-28"  /* pl-28 leaves space for the role badges on the left */
//     style={{
//       background:
//         theme === "dark"
//           ? "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0))"
//           : "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0))",
//     }}
//   >
//     <h3
//       className="text-base font-bold truncate"
//       style={{ color: textColor }}
//       title={getProjectName(project)}
//     >
//       {getProjectName(project)}
//     </h3>
//   </div>
// </div>


//                   {/* Project Name Overlay */}
//                   <div
//                     className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 pointer-events-none z-0"
//                     style={{
//                       background:
//                         theme === "dark"
//                           ? `linear-gradient(to top, rgba(35, 35, 44, 0.95) 0%, rgba(35, 35, 44, 0.8) 70%, transparent 100%)`
//                           : `linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 70%, transparent 100%)`,
//                       backdropFilter: "blur(10px)",
//                     }}
//                   >
//                     <h3
//                       className="text-lg font-bold group-hover:scale-105 transition-transform duration-300"
//                       style={{ color: textColor }}
//                     >
//                       {getProjectName(project)}
//                     </h3>
//                     <div
//                       className="h-1 rounded-full transition-all duration-500 group-hover:w-full mt-2"
//                       style={{ backgroundColor: borderColor, width: "40%" }}
//                     />
//                   </div>

//                   {/* Corner Accent */}
//                   <div
//                     className="absolute top-0 left-0 w-0 h-0 border-l-[24px] border-t-[24px] border-r-0 border-b-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                     style={{
//                       borderLeftColor: "transparent",
//                       borderTopColor: borderColor,
//                     }}
//                   />

//                   {/* Shine */}
//                   <div
//                     className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-pulse transition-opacity duration-700 pointer-events-none z-0"
//                     style={{ width: "20%", height: "100%" }}
//                   />

//                   {/* ================= FLAGS FOOTER ================= */}
//                   <div
//                         className="relative z-20 p-3 border-t space-y-2"
//                     style={{
//                       borderColor: theme === "dark" ? "#ffffff15" : "#00000010",
//                       backgroundColor: theme === "dark" ? "#1f1f27" : "#fff",
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {/* Toggle panel + fetch current */}
//                     <div className="flex items-center gap-2 justify-between">
//                       <button
//                         className="px-3 py-1 rounded-lg text-xs font-semibold"
//                         style={{ backgroundColor: ORANGE, color: "#1a1a1a" }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setFlagPanelOpen((p) => ({
//                             ...p,
//                             [project.id]: !p[project.id],
//                           }));
//                           if (!flagsByProject[project.id]) fetchFlags(project.id);
//                         }}
//                       >
//                         ⚑ Flags
//                       </button>

//                       <button
//                         className="px-3 py-1 rounded-lg text-xs font-semibold"
//                         style={{
//                           backgroundColor: `${ORANGE}22`,
//                           color: textColor,
//                           border: `1px solid ${ORANGE}66`,
//                         }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           fetchFlags(project.id);
//                         }}
//                         disabled={!!flagLoading[project.id]}
//                         title="GET /projects/{id}/flags/"
//                       >
//                         {flagLoading[project.id] ? "Loading…" : "Check current values"}
//                       </button>
//                     </div>

//                     {flagPanelOpen[project.id] && (
//                       <div className="space-y-3 text-xs">
//                         {/* Current values */}
//                         <div
//                           className="p-2 rounded-lg"
//                           style={{
//                             backgroundColor: `${ORANGE}14`,
//                             border: `1px solid ${ORANGE}44`,
//                             color: textColor,
//                           }}
//                         >
//                           <div className="font-bold mb-1">Current values</div>
//                           <pre
//                             className="text-[11px] overflow-auto"
//                             style={{ maxHeight: 120, whiteSpace: "pre-wrap" }}
//                           >
//                             {JSON.stringify(flagsByProject[project.id] || {}, null, 2)}
//                           </pre>
//                         </div>

//                         {/* Skip Supervisory */}
//                         <div className="flex flex-wrap items-center gap-2">
//                           <div className="font-semibold" style={{ color: textColor }}>
//                             Skip Supervisory
//                           </div>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "enable-skip-supervisory/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "enable-skip-supervisory/");
//                             }}
//                             title="POST /projects/{id}/enable-skip-supervisory/"
//                           >
//                             Enable
//                           </button>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "disable-skip-supervisory/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "disable-skip-supervisory/");
//                             }}
//                             title="POST /projects/{id}/disable-skip-supervisory/"
//                           >
//                             Disable
//                           </button>
//                         </div>

//                         {/* Checklist Repoetory */}
//                         <div className="flex flex-wrap items-center gap-2">
//                           <div className="font-semibold" style={{ color: textColor }}>
//                             Checklist Repoetory
//                           </div>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "enable-checklist-repoetory/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "enable-checklist-repoetory/");
//                             }}
//                             title="POST /projects/{id}/enable-checklist-repoetory/"
//                           >
//                             Enable
//                           </button>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "disable-checklist-repoetory/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "disable-checklist-repoetory/");
//                             }}
//                             title="POST /projects/{id}/disable-checklist-repoetory/"
//                           >
//                             Disable
//                           </button>
//                         </div>

//                         {/* Maker → Checker */}
//                         <div className="flex flex-wrap items-center gap-2">
//                           <div className="font-semibold" style={{ color: textColor }}>
//                             Maker → Checker
//                           </div>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "enable-maker-to-checker/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "enable-maker-to-checker/");
//                             }}
//                             title="POST /projects/{id}/enable-maker-to-checker/"
//                           >
//                             Enable
//                           </button>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "disable-maker-to-checker/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "disable-maker-to-checker/");
//                             }}
//                             title="POST /projects/{id}/disable-maker-to-checker/"
//                           >
//                             Disable
//                           </button>

//                           {/* Set explicitly */}
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "set-maker-to-checker/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "set-maker-to-checker/", { value: true });
//                             }}
//                             title='POST /projects/{id}/set-maker-to-checker/ {"value": true}'
//                           >
//                             Set True
//                           </button>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "set-maker-to-checker/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "set-maker-to-checker/", { value: false });
//                             }}
//                             title='POST /projects/{id}/set-maker-to-checker/ {"value": false}'
//                           >
//                             Set False
//                           </button>
//                         </div>

//                         {/* All flags at once */}
//                         <div className="flex flex-wrap items-center gap-2">
//                           <div className="font-semibold" style={{ color: textColor }}>
//                             All flags at once
//                           </div>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "enable-all-flags/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "enable-all-flags/");
//                             }}
//                             title="POST /projects/{id}/enable-all-flags/"
//                           >
//                             Enable all
//                           </button>
//                           <button
//                             className="px-2 py-1 rounded border"
//                             style={{ borderColor: ORANGE }}
//                             disabled={flagPosting[project.id] === "disable-all-flags/"}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               postFlagAction(project.id, "disable-all-flags/");
//                             }}
//                             title="POST /projects/{id}/disable-all-flags/"
//                           >
//                             Disable all
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   {/* =============== END FLAGS FOOTER =============== */}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// };

// export default Configuration;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import projectImage from "../Images/Project.png";
import axios from "axios";

import {
  Allprojects,
  getProjectsByOwnership,
  getProjectUserDetails,
  myProjectSchedules,
} from "../api";
import toast from "react-hot-toast";

// --- Helper for JWT decode ---
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}


const API_BASE = "https://konstruct.world";




const Configuration = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameCache, setNameCache] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);   // jis project ko delete karna hai
  const [deleteLoading, setDeleteLoading] = useState(false);


  // THEME palette
  const ORANGE = "#ffbe63";
  const BG_OFFWHITE = "#fcfaf7";
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#222";
  const iconColor = ORANGE;
  // === role gates (must be before any effects/hooks that use them) ===
const [role, setRole] = useState("");
const [isManagerRole, setIsManagerRole] = useState(false);
const [isSuperAdmin, setIsSuperAdmin] = useState(false);
const [showSchedModal, setShowSchedModal] = useState(false);

// Derived: hide all schedule UI for Admin / Manager / Super Admin
const hideSchedules = isSuperAdmin || isManagerRole || /admin/i.test(role);


  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      let userData = null;
      try {
        const userDataStr = localStorage.getItem("USER_DATA");
        if (userDataStr) {
          userData = JSON.parse(userDataStr);
        } else {
          const token =
            localStorage.getItem("ACCESS_TOKEN") ||
            localStorage.getItem("TOKEN") ||
            localStorage.getItem("token");
          if (token) userData = decodeJWT(token);
        }
      } catch {}

      const rolee =
        localStorage.getItem("ROLE") ||
        userData?.role ||
        userData?.roles?.[0] ||
        "";
        
        const isManager = userData?.is_manager;
        setRole(typeof rolee === "string" ? rolee : String(rolee || ""));
setIsManagerRole(!!isManager);


      const isSA =
  (typeof rolee === "string" && rolee.toLowerCase().includes("super admin")) ||
  userData?.superadmin === true ||          // if your backend sets this
  userData?.is_superadmin === true ||       // alternate naming
  userData?.is_staff === true;              // sometimes used as superuser

setIsSuperAdmin(!!isSA);

try {
        let response = null;

        if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
          response = await Allprojects();
        } else if (rolee === "Admin") {
          response = await getProjectUserDetails();
        } else if (isManager) {
          if (userData.entity_id) {
            response = await getProjectsByOwnership({
              entity_id: userData.entity_id,
            });
          } else if (userData.company_id) {
            response = await getProjectsByOwnership({
              company_id: userData.company_id,
            });
          } else if (userData.org || userData.organization_id) {
            const orgId = userData.org || userData.organization_id;
            response = await getProjectsByOwnership({ organization_id: orgId });
          } else {
            toast.error(
              "No entity, company, or organization found for this manager."
            );
            setProjects([]);
            setLoading(false);
            return;
          }
        }
        
        if (response && response.status === 200) {
          setProjects(
            Array.isArray(response.data) ? response.data : response.data.results || []
          );
        } else if (response) {
          toast.error(response.data?.message || "Failed to fetch projects.");
          setProjects([]);
        } else {
          const token =
            localStorage.getItem("ACCESS_TOKEN") ||
            localStorage.getItem("TOKEN") ||
            localStorage.getItem("token");
          if (token) {
            const data = decodeJWT(token);
            if (data && Array.isArray(data.accesses)) {
              const uniqueProjects = [];
              const seenIds = new Set();
              data.accesses.forEach((access) => {
                if (access.project_id && !seenIds.has(access.project_id)) {
                  uniqueProjects.push({
                    id: access.project_id,
                    name: access.project_name, // Set name directly if available
                    roles: access.roles,
                  });
                  seenIds.add(access.project_id);
                }
              });
              setProjects(uniqueProjects);
            } else {
              setProjects([]);
            }
          } else {
            setProjects([]);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error fetching projects.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  const handleConfirmDelete = async () => {
  if (!deleteTarget) return;

  setDeleteLoading(true);
  try {
    // 🔥 yahi pe tumhara "delete ka process" trigger hoga
    // Backend DRF default destroy = DELETE /projects/projects/:id/
    await axios.delete(
      `${API_BASE}/projects/projects/${deleteTarget.id}/`,
      { headers: authHeaders() }
    );

    toast.success("Project deleted successfully.");

    // UI se bhi hata do
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== deleteTarget.id);
      // agar activeProjectId wahi tha to usko reset
      if (activeProjectId === deleteTarget.id) {
        setActiveProjectId(updated[0]?.id ?? null);
      }
      return updated;
    });

    setDeleteTarget(null);
  } catch (e) {
    console.error(e);
    toast.error(
      e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Failed to delete project."
    );
  } finally {
    setDeleteLoading(false);
  }
};

  // const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  // Fallback: fetch project name by id if missing
  const getProjectName = (project) => {
    if (project.name) return project.name;
    if (nameCache[project.id]) return nameCache[project.id];

    // If name is not available and not cached, fetch and cache
    if (!nameCache[project.id]) {
      axios
        .get(`https://konstruct.world/projects/projects/${project.id}/`, {
        headers: {
           Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
         },
     })
        .then((res) => {
          if (res.data?.name) {
            setNameCache((prev) => ({
              ...prev,
              [project.id]: res.data.name,
            }));
          }
        })
        .catch(() => {
          setNameCache((prev) => ({
            ...prev,
            [project.id]: "Project " + project.id,
          }));
        });
    }
    // While loading, fallback to id as label
    return "Project " + project.id;
  };
const handleProjectClick = (project) => {
  const roleLower = (role || "").toLowerCase();

  const isProjectManagerOrHead =
    isManagerRole ||
    roleLower.includes("project manager") ||
    roleLower.includes("project head");

  if (isProjectManagerOrHead) {
    // 👉 Manager / Head yahan jayega
    navigate(`/overview/project/${project.id}`, { state: { project } });
  } else {
    // 👉 Baaki sab yahan jayenge
    navigate(`/project/${project.id}`, { state: { project } });
  }
};

  // const handleProjectClick = (project) => {
  //   navigate(`/project/${project.id}`, { state: { project } });
  // };

  const [flagsByProject, setFlagsByProject] = useState({});   // { [id]: flagsJson }
  const [flagModalOpen, setFlagModalOpen] = useState(null);   // projectId or null
  const [flagLoading, setFlagLoading] = useState({});         // { [id]: bool }
  const [flagPosting, setFlagPosting] = useState({});         // { [id]: "path" | null }
  // ---- Quick "My Schedules" state ----
const [activeProjectId, setActiveProjectId] = useState(null);
const [mySchedLoading, setMySchedLoading] = useState(false);
const [mySchedRaw, setMySchedRaw] = useState(null);
const [schedTab, setSchedTab] = useState("upcoming"); // "upcoming" | "ongoing"

  const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
});



// GET /projects/{id}/flags/
const fetchFlags = async (projectId) => {
  setFlagLoading((p) => ({ ...p, [projectId]: true }));
  try {
    const res = await axios.get(`${API_BASE}/projects/projects/${projectId}/flags/`, {
      headers: authHeaders(),
    });
    setFlagsByProject((p) => ({ ...p, [projectId]: res.data || {} }));
    toast.success("Flags loaded");
  } catch (e) {
    toast.error(e?.response?.data?.detail || "Failed to load flags");
  } finally {
    setFlagLoading((p) => ({ ...p, [projectId]: false }));
  }
};

// POST helper
// const postFlagAction = async (projectId, path, body = {}) => {
//   setFlagPosting((p) => ({ ...p, [projectId]: path }));
//   try {
//     await axios.post(`${API_BASE}/projects/projects/${projectId}/${path}`, body, {
//       headers: { ...authHeaders(), "Content-Type": "application/json" },
//     });
//     toast.success("Updated");
//     await fetchFlags(projectId);
//   } catch (e) {
//     toast.error(e?.response?.data?.detail || "Failed to update");
//   } finally {
//     setFlagPosting((p) => ({ ...p, [projectId]: null }));
//   }
// };
const postFlagAction = async (projectId, path, body = {}) => {
  const norm = (path || "").replace(/\/$/, ""); // remove trailing /
  setFlagPosting((p) => ({ ...p, [projectId]: path }));

  // guess the optimistic change based on endpoint
  let rollback = null;
  try {
    if (norm === "enable-skip-supervisory") rollback = optimisticUpdate(projectId, { skip_supervisory: true });
    if (norm === "disable-skip-supervisory") rollback = optimisticUpdate(projectId, { skip_supervisory: false });

    if (norm === "enable-checklist-repoetory") rollback = optimisticUpdate(projectId, { checklist_repoetory: true });
    if (norm === "disable-checklist-repoetory") rollback = optimisticUpdate(projectId, { checklist_repoetory: false });

    if (norm === "enable-maker-to-checker") rollback = optimisticUpdate(projectId, { maker_to_checker: true });
    if (norm === "disable-maker-to-checker") rollback = optimisticUpdate(projectId, { maker_to_checker: false });

    if (norm === "set-maker-to-checker") rollback = optimisticUpdate(projectId, { maker_to_checker: !!body.value });

    if (norm === "enable-all-flags") {
      rollback = optimisticUpdate(projectId, { skip_supervisory: true, checklist_repoetory: true, maker_to_checker: true });
    }
    if (norm === "disable-all-flags") {
      rollback = optimisticUpdate(projectId, { skip_supervisory: false, checklist_repoetory: false, maker_to_checker: false });
    }

    await axios.post(`${API_BASE}/projects/projects/${projectId}/${path}`, body, {
      headers: { ...authHeaders(), "Content-Type": "application/json" },
    });

    toast.success("Updated");
    await fetchFlags(projectId); // ensure we’re in sync with backend
  } catch (e) {
    if (rollback) rollback();
    toast.error(e?.response?.data?.detail || "Failed to update");
  } finally {
    setFlagPosting((p) => ({ ...p, [projectId]: null }));
  }
};


//newly added 3.00
// read boolean flag using a few possible key names
// const readBool = (obj, keys, fallback = false) => {
//   for (const k of keys) if (typeof obj?.[k] === "boolean") return obj[k];
//   return fallback;
// };

const readBool = (obj, keys, fallback = false) => {
  for (const k of keys) if (typeof obj?.[k] === "boolean") return obj[k];
  return fallback;
};

// For the currently-open project in the modal, compute flag booleans
const getCurrentFlags = (projectId) => {
  const f = flagsByProject[projectId] || {};
  return {
    skip: readBool(f, ["skip_supervisory", "skipSupervisory", "skip_supervisor", "skip_supervisory_enabled"]),
    repo: readBool(f, ["checklist_repoetory", "checklist_repository", "checklistRepoetory"]),
    m2c:  readBool(f, ["maker_to_checker", "makerToChecker"]),
  };
};
// Auto-select first project for the quick schedules widget
useEffect(() => {
  if (!activeProjectId && projects?.length) {
    setActiveProjectId(projects[0].id);
  }
}, [projects, activeProjectId]);

// Button styles (active vs idle) — uses your theme colors
const enableBtnStyle = (isOn) => isOn
  ? { backgroundColor: "#22c55e", color: "white", border: "1px solid rgba(34,197,94,0.4)" }
  : { backgroundColor: theme === "dark" ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" };

const disableBtnStyle = (isOn) => !isOn
  ? { backgroundColor: "#ef4444", color: "white", border: "1px solid rgba(239,68,68,0.4)" }
  : { backgroundColor: theme === "dark" ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" };

// Little ON/OFF pill
const StatusPill = ({ on }) => (
  <span
    className="px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{
      backgroundColor: on ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
      color: on ? "#16a34a" : "#dc2626",
      border: `1px solid ${on ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`
    }}
  >
    {on ? "ON" : "OFF"}
  </span>
);

// Optimistic update helper
const optimisticUpdate = (projectId, updates) => {
  const prev = flagsByProject[projectId];
  setFlagsByProject(p => ({ ...p, [projectId]: { ...(p[projectId] || {}), ...updates } }));
  // return rollback fn
  return () => setFlagsByProject(p => ({ ...p, [projectId]: prev }));
};
useEffect(() => {
  if (!activeProjectId || hideSchedules) return;   // ⬅️ guard
  const fetchMy = async () => {
    try {
      setMySchedLoading(true);
      const { data } = await myProjectSchedules(activeProjectId);
      setMySchedRaw(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load my schedules");
      setMySchedRaw(null);
    } finally {
      setMySchedLoading(false);
    }
  };
  fetchMy();
}, [activeProjectId, hideSchedules]);


useEffect(() => {
  if (hideSchedules && showSchedModal) setShowSchedModal(false);
}, [hideSchedules, showSchedModal]);



const { skip, repo, m2c } = getCurrentFlags(flagModalOpen);


// ---- Helpers for card formatting ----
const toDate = (v) => (v ? new Date(v) : null);
const fmtDate = (v) => {
  const d = toDate(v);
  if (!d) return "-";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};
const daysLeft = (end) => {
  const d = toDate(end);
  if (!d) return null;
  const today = new Date();
  const ms = d.setHours(0,0,0,0) - today.setHours(0,0,0,0);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};
const labelFromMapping = (s, m, t) => {
  // Try nice labels if API gives them; otherwise fall back
  const b = m?.building_name || m?.scope_label || null;
  const l = m?.level_name || null;
  const flat =
    t?.number || t?.flat_number || t?.flat?.number || t?.flat_id || null;

  // If schedule stage name is the only thing we have, use it
  const stage = s?.stage?.name || s?.stage_name || null;

  const pieces = [b, l, flat].filter(Boolean);
  if (pieces.length) return pieces.join(" > ");
  return stage || `Schedule #${s?.id}`;
};

// Normalize server payload into display rows
const normalizedRows = React.useMemo(() => {
  const src = Array.isArray(mySchedRaw)
    ? mySchedRaw
    : mySchedRaw?.results || mySchedRaw?.items || mySchedRaw?.schedules || [];

  const out = [];
  (src || []).forEach((s) => {
    const start = s.start_date || s.start;
    const end = s.end_date || s.end;

    const mappings = Array.isArray(s?.mappings) ? s.mappings : [];
    if (!mappings.length) {
      out.push({
        id: s.id,
        label: s?.stage?.name || s?.stage_name || `Schedule #${s?.id}`,
        start,
        end,
      });
      return;
    }

    mappings.forEach((m, i) => {
      const targets = Array.isArray(m?.targets) ? m.targets : [];
      if (!targets.length) {
        out.push({
          id: `${s.id}-${i}`,
          label: labelFromMapping(s, m, null),
          start,
          end,
        });
      } else {
        targets.forEach((t, ti) => {
          out.push({
            id: `${s.id}-${i}-${ti}`,
            label: labelFromMapping(s, m, t),
            start,
            end,
          });
        });
      }
    });
  });

  return out;
}, [mySchedRaw]);
// Modal visible?
// const [showSchedModal, setShowSchedModal] = useState(false);
// const hideSchedules = isSuperAdmin || isManagerRole || /admin/i.test(role);

// Counts & availability



// Derive "upcoming" vs "ongoing"
const { upcomingRows, ongoingRows } = React.useMemo(() => {
  const now = new Date();
  now.setHours(0,0,0,0);

  const upcoming = [];
  const ongoing = [];

  for (const r of normalizedRows) {
    const s = toDate(r.start);
    const e = toDate(r.end);
    if (s && s > now) {
      upcoming.push(r);
    } else if (s && e && s <= now && e >= now) {
      ongoing.push(r);
    } else if (!s && e && e >= now) {
      // if only end provided and it's in future → treat as upcoming
      upcoming.push(r);
    }
  }
  return { upcomingRows: upcoming, ongoingRows: ongoing };
}, [normalizedRows]);
const upcomingCount = (upcomingRows || []).length;
const ongoingCount = (ongoingRows || []).length;
const schedCount = upcomingCount + ongoingCount;
const hasSchedules = schedCount > 0;
// const [role, setRole] = useState("");
// const [isManagerRole, setIsManagerRole] = useState(false);

// ---- Modern UI helpers for My Schedules ----

// progress % from start->today->end (0..100)
const progressPct = (start, end) => {
  const s = toDate(start);
  const e = toDate(end);
  if (!s || !e) return null;
  const now = new Date();
  const total = e - s;
  const elapsed = Math.min(Math.max(now - s, 0), total);
  if (total <= 0) return null;
  return Math.round((elapsed / total) * 100);
};

const StatusChip = ({ end }) => {
  const d = daysLeft(end);
  let label = "-", style = {};
  if (typeof d === "number") {
    if (d < 0) {
      label = `${Math.abs(d)} overdue`;
      style = { background: "rgba(239,68,68,.12)", color: "#b91c1c", border: "1px solid rgba(239,68,68,.35)" };
    } else if (d === 0) {
      label = "Due today";
      style = { background: "rgba(245,158,11,.14)", color: "#92400e", border: "1px solid rgba(245,158,11,.35)" };
    } else if (d <= 7) {
      label = `${d} days left`;
      style = { background: "rgba(245,158,11,.14)", color: "#92400e", border: "1px solid rgba(245,158,11,.35)" };
    } else {
      label = `${d} days left`;
      style = { background: "rgba(16,185,129,.14)", color: "#065f46", border: "1px solid rgba(16,185,129,.35)" };
    }
  }
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={style}
    >
      {label}
    </span>
  );
};

const SegTabs = ({ tab, counts, onChange, textColor }) => (
  <div className="inline-flex items-center rounded-xl p-1 border"
       style={{ borderColor: "rgba(0,0,0,.08)", background: "rgba(0,0,0,.03)" }}>
    {["upcoming", "ongoing"].map((t, i) => {
      const active = tab === t;
      return (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition
                      ${active ? "shadow-sm" : "hover:bg-white/60"}`}
          style={{
            color: active ? "#fff" : textColor,
            background: active ? "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)" : "transparent",
          }}
        >
          {t === "upcoming" ? "Upcoming" : "Ongoing"}{" "}
          <span className={`ml-1 text-xs ${active ? "opacity-90" : "opacity-60"}`}>
            ({counts[t] ?? 0})
          </span>
        </button>
      );
    })}
  </div>
);

const SkeletonCard = ({ cardColor }) => (
  <div
    className="rounded-2xl border p-4 animate-pulse"
    style={{ backgroundColor: cardColor, borderColor: "rgba(0,0,0,.08)" }}
  >
    <div className="h-4 w-40 rounded bg-black/10 mb-3" />
    <div className="h-3 w-56 rounded bg-black/10 mb-2" />
    <div className="h-2 w-full rounded bg-black/10" />
  </div>
);

const ScheduleCard = ({ row, cardColor, textColor, borderColor }) => {
  const pct = progressPct(row.start, row.end);
  return (
    <div
      className="rounded-2xl border px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4
                 transition will-change-transform hover:-translate-y-[1px] hover:shadow-lg"
      style={{
        background: `linear-gradient(180deg, ${cardColor} 0%, ${cardColor} 60%, rgba(0,0,0,0.02) 100%)`,
        borderColor: "rgba(0,0,0,.08)",
      }}
    >
      {/* Left: icon + title */}
      <div className="flex items-start gap-3 sm:min-w-[260px]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.35)" }}
        >
          {/* calendar icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="text-[15px] md:text-[16px] font-semibold leading-5" style={{ color: textColor }}>
            {row.label}
          </div>
          <div className="text-xs md:text-sm opacity-70">
            End: {fmtDate(row.end)} • Start: {fmtDate(row.start)}
          </div>
          <div className="mt-1">
            <StatusChip end={row.end} />
          </div>
        </div>
      </div>

      {/* Middle: progress */}
      <div className="flex-1 w-full sm:w-auto">
        {typeof pct === "number" ? (
          <div className="w-full">
            <div className="flex items-center justify-between text-[11px] opacity-70 mb-1">
              <span>{fmtDate(row.start)}</span>
              <span>{fmtDate(row.end)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }}
              />
            </div>
          </div>
        ) : (
          <div className="text-xs opacity-60">Timeline unavailable</div>
        )}
      </div>

      {/* Right: actions */}
      {/* <div className="sm:ml-auto flex items-center gap-2">
        <button
          className="px-3 py-1.5 rounded-lg text-sm font-semibold border"
          style={{
            color: "#1f2937",
            background: "white",
            borderColor: "rgba(0,0,0,.08)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            toast("Feature unavailable");
          }}
        >
          Reject
        </button>
      </div> */}
    </div>
  );
};




return (
  <div
    className="flex min-h-screen transition-colors duration-300"
    style={{ backgroundColor: bgColor }}
  >
    <div className="my-8 mx-auto max-w-7xl pt-8 px-6 pb-10 w-full">
      <div
        className="relative rounded-3xl transition-all duration-300 hover:shadow-2xl"
        style={{
          backgroundColor: cardColor,
          border: `2px solid ${borderColor}`,
          boxShadow:
            theme === "dark"
              ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(255, 190, 99, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(255, 190, 99, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Decorative Background Elements */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: borderColor }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: borderColor }}
        />

        {/* Header Section */}
        <div className="relative z-10 text-center mb-12 pt-4">
          <div
            className="w-24 h-1 mx-auto mb-8 rounded-full"
            style={{ backgroundColor: borderColor }}
          />
          <h2
            className="text-5xl font-bold mb-4 tracking-tight relative inline-block"
            style={{
              color: textColor,
              textShadow:
                theme === "dark"
                  ? `0 2px 8px rgba(255, 190, 99, 0.3)`
                  : `0 2px 8px rgba(0, 0, 0, 0.1)`,
            }}
          >
            Projects
          </h2>
          <p
            className="text-lg font-medium opacity-80"
            style={{ color: textColor }}
          >
            Manage and explore your project portfolio
          </p>
        </div>

        {/* Content Section */}
        <div className="relative z-10 px-4">
         
{/* Top Scheduled Button */}
{!hideSchedules && (
<div className="flex justify-end mb-4">
  <button
    type="button"
    disabled={!hasSchedules}
    onClick={() => setShowSchedModal(true)}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border transition
                ${hasSchedules ? "text-white shadow hover:shadow-xl" : "opacity-60 cursor-not-allowed text-gray-700"}`}
    style={
      hasSchedules
        ? { background: "linear-gradient(135deg,#ef4444,#dc2626)", borderColor: "rgba(0,0,0,.12)" }
        : { background: "rgba(0,0,0,.08)", borderColor: "rgba(0,0,0,.12)" }
    }
  >
    {/* bell-ish icon */}
    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>
    Scheduled
    {hasSchedules && (
      <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/20">{schedCount}</span>
    )}
  </button>
</div>
)}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 rounded-full border-4 border-opacity-20 animate-spin"
                  style={{
                    borderColor: borderColor,
                    borderTopColor: borderColor,
                  }}
                />
                <div
                  className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-transparent animate-pulse"
                  style={{
                    borderTopColor: borderColor,
                    animationDuration: "1.5s",
                  }}
                />
              </div>
              <p
                className="text-xl font-semibold animate-pulse"
                style={{ color: textColor }}
              >
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme === "dark" ? "#ffffff10" : "#00000005",
                  border: `2px dashed ${borderColor}60`,
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={borderColor}
                  strokeWidth="1.5"
                >
                  <path d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: textColor }}
              >
                No Projects Available
              </h3>
              <p className="text-lg opacity-70" style={{ color: textColor }}>
                No projects have been assigned to your account yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-4">
            

              {projects.map((project, index) => (
                
                <div
                  key={project.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-3 transform-gpu"
                  style={{
                    backgroundColor: cardColor,
                    border: `2px solid ${theme === "dark" ? "#ffffff15" : "#00000010"}`,
                    boxShadow:
                      theme === "dark"
                        ? `0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(255, 190, 99, 0.1)`
                        : `0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(255, 190, 99, 0.15)`,
                    animationDelay: `${index * 0.1}s`,
                    width: "100%",
                    maxWidth: "280px",
                    margin: "0 auto",
                  }}
                  onClick={() => handleProjectClick(project)}
                >
                   {/* ❌ Delete X – only for super admin */}
    {isSuperAdmin && (
      <button
        type="button"
        className="
          absolute top-2 right-2 z-30
          w-7 h-7 rounded-full
          flex items-center justify-center
          text-xs font-bold
          shadow-md
          hover:scale-105
          transition
        "
        style={{
          backgroundColor: "#ef4444",
          color: "#fff",
          border: "1px solid rgba(0,0,0,0.15)",
        }}
        title="Delete project"
        onClick={(e) => {
          e.stopPropagation();      // card click na chale
          setDeleteTarget(project); // ✅ yahan project available hai
        }}
      >
        ×
      </button>
    )}
                  {/* Role Badges */}
                  <div className="absolute top-3 left-3 z-20 flex gap-1 flex-wrap max-w-[calc(100%-80px)]">
                    {Array.isArray(project.roles) &&
                      project.roles.map((role, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-all duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: borderColor,
                            color: theme === "dark" ? "#1a1a1a" : "#ffffff",
                            boxShadow: `0 2px 8px rgba(255, 190, 99, 0.4)`,
                          }}
                        >
                          {typeof role === "string" ? role : role?.role}
                        </span>
                      ))}
                  </div>

                  {/* Enhanced Project Name Badge - Top Right */}
                  <div className="absolute top-3 right-3 z-20 max-w-[calc(100%-120px)]">
                    <div
                      className="px-3 py-2 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: theme === "dark" 
                          ? "rgba(255, 255, 255, 0.15)" 
                          : "rgba(255, 255, 255, 0.9)",
                        border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}`,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                      }}
                    >
                      <h3
                        className="text-sm font-bold truncate text-center"
                        style={{ 
                          color: textColor,
                          textShadow: theme === "dark" ? "0 1px 2px rgba(0,0,0,0.5)" : "0 1px 2px rgba(255,255,255,0.8)"
                        }}
                        title={getProjectName(project)}
                      >
                        {getProjectName(project)}
                      </h3>
                      <div
                        className="h-0.5 rounded-full mt-1 mx-auto transition-all duration-500"
                        style={{ 
                          backgroundColor: borderColor, 
                          width: "80%",
                          boxShadow: `0 0 4px rgba(255, 190, 99, 0.6)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || projectImage}
                      alt={getProjectName(project)}
                      className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        e.currentTarget.src = projectImage;
                      }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                      style={{
                        background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 50%, ${borderColor}20 100%)`,
                      }}
                    />
                    <div
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
                      style={{
                        backgroundColor: borderColor,
                        boxShadow: `0 4px 12px rgba(255, 190, 99, 0.4)`,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15,3 21,3 21,9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </div>
                  </div>

                  {/* Project Name Overlay at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 pointer-events-none z-0"
                    style={{
                      background:
                        theme === "dark"
                          ? `linear-gradient(to top, rgba(35, 35, 44, 0.95) 0%, rgba(35, 35, 44, 0.8) 70%, transparent 100%)`
                          : `linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 70%, transparent 100%)`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <h3
                      className="text-lg font-bold group-hover:scale-105 transition-transform duration-300"
                      style={{ color: textColor }}
                    >
                      {getProjectName(project)}
                    </h3>
                    <div
                      className="h-1 rounded-full transition-all duration-500 group-hover:w-full mt-2"
                      style={{ backgroundColor: borderColor, width: "40%" }}
                    />
                  </div>

                  {/* Corner Accent */}
                  <div
                    className="absolute top-0 left-0 w-0 h-0 border-l-[24px] border-t-[24px] border-r-0 border-b-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      borderLeftColor: "transparent",
                      borderTopColor: borderColor,
                    }}
                  />

                  {/* Shine */}
                  <div
                    className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-pulse transition-opacity duration-700 pointer-events-none z-0"
                    style={{ width: "20%", height: "100%" }}
                  />

                  {/* ================= FLAGS FOOTER WITH POPUP ================= */}
                 {isSuperAdmin && (
  <div
    className="relative z-20 border-t transition-all duration-300"
    style={{
      borderColor: theme === "dark" ? "#ffffff20" : "#00000015",
      backgroundColor:
        theme === "dark"
          ? "linear-gradient(135deg, #1f1f27 0%, #232330 100%)"
          : "linear-gradient(135deg, #fff 0%, #fafafa 100%)",
      backdropFilter: "blur(10px)",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="p-3">
      <div className="flex items-center gap-2 justify-between">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          style={{
            backgroundColor: ORANGE,
            color: "#1a1a1a",
            boxShadow: `0 4px 12px rgba(255, 190, 99, 0.3)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setFlagModalOpen(project.id);
            if (!flagsByProject[project.id]) fetchFlags(project.id);
          }}
        >
          <span className="text-base">🚩</span>
          <span>Manage Flags</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>

        
      </div>
    </div>
  </div>
)}
                  {/* =============== END FLAGS FOOTER =============== */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
{/* =================== Scheduled Modal =================== */}
{ !hideSchedules && showSchedModal && (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)" }}
    onClick={() => setShowSchedModal(false)}
  >
    <div
      className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl"
      style={{ backgroundColor: cardColor, borderColor: "rgba(0,0,0,.12)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 py-4 border-b flex items-center gap-3"
        style={{
          backgroundColor: theme === "dark" ? "rgba(35,35,44,.92)" : "rgba(255,255,255,.92)",
          borderColor: "rgba(0,0,0,.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="text-lg font-semibold" style={{ color: textColor }}>My Schedules</div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Project selector (same state: activeProjectId) */}
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70" style={{ color: textColor }}>Project</span>
          <select
            className="border rounded-md px-3 py-2 bg-white/80 backdrop-blur"
            value={activeProjectId ?? ""}
            onChange={(e) => setActiveProjectId(Number(e.target.value) || null)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || `Project ${p.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs with counts */}
        <div className="ml-3">
          <SegTabs
            tab={schedTab}
            counts={{ upcoming: upcomingCount, ongoing: ongoingCount }}
            onChange={setSchedTab}
            textColor={textColor}
          />
        </div>

        {/* Close */}
        <button
          className="ml-2 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5"
          onClick={() => setShowSchedModal(false)}
          title="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {mySchedLoading ? (
          <div className="grid gap-3 md:gap-4">
            <SkeletonCard cardColor={cardColor} />
            <SkeletonCard cardColor={cardColor} />
            <SkeletonCard cardColor={cardColor} />
          </div>
        ) : (
          <>
            {((schedTab === "upcoming" ? upcomingRows : ongoingRows) || []).length > 0 ? (
              <div className="grid gap-3 md:gap-4">
                {(schedTab === "upcoming" ? upcomingRows : ongoingRows).map((row) => (
                  <ScheduleCard
                    key={row.id}
                    row={row}
                    cardColor={cardColor}
                    textColor={textColor}
                  />
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{ background: cardColor, borderColor: "rgba(0,0,0,.08)" }}
              >
                <div
                  className="mx-auto w-12 h-12 rounded-2xl mb-3 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,.06)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div className="font-semibold" style={{ color: textColor }}>
                  No {schedTab} items
                </div>
                <div className="text-sm opacity-70">You’re all caught up for this project.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
)}
{/* ================= end Scheduled Modal ================= */}
{/* =================== Delete Confirm Modal =================== */}
{isSuperAdmin && deleteTarget && (
  <div
    className="fixed inset-0 z-[65] flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)" }}
    onClick={() => !deleteLoading && setDeleteTarget(null)}
  >
    <div
      className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
      style={{ backgroundColor: cardColor, borderColor: "rgba(0,0,0,.12)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(0,0,0,.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.5)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div
              className="text-base font-semibold"
              style={{ color: textColor }}
            >
              Delete project?
            </div>
            <div
              className="text-xs opacity-70"
              style={{ color: textColor }}
            >
              This action cannot be undone. The delete process will run for this project.
            </div>
          </div>
        </div>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5"
          onClick={() => !deleteLoading && setDeleteTarget(null)}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-4">
        <div className="text-sm" style={{ color: textColor }}>
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {getProjectName(deleteTarget)}
          </span>{" "}
          ?
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-black/5 disabled:opacity-60"
            style={{ borderColor: "rgba(0,0,0,.12)" }}
            disabled={deleteLoading}
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#ef4444",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(239,68,68,.4)",
            }}
            disabled={deleteLoading}
            onClick={handleConfirmDelete}
          >
            {deleteLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-3h4m-6 3h8"
                  />
                </svg>
                Yes, delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{/* ================= end Delete Confirm Modal =================== */}


    {/* ================= FLAGS MODAL POPUP ================= */}
    {flagModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={() => setFlagModalOpen(null)}
      >
        <div
          className="relative w-full sm:max-w-xl md:max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 mt-8"
          style={{
            backgroundColor: cardColor,
            border: `2px solid ${borderColor}`,
            boxShadow:
              theme === "dark"
                ? `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 8px 32px rgba(255, 190, 99, 0.3)`
                : `0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(255, 190, 99, 0.4)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className="sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md"
            style={{
              backgroundColor: theme === "dark" 
                ? "rgba(35, 35, 44, 0.95)" 
                : "rgba(255, 255, 255, 0.95)",
              borderColor: theme === "dark" ? "#ffffff20" : "#00000015",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${ORANGE}20`,
                    border: `2px solid ${ORANGE}40`,
                  }}
                >
                  <span className="text-xl">🚩</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: textColor }}>
                    Project Flags
                  </h3>
                  <p className="text-sm opacity-70" style={{ color: textColor }}>
                    {getProjectName(projects.find(p => p.id === flagModalOpen) || { id: flagModalOpen })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: theme === "dark" 
                      ? `rgba(255, 190, 99, 0.15)` 
                      : `rgba(255, 190, 99, 0.1)`,
                    color: textColor,
                    border: `1px solid ${ORANGE}66`,
                  }}
                  onClick={() => fetchFlags(flagModalOpen)}
                  disabled={!!flagLoading[flagModalOpen]}
                >
                  {flagLoading[flagModalOpen] ? (
                    <>
                      <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
                
                <button
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    color: textColor,
                  }}
                  onClick={() => setFlagModalOpen(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Current Values Display */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: theme === "dark" 
                  ? "rgba(255, 190, 99, 0.08)" 
                  : "rgba(255, 190, 99, 0.05)",
                border: `1px solid ${ORANGE}30`,
              }}
            >
              {/* <div 
                className="px-4 py-3 flex items-center gap-2 font-bold text-base border-b"
                style={{ 
                  backgroundColor: theme === "dark" 
                    ? "rgba(255, 190, 99, 0.15)" 
                    : "rgba(255, 190, 99, 0.1)",
                  borderColor: `${ORANGE}30`,
                  color: textColor 
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke={ORANGE} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Current Flag Values
              </div> */}
              {/* <pre
  className="text-[11px] p-3"
  style={{ maxHeight: 160, overflow: "auto", color: textColor }}
>
  {JSON.stringify(flagsByProject[flagModalOpen] || {}, null, 2)}
</pre> */}
{/* {(() => {
  const f = flagsByProject[flagModalOpen] || {};
  const rows = [
    {
      label: "Skip Supervisory",
      value: readBool(f, ["skip_supervisory", "skipSupervisory", "skip_supervisor", "skip_supervisory_enabled"]),
    },
    {
      label: "Checklist Repository",
      value: readBool(f, ["checklist_repoetory", "checklist_repository"]),
    },
    {
      label: "Maker → Checker",
      value: readBool(f, ["maker_to_checker", "makerToChecker"]),
    },
  ];

  // If nothing loaded yet, nudge the user
  if (!Object.keys(f).length) {
    return (
      <div className="p-3 text-sm" style={{ color: textColor, opacity: 0.75 }}>
        Flags not loaded yet. Click <span style={{ color: ORANGE, fontWeight: 600 }}>Refresh</span>.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-lg border"
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
            borderColor: theme === "dark" ? "#ffffff14" : "#0000000f",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: r.value ? "#22c55e" : "#ef4444" }}
            />
            <span className="font-medium" style={{ color: textColor }}>
              {r.label}
            </span>
          </div>

          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: r.value ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              color: r.value ? "#16a34a" : "#dc2626",
              border: `1px solid ${
                r.value ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"
              }`,
            }}
          >
            {r.value ? "ON" : "OFF"}
          </span>
        </div>
      ))}
    </div>
  );
})()} */}


             
            </div>

            {/* Flag Controls */}
            <div className="space-y-4">
              {/* Skip Supervisory */}
              <div 
                className="rounded-xl p-5 transition-all duration-300"
                style={{
                  backgroundColor: theme === "dark" 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${theme === "dark" ? "#ffffff10" : "#00000008"}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ORANGE }} />
    <span className="font-semibold text-base" style={{ color: textColor }}>Skip Supervisory</span>
    <StatusPill on={skip} />
  </div>
</div>
                <div className="flex gap-3">
  <button
    className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
    style={enableBtnStyle(skip)}
    disabled={flagPosting[flagModalOpen] === "enable-skip-supervisory/" || skip === true}
    onClick={() => postFlagAction(flagModalOpen, "enable-skip-supervisory/")}
  >
    {flagPosting[flagModalOpen] === "enable-skip-supervisory/" ? "Enabling..." : "Enable"}
  </button>
                 <button
    className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
    style={disableBtnStyle(skip)}
    disabled={flagPosting[flagModalOpen] === "disable-skip-supervisory/" || skip === false}
    onClick={() => postFlagAction(flagModalOpen, "disable-skip-supervisory/")}
  >
    {flagPosting[flagModalOpen] === "disable-skip-supervisory/" ? "Disabling..." : "Disable"}
  </button>
                </div>
              </div>

              {/* Checklist Repository */}
              <div 
                className="rounded-xl p-5 transition-all duration-300"
                style={{
                  backgroundColor: theme === "dark" 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${theme === "dark" ? "#ffffff10" : "#00000008"}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ORANGE }} />
    <span className="font-semibold text-base" style={{ color: textColor }}>Checklist Repeat</span>
    <StatusPill on={repo} />
  </div>
</div>
                 <div className="flex gap-3">
  <button
    className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
    style={enableBtnStyle(repo)}
    disabled={flagPosting[flagModalOpen] === "enable-checklist-repoetory/" || repo === true}
    onClick={() => postFlagAction(flagModalOpen, "enable-checklist-repoetory/")}
  >
    {flagPosting[flagModalOpen] === "enable-checklist-repoetory/" ? "Enabling..." : "Enable"}
  </button>
                 <button
    className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
    style={disableBtnStyle(repo)}
    disabled={flagPosting[flagModalOpen] === "disable-checklist-repoetory/" || repo === false}
    onClick={() => postFlagAction(flagModalOpen, "disable-checklist-repoetory/")}
  >
    {flagPosting[flagModalOpen] === "disable-checklist-repoetory/" ? "Disabling..." : "Disable"}
  </button>
                </div>
              </div>

              {/* Maker → Checker */}
              <div 
                className="rounded-xl p-5 transition-all duration-300"
                style={{
                  backgroundColor: theme === "dark" 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${theme === "dark" ? "#ffffff10" : "#00000008"}`,
                }}
              >
               <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ORANGE }} />
    <span className="font-semibold text-base" style={{ color: textColor }}>Single Flow</span>
    <StatusPill on={m2c} />
  </div>
</div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                  <button
      className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
      style={enableBtnStyle(m2c)}
      disabled={flagPosting[flagModalOpen] === "enable-maker-to-checker/" || m2c === true}
      onClick={() => postFlagAction(flagModalOpen, "enable-maker-to-checker/")}
    >
      {flagPosting[flagModalOpen] === "enable-maker-to-checker/" ? "Enabling..." : "Enable"}
    </button>
                     <button
      className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
      style={disableBtnStyle(m2c)}
      disabled={flagPosting[flagModalOpen] === "disable-maker-to-checker/" || m2c === false}
      onClick={() => postFlagAction(flagModalOpen, "disable-maker-to-checker/")}
    >
      {flagPosting[flagModalOpen] === "disable-maker-to-checker/" ? "Disabling..." : "Disable"}
    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
      className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
      style={{
        backgroundColor: m2c ? "#3b82f6" : (theme === "dark" ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)"),
        color: m2c ? "white" : "#3b82f6",
        border: "1px solid rgba(59,130,246,0.3)"
      }}
      disabled={flagPosting[flagModalOpen] === "set-maker-to-checker/" || m2c === true}
      onClick={() => postFlagAction(flagModalOpen, "set-maker-to-checker/", { value: true })}
    >
      {flagPosting[flagModalOpen] === "set-maker-to-checker/" ? "Setting..." : "Set True"}
    </button>
                     <button
      className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
      style={{
        backgroundColor: !m2c ? "#9ca3af" : (theme === "dark" ? "rgba(156,163,175,0.2)" : "rgba(156,163,175,0.1)"),
        color: !m2c ? "white" : "#6b7280",
        border: "1px solid rgba(156,163,175,0.3)"
      }}
      disabled={flagPosting[flagModalOpen] === "set-maker-to-checker/" || m2c === false}
      onClick={() => postFlagAction(flagModalOpen, "set-maker-to-checker/", { value: false })}
    >
      {flagPosting[flagModalOpen] === "set-maker-to-checker/" ? "Setting..." : "Set False"}
    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Operations */}
              <div 
                className="rounded-xl p-5 transition-all duration-300"
                style={{
                  backgroundColor: theme === "dark" 
                    ? "rgba(147, 51, 234, 0.1)" 
                    : "rgba(147, 51, 234, 0.05)",
                  border: `1px solid rgba(147, 51, 234, 0.3)`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#9333ea" }}
                    />
                    <span className="font-semibold text-base" style={{ color: textColor }}>
                      Bulk Operations
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-6 py-4 rounded-lg text-base font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{ 
                      backgroundColor: "#22c55e",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                    }}
                    disabled={flagPosting[flagModalOpen] === "enable-all-flags/"}
                    onClick={() => postFlagAction(flagModalOpen, "enable-all-flags/")}
                  >
                    {flagPosting[flagModalOpen] === "enable-all-flags/" ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enabling All...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Enable All Flags
                      </div>
                    )}
                  </button>
                  <button
                    className="flex-1 px-6 py-4 rounded-lg text-base font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{ 
                      backgroundColor: "#ef4444",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
                    }}
                    disabled={flagPosting[flagModalOpen] === "disable-all-flags/"}
                    onClick={() => postFlagAction(flagModalOpen, "disable-all-flags/")}
                  >
                    {flagPosting[flagModalOpen] === "disable-all-flags/" ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Disabling All...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Disable All Flags
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* =============== END FLAGS MODAL =============== */}
  </div>
);

};

export default Configuration;