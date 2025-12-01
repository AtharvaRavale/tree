// import React, { useEffect, useRef, useState } from "react";
// import profile from "../../src/Images/profile.jpg";
// import { IoMdArrowDropdown } from "react-icons/io";
// import {
//   FiMail,
//   FiPhone,
//   FiCalendar,
//   FiClock,
//   FiUser,
//   FiSettings,
//   FiLogOut,
//   FiBriefcase,
//   FiShield,
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import { organnizationInstance } from "../api/axiosInstance";

// const ORANGE = "#ffbe63";
// const BG_OFFWHITE = "#fcfaf7";

// function Profile({ onClose }) {
//   const [manage, setManage] = useState(false);
//   const dropdownRef = useRef(null);
//   const profileRef = useRef(null);
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const [hydrated, setHydrated] = useState(false);

//   const [userData, setUserData] = useState(null);
//   const [accesses, setAccesses] = useState([]);

//   // Org/company/entity details
//   const [organizationDetails, setOrganizationDetails] = useState({
//     organization: null,
//     company: null,
//     entity: null,
//     loading: true,
//     error: null,
//   });

//   // Palette
//   const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
//   const cardColor = theme === "dark" ? "#23232c" : "#fff";
//   const borderColor = ORANGE;
//   const textColor = theme === "dark" ? "#fff" : "#9c670d";
//   const iconColor = ORANGE;
//   const accentBg = ORANGE;

//   // Fetch org/company/entity details
//   const fetchOrganizationDetails = async (userData) => {
//     if (!userData) return;
//     try {
//       setOrganizationDetails((prev) => ({
//         ...prev,
//         loading: true,
//         error: null,
//       }));
//       const results = {};
//       if (userData.org) {
//         try {
//           const orgResponse = await organnizationInstance.get(
//             `organizations/${userData.org}/`
//           );
//           results.organization = orgResponse.data;
//         } catch {}
//       }
//       if (userData.company_id || userData.company) {
//         const companyId = userData.company_id || userData.company;
//         try {
//           const companyResponse = await organnizationInstance.get(
//             `companies/${companyId}/`
//           );
//           results.company = companyResponse.data;
//         } catch {}
//       }
//       if (userData.entity_id || userData.entity) {
//         const entityId = userData.entity_id || userData.entity;
//         try {
//           const entityResponse = await organnizationInstance.get(
//             `entities/${entityId}/`
//           );
//           results.entity = entityResponse.data;
//         } catch {}
//       }
//       setOrganizationDetails({
//         ...results,
//         loading: false,
//         error: null,
//       });
//     } catch (error) {
//       setOrganizationDetails((prev) => ({
//         ...prev,
//         loading: false,
//         error: "Failed to load organization details",
//       }));
//     }
//   };

//   useEffect(() => {
//     const userString = localStorage.getItem("USER_DATA");
//     if (userString && userString !== "undefined") {
//       const parsedUserData = JSON.parse(userString);
//       setUserData(parsedUserData);
//       fetchOrganizationDetails(parsedUserData);
//     }
//     const accessString = localStorage.getItem("ACCESSES");
//     if (accessString && accessString !== "undefined") {
//       try {
//         setAccesses(JSON.parse(accessString));
//       } catch {
//         setAccesses([]);
//       }
//     }
//     setHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (hydrated && !userData) {
//       navigate("/login", { replace: true });
//     }
//   }, [hydrated, userData, navigate]);

//   // Extract unique roles
//   let allRoles = [];
//   if (Array.isArray(accesses)) {
//     accesses.forEach((access) => {
//       if (access.roles && Array.isArray(access.roles)) {
//         access.roles.forEach((role) => {
//           const roleStr = typeof role === "string" ? role : role?.role;
//           if (roleStr && !allRoles.includes(roleStr)) {
//             allRoles.push(roleStr);
//           }
//         });
//       }
//     });
//   }

//   let role = "User";
//   if (userData?.superadmin || userData?.is_staff) {
//     role = "Super Admin";
//   } else if (userData?.is_client) {
//     role = "Admin";
//   } else if (userData?.is_manager) {
//     role = "Manager";
//   } else if (allRoles.length > 0) {
//     const uniqueRoles = [...new Set(allRoles)];
//     role = uniqueRoles.join(", ");
//   }

//   useEffect(() => {
//     localStorage.setItem("ROLE", role);
//   }, [role]);

//   // Close profile when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         onClose();
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setManage(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   // Sign out logic
//   const handleSignOut = () => {
//     localStorage.removeItem("ACCESS_TOKEN");
//     localStorage.removeItem("REFRESH_TOKEN");
//     localStorage.removeItem("USER_DATA");
//     localStorage.removeItem("ACCESSES");
//     localStorage.removeItem("ROLE");
//     navigate("/login");
//     if (typeof onClose === "function") onClose();
//   };

//   // Helper functions
//   const isValidString = (value) => value && String(value).trim() !== "";
//   const hasContactData = () =>
//     isValidString(userData?.email) ||
//     isValidString(userData?.phone_number) ||
//     isValidString(userData?.date_joined) ||
//     isValidString(userData?.last_login);

//   const hasOrganizationData = () =>
//     organizationDetails.organization ||
//     organizationDetails.company ||
//     organizationDetails.entity ||
//     isValidString(userData?.org);

//   // ---- VALUE COLOR: STRONG ORANGE (for ALL field values) ----
//   const valueColor = "#bb5600"; // Strong readable orange

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-start justify-end"
//       style={{
//         background: "rgba(20,16,10,0.33)",
//         backdropFilter: "blur(2px)",
//       }}
//     >
//       <div
//         ref={profileRef}
//         className="w-full max-w-md mx-auto rounded-3xl overflow-hidden max-h-[88vh] flex flex-col relative"
//         style={{
//           background: cardColor,
//           border: `2px solid ${borderColor}`,
//           color: textColor,
//           boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
//           marginTop: "32px",
//           marginRight: "32px",
//         }}
//       >
//         {/* Orange gradient bar */}
//         <div
//           style={{
//             width: "100%",
//             height: 5,
//             background: "linear-gradient(90deg, #ffbe63 30%, #ffd080 100%)",
//             borderTopLeftRadius: 18,
//             borderTopRightRadius: 18,
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: 20,
//           }}
//         ></div>

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: 14,
//             right: 18,
//             background: "#fff8f0",
//             border: `1.5px solid ${borderColor}`,
//             borderRadius: "50%",
//             width: 32,
//             height: 32,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: iconColor,
//             zIndex: 40,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//           }}
//           title="Close"
//         >
//           <span style={{ fontWeight: 700, fontSize: 21 }}>×</span>
//         </button>

//         {/* Header */}
//         <div
//           style={{
//             background: bgColor,
//             borderBottom: `1.5px solid ${borderColor}`,
//             padding: "32px 0 18px 0",
//           }}
//           className="flex flex-col items-center"
//         >
//           <img
//             src={profile}
//             alt="profile"
//             style={{
//               height: 76,
//               width: 76,
//               borderRadius: "50%",
//               objectFit: "cover",
//               border: `3px solid ${ORANGE}`,
//               marginBottom: 8,
//               boxShadow: "0 0 0 3px #fff",
//             }}
//           />
//           <h2
//             style={{
//               fontWeight: 700,
//               fontSize: 22,
//               marginBottom: 4,
//               color: textColor,
//             }}
//           >
//             {userData?.username}
//           </h2>
//           <div style={{ color: "#a37d31", fontSize: 15, marginBottom: 2 }}>
//             ID: {userData?.user_id}
//           </div>
//           <div
//             style={{
//               background: accentBg,
//               color: "#ad5700",
//               borderRadius: 14,
//               fontWeight: 600,
//               fontSize: 14,
//               padding: "4px 16px",
//               margin: "7px 0",
//               boxShadow: "0 1px 4px rgba(255,190,99,0.08)",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 7,
//             }}
//           >
//             <FiShield size={15} style={{ color: "#ad5700" }} /> {role}
//           </div>
//         </div>

//         {/* Scrollable content area */}
//         <div
//           className="flex-1 overflow-y-auto px-6 py-5"
//           style={{
//             background: theme === "dark" ? "#23232c" : "#fff",
//             minHeight: 160,
//           }}
//         >
//           {/* Project Roles Section */}
//           {accesses?.length > 0 && (
//             <div
//               className="rounded-2xl p-5 mb-5"
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <div
//                 className="flex items-center gap-2 mb-4"
//                 style={{ color: ORANGE }}
//               >
//                 <FiBriefcase size={18} />
//                 <h3
//                   className="font-semibold text-base"
//                   style={{ color: "#9c670d" }}
//                 >
//                   Project Access
//                 </h3>
//               </div>
//               <div className="space-y-3">
//                 {accesses.slice(0, 3).map(
//                   (access, idx) =>
//                     isValidString(access.project_id) && (
//                       <div
//                         key={idx}
//                         className="rounded-xl p-4"
//                         style={{
//                           background: "#fff",
//                           border: `1px solid ${borderColor}`,
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <span
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {access.project_name ||
//                               `Project ${access.project_id}`}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span
//                             className="text-sm font-medium"
//                             style={{ color: "#a37d31" }}
//                           >
//                             ID: {access.project_id}
//                           </span>
//                           <div className="flex flex-wrap gap-2">
//                             {access.roles?.slice(0, 2).map((role, j) => {
//                               const roleStr =
//                                 typeof role === "string" ? role : role?.role;
//                               return isValidString(roleStr) ? (
//                                 <span
//                                   key={j}
//                                   className="px-3 py-1"
//                                   style={{
//                                     background: ORANGE,
//                                     color: "#ad5700",
//                                     borderRadius: 12,
//                                     fontWeight: 600,
//                                     fontSize: 12,
//                                   }}
//                                 >
//                                   {roleStr}
//                                 </span>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                 )}
//                 {accesses.length > 3 && (
//                   <div
//                     className="text-center text-sm pt-2"
//                     style={{ color: "#a86c10" }}
//                   >
//                     +{accesses.length - 3} more projects
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Contact Information */}
//           {hasContactData() && (
//             <div
//               className="rounded-2xl p-5 mb-5"
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <h3
//                 className="font-semibold mb-4 flex items-center gap-2 text-base"
//                 style={{ color: "#9c670d" }}
//               >
//                 <FiMail size={18} />
//                 Contact Details
//               </h3>
//               <div className="space-y-3">
//                 {isValidString(userData?.email) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiMail size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Email
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.email}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.phone_number) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiPhone size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Phone
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.phone_number}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.date_joined) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiCalendar size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Joined
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.date_joined}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.last_login) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiClock size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Last Login
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.last_login}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Organization Section */}
//           {hasOrganizationData() && (
//             <div
//               className="rounded-2xl p-5 mb-4 relative"
//               ref={dropdownRef}
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <h3
//                 className="font-semibold mb-4 flex items-center gap-2 text-base"
//                 style={{ color: "#9c670d" }}
//               >
//                 <FiBriefcase size={18} />
//                 Organization Details
//               </h3>
//               {organizationDetails.loading ? (
//                 <div
//                   className="flex items-center justify-center p-6 rounded-xl"
//                   style={{
//                     background: "#fff0e1",
//                     border: `1px solid ${borderColor}`,
//                   }}
//                 >
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
//                   <span
//                     className="ml-3 text-sm font-medium"
//                     style={{ color: "#ab7a13" }}
//                   >
//                     Loading organization details...
//                   </span>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {/* Organization */}
//                   {organizationDetails.organization && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.organization.organization_name
//                             ? organizationDetails.organization
//                                 .organization_name[0]
//                             : "O"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Organization
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.organization
//                               .organization_name || `Org ${userData.org}`}
//                           </p>
//                           {organizationDetails.organization.contact_email && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {organizationDetails.organization.contact_email}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Company */}
//                   {organizationDetails.company && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.company.name
//                             ? organizationDetails.company.name[0]
//                             : "C"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Company
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.company.name}
//                           </p>
//                           {(organizationDetails.company.region ||
//                             organizationDetails.company.country) && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {[
//                                 organizationDetails.company.region,
//                                 organizationDetails.company.country,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Entity */}
//                   {organizationDetails.entity && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.entity.name
//                             ? organizationDetails.entity.name[0]
//                             : "E"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Entity
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.entity.name}
//                           </p>
//                           {(organizationDetails.entity.state ||
//                             organizationDetails.entity.region ||
//                             organizationDetails.entity.zone) && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {[
//                                 organizationDetails.entity.state,
//                                 organizationDetails.entity.region,
//                                 organizationDetails.entity.zone,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Fallback: org ID only */}
//                   {!organizationDetails.organization &&
//                     !organizationDetails.company &&
//                     !organizationDetails.entity &&
//                     isValidString(userData?.org) && (
//                       <button
//                         onClick={() => setManage(!manage)}
//                         className="w-full flex items-center justify-between p-4 rounded-xl"
//                         style={{
//                           background: "#fff",
//                           border: `1px solid ${borderColor}`,
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div
//                             className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                             style={{ background: accentBg, color: "#ad5700" }}
//                           >
//                             {isValidString(userData?.organization_name)
//                               ? String(userData.organization_name)[0]
//                               : String(userData.org)[0]}
//                           </div>
//                           <div className="text-left">
//                             <p
//                               className="font-semibold text-base"
//                               style={{ color: valueColor }}
//                             >
//                               {userData.organization_name ||
//                                 `Organization ${userData.org}`}
//                             </p>
//                             <p className="text-sm" style={{ color: "#bfa672" }}>
//                               Org ID: {userData.org}
//                             </p>
//                           </div>
//                         </div>
//                         <IoMdArrowDropdown
//                           size={20}
//                           style={{
//                             color: iconColor,
//                             transform: manage ? "rotate(180deg)" : undefined,
//                             transition: "transform 0.2s",
//                           }}
//                         />
//                       </button>
//                     )}
//                   {/* Manage Dropdown */}
//                   {manage && (
//                     <div
//                       className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50"
//                       style={{
//                         background: cardColor,
//                         border: `1.5px solid ${borderColor}`,
//                         boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
//                         animation: "slide-in-from-top .23s",
//                       }}
//                     >
//                       <button
//                         className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
//                         style={{
//                           background: ORANGE,
//                           color: "#ad5700",
//                         }}
//                         onClick={() =>
//                           alert("Organization management coming soon!")
//                         }
//                       >
//                         <FiSettings size={16} />
//                         Manage Organization
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {organizationDetails.error && (
//                 <div
//                   className="p-4 rounded-xl"
//                   style={{ background: "#ffeded", border: `1px solid #e96232` }}
//                 >
//                   <p className="text-red-400 text-sm font-medium">
//                     {organizationDetails.error}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Action buttons */}
//         <div
//           style={{
//             background: cardColor,
//             borderTop: `1.5px solid ${borderColor}`,
//             padding: 20,
//             borderBottomLeftRadius: 24,
//             borderBottomRightRadius: 24,
//           }}
//           className="flex gap-4"
//         >
//           <button
//             className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//             style={{
//               background: ORANGE,
//               color: "#8a4c00",
//               boxShadow: "0 2px 8px rgba(255, 190, 99, 0.15)",
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//             onClick={() => alert("Account details feature coming soon!")}
//           >
//             <FiUser size={16} style={{ color: "#ad5700" }} /> My Account
//           </button>
//           <button
//             className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//             style={{
//               background: "#fff0e1",
//               color: "#e24717",
//               border: `1.5px solid #e24717`,
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//             onClick={handleSignOut}
//           >
//             <FiLogOut size={16} style={{ color: "#e24717" }} /> Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

// import { getUserDetailsById } from "../api"; 
// import React, { useEffect, useRef, useState } from "react";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { ensureSlash } from "../utils/http";

// import {
//   FiMail,
//   FiPhone,
//   FiCalendar,
//   FiClock,
//   FiUser,
//   FiSettings,
//   FiLogOut,
//   FiBriefcase,
//   FiShield,
//   FiPlus,
//   FiCamera, 
//   FiUpload,  
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import axiosInstance, { organnizationInstance } from "../api/axiosInstance";
// import axios from "axios";

// const ORANGE = "#ffbe63";
// const BG_OFFWHITE = "#fcfaf7";

// // ---- Helper: Get Initials ----
// function getInitials(user) {
//   if (!user) return "";
//   if (user.first_name || user.last_name) {
//     return (
//       (user.first_name?.charAt(0) || "") +
//       (user.last_name?.charAt(0) || "")
//     ).toUpperCase();
//   }
//   if (user.username) {
//     // Try to split by space, dot, underscore, or hyphen
//     const parts = user.username.split(/[\s._-]+/);
//     return (
//       (parts[0]?.charAt(0) || "") + (parts[1]?.charAt(0) || "")
//     ).toUpperCase();
//   }
//   return "";
// }

// function Profile({ onClose }) {
//   const [manage, setManage] = useState(false);
//   const dropdownRef = useRef(null);
//   const profileRef = useRef(null);
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const [hydrated, setHydrated] = useState(false);
//   const [nameCache, setNameCache] = useState({});
//   const [uploadingPhoto, setUploadingPhoto] = useState(false);
//   const [uploadErr, setUploadErr] = useState(null);
//   const fileInputRef = useRef(null);
//   const AVATAR_URL_KEY = (id) => `USER_AVATAR_URL_${id}`;
// const AVATAR_B64_KEY = (id) => `USER_AVATAR_DATAURL_${id}`;
// const cacheBust = (url) =>
//   url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : url;
// const attendFileRef = useRef(null);

// const openAttendanceFilePicker = () => attendFileRef.current?.click();

// const onAttendanceFileSelected = async (e) => {
//   const file = e.target.files?.[0];
//   if (!file) return;
//   setAttErr(null);
//   try {
//     // reuse your shrinker to keep payload small
//     const dataUrl = await shrinkImageToDataURL(file, 720, 0.9);
//     setShotDataURL(dataUrl);  // this plugs into the same markAttendance() path
//     stopCamera();             // ensure camera is off after choosing a file
//   } catch (err) {
//     setAttErr("Could not read the selected image.");
//   } finally {
//     if (e?.target) e.target.value = "";
//   }
// };

// const fileToDataUrl = (file) =>
//   new Promise((res, rej) => {
//     const fr = new FileReader();
//     fr.onload = () => res(fr.result);
//     fr.onerror = rej;
//     fr.readAsDataURL(file);
//   });

// // optional: downsize before saving (keeps localStorage small)
// async function shrinkImageToDataURL(file, maxW = 256, quality = 0.85) {
//   const dataUrl = await fileToDataUrl(file);
//   const img = new Image();
//   img.src = dataUrl;
//   await new Promise((r) => (img.onload = r));
//   const scale = Math.min(1, maxW / img.width);
//   const w = Math.round(img.width * scale);
//   const h = Math.round(img.height * scale);
//   const canvas = document.createElement("canvas");
//   canvas.width = w; canvas.height = h;
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 0, 0, w, h);
//   return canvas.toDataURL("image/jpeg", quality);
// }

// const normImg = (u) =>
//   u && !/^https?:\/\//i.test(u)
//     ? `https://konstruct.world${u.startsWith("/") ? "" : "/"}${u}`
//     : u;
//   const [userData, setUserData] = useState(null);
//   const [accesses, setAccesses] = useState([]);

//   //made new by atharva upload img 
//   const handlePickPhoto = () => fileInputRef.current?.click();

// const handlePhotoSelected = async (e) => {
//   const file = e.target.files?.[0];
//   if (!file || !userData) return;

//   setUploadErr(null);
//   setUploadingPhoto(true);

//   const userId = String(userData.user_id || userData.id);
//   const FACE_ENROLL_URL = "/v2/face/enroll/";

//   try {
//     // 1) Instant local preview + persist fallback
//     const previewB64 = await shrinkImageToDataURL(file, 256, 0.85);
//     localStorage.setItem(AVATAR_B64_KEY(userId), previewB64);
//     setUserData((prev) =>
//       prev ? { ...prev, profile_image: previewB64, photo: previewB64 } : prev
//     );

//     // 2) Upload to server (multipart, no manual Content-Type)
//     const fd = new FormData();
//     fd.append("user_id", userId);
//     fd.append("photo", file, file.name || "profile.jpg");
//     fd.append("replace", "true");
//     await axiosInstance.post(ensureSlash(FACE_ENROLL_URL), fd);

//     // 3) Re-fetch canonical user profile and persist the SERVER url
//     const { data } = await getUserDetailsById(userId);
//     const remote = normImg(data.profile_image || data.photo);
//     const finalUrl = cacheBust(remote);

//     const updated = { ...data, profile_image: finalUrl, photo: finalUrl };
//     setUserData(updated);
//     localStorage.setItem("USER_DATA", JSON.stringify(updated));
//     localStorage.setItem(AVATAR_URL_KEY(userId), finalUrl);
//   } catch (err) {
//     const r = err?.response;
//     const msg =
//       (r?.data && (r.data.photo || r.data.detail || r.data.message)) ||
//       (typeof r?.data === "string" ? r.data : null) ||
//       (err?.message === "Network Error"
//         ? "Network Error: CORS is blocking this call."
//         : err?.message) ||
//       "Photo upload failed.";
//     setUploadErr(msg);
//     // keep the preview (already set & cached)
//   } finally {
//     setUploadingPhoto(false);
//     if (e?.target) e.target.value = "";
//   }
// };


//   // Org/company/entity details
//   const [organizationDetails, setOrganizationDetails] = useState({
//     organization: null,
//     company: null,
//     entity: null,
//     loading: true,
//     error: null,
//   });

//   // ---- PROJECT NAME GETTER ----
//   const getProjectName = (access) => {
//     if (access.project_name) return access.project_name;
//     if (nameCache[access.project_id]) return nameCache[access.project_id];

//     // If not available and not cached, fetch and cache by project_id
//     if (access.project_id && !nameCache[access.project_id]) {
//       axios
//         .get(`https://konstruct.world/projects/projects/${access.project_id}/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
//           },
//         })
//         .then((res) => {
//           if (res.data?.name) {
//             setNameCache((prev) => ({
//               ...prev,
//               [access.project_id]: res.data.name,
//             }));
//           }
//         })
//         .catch(() => {
//           setNameCache((prev) => ({
//             ...prev,
//             [access.project_id]: "Project " + access.project_id,
//           }));
//         });
//     }
//     // While loading, fallback to id as label
//     return "Project " + access.project_id;
//   };

//   // Palette
//   const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
//   const cardColor = theme === "dark" ? "#23232c" : "#fff";
//   const borderColor = ORANGE;
//   const textColor = theme === "dark" ? "#fff" : "#9c670d";
//   const iconColor = ORANGE;
//   const accentBg = ORANGE;

//   // Fetch org/company/entity details
//   const fetchOrganizationDetails = async (userData) => {
//     if (!userData) return;
//     try {
//       setOrganizationDetails((prev) => ({
//         ...prev,
//         loading: true,
//         error: null,
//       }));
//       const results = {};
//       if (userData.org) {
//         try {
//           const orgResponse = await organnizationInstance.get(
//             `organizations/${userData.org}/`
//           );
//           results.organization = orgResponse.data;
//         } catch {}
//       }
//       if (userData.company_id || userData.company) {
//         const companyId = userData.company_id || userData.company;
//         try {
//           const companyResponse = await organnizationInstance.get(
//             `companies/${companyId}/`
//           );
//           results.company = companyResponse.data;
//         } catch {}
//       }
//       if (userData.entity_id || userData.entity) {
//         const entityId = userData.entity_id || userData.entity;
//         try {
//           const entityResponse = await organnizationInstance.get(
//             `entities/${entityId}/`
//           );
//           results.entity = entityResponse.data;
//         } catch {}
//       }
//       setOrganizationDetails({
//         ...results,
//         loading: false,
//         error: null,
//       });
//     } catch (error) {
//       setOrganizationDetails((prev) => ({
//         ...prev,
//         loading: false,
//         error: "Failed to load organization details",
//       }));
//     }
//   };

//   useEffect(() => {
//     const userString = localStorage.getItem("USER_DATA");
//     if (userString && userString !== "undefined") {
//       // const parsedUserData = JSON.parse(userString);
//       // setUserData(parsedUserData);
//       // fetchOrganizationDetails(parsedUserData);
//       const parsed = JSON.parse(userString);
//       const uid = String(parsed.user_id || parsed.id || "");
//       const urlFromCache = uid && localStorage.getItem(AVATAR_URL_KEY(uid));
//       const b64FromCache = uid && localStorage.getItem(AVATAR_B64_KEY(uid));
//       const serverUrl = parsed?.profile_image || parsed?.photo || "";
//       const chosen = urlFromCache || serverUrl || b64FromCache || null;
//       const merged = chosen ? { ...parsed, profile_image: chosen, photo: chosen } : parsed;
//       setUserData(merged);
//       fetchOrganizationDetails(merged);
//     }
//     const accessString = localStorage.getItem("ACCESSES");
//     if (accessString && accessString !== "undefined") {
//       try {
//         setAccesses(JSON.parse(accessString));
//       } catch {
//         setAccesses([]);
//       }
//     }
//     setHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (hydrated && !userData) {
//       navigate("/login", { replace: true });
//     }
//   }, [hydrated, userData, navigate]);

//   // Extract unique roles
//   let allRoles = [];
//   if (Array.isArray(accesses)) {
//     accesses.forEach((access) => {
//       if (access.roles && Array.isArray(access.roles)) {
//         access.roles.forEach((role) => {
//           const roleStr = typeof role === "string" ? role : role?.role;
//           if (roleStr && !allRoles.includes(roleStr)) {
//             allRoles.push(roleStr);
//           }
//         });
//       }
//     });
//   }

//   let role = "User";
//   if (userData?.superadmin || userData?.is_staff) {
//     role = "Super Admin";
//   } else if (userData?.is_client) {
//     role = "Admin";
//   } else if (userData?.is_manager) {
//     role = "Manager";
//   } else if (allRoles.length > 0) {
//     const uniqueRoles = [...new Set(allRoles)];
//     role = uniqueRoles.join(", ");
//   }

//   useEffect(() => {
//     localStorage.setItem("ROLE", role);
//   }, [role]);

//   // Close profile when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         onClose();
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setManage(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   // Sign out logic
//   const handleSignOut = () => {
//     localStorage.removeItem("ACCESS_TOKEN");
//     localStorage.removeItem("REFRESH_TOKEN");
//     localStorage.removeItem("USER_DATA");
//     localStorage.removeItem("ACCESSES");
//     localStorage.removeItem("ROLE");
//     navigate("/login");
//     if (typeof onClose === "function") onClose();
//   };

//   // Helper functions
//   const isValidString = (value) => value && String(value).trim() !== "";
//   const hasContactData = () =>
//     isValidString(userData?.email) ||
//     isValidString(userData?.phone_number) ||
//     isValidString(userData?.date_joined) ||
//     isValidString(userData?.last_login);

//   const hasOrganizationData = () =>
//     organizationDetails.organization ||
//     organizationDetails.company ||
//     organizationDetails.entity ||
//     isValidString(userData?.org);

//   // ---- VALUE COLOR: STRONG ORANGE (for ALL field values) ----
//   const valueColor = "#bb5600"; // Strong readable orange
//   // --- Attendance (single API) ---
// const ATTEND_MARK_URL = "/v2/attendance/mark/";
// const ATTEND_LIST_URL = "/v2/attendance/"; // GET ?user_id=&project_id=&date=YYYY-MM-DD

// const videoRef = useRef(null);
// const canvasRef = useRef(null);

// const [camOn, setCamOn] = useState(false);
// const [shotDataURL, setShotDataURL] = useState(null);
// const [attBusy, setAttBusy] = useState(false);
// const [attErr, setAttErr] = useState(null);
// const [attMsg, setAttMsg] = useState(null);
// const [forceAction, setForceAction] = useState(""); // "", "IN", "OUT"
// const [attState, setAttState] = useState({ inAt: null, outAt: null, lastAction: null });

// const ymdToday = () => {
//   const d = new Date();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${d.getFullYear()}-${mm}-${dd}`;
// };

// const getDefaultProjectId = () => {
//   try {
//     const u = new URLSearchParams(window.location.search);
//     const q = u.get("project_id");
//     if (q) return Number(q);
//   } catch {}
//   const ls =
//     localStorage.getItem("ACTIVE_PROJECT_ID") ||
//     localStorage.getItem("PROJECT_ID");
//   if (ls) return Number(ls);
//   return (accesses && accesses[0]?.project_id) ? Number(accesses[0].project_id) : null;
// };

// const dataURLtoBlob = (dataURL) => {
//   const arr = dataURL.split(","), mime = arr[0].match(/:(.*?);/)[1];
//   const bstr = atob(arr[1]); let n = bstr.length; const u8 = new Uint8Array(n);
//   while (n--) u8[n] = bstr.charCodeAt(n);
//   return new Blob([u8], { type: mime });
// };
// // camera on/off
// const startCamera = async () => {
//   setAttErr(null);
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       await videoRef.current.play();
//       setCamOn(true);
//       setShotDataURL(null);
//     }
//   } catch {
//     setAttErr("Camera permission denied or not available.");
//   }
// };
// const stopCamera = () => {
//   const v = videoRef.current;
//   const s = v?.srcObject;
//   if (s?.getTracks) s.getTracks().forEach(t => t.stop());
//   if (v) v.srcObject = null;
//   setCamOn(false);
// };

// // capture
// const captureShot = () => {
//   const v = videoRef.current, c = canvasRef.current;
//   if (!v || !c) return;
//   c.width = v.videoWidth || 480;
//   c.height = v.videoHeight || 480;
//   c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
//   setShotDataURL(c.toDataURL("image/jpeg", 0.9));
// };

// // cleanup on unmount
// useEffect(() => () => stopCamera(), []);

// // prefill today's in/out (optional)
// const prefillToday = async () => {
//   const uid = String(userData?.user_id || userData?.id || "");
//   const pid = getDefaultProjectId();
//   if (!uid || !pid) return;
//   try {
//     const { data } = await axiosInstance.get(
//       ensureSlash(ATTEND_LIST_URL) +
//         `?user_id=${uid}&project_id=${pid}&date=${ymdToday()}`
//     );
//     // pick the latest record(s)
//     const latest = Array.isArray(data) ? data[0] : null;
//     setAttState({
//       inAt: latest?.check_in_at || null,
//       outAt: latest?.check_out_at || null,
//       lastAction: latest?.check_out_at ? "OUT" : (latest?.check_in_at ? "IN" : null),
//     });
//   } catch {}
// };
// useEffect(() => { if (userData) prefillToday(); }, [userData]);

// // mark attendance (auto IN/OUT, with optional override)
// const markAttendance = async () => {
//   const uid = String(userData?.user_id || userData?.id || "");
//   const pid = getDefaultProjectId();
//   if (!uid) { setAttErr("Missing user id."); return; }
//   if (!pid) { setAttErr("Missing project id."); return; }
//   if (!shotDataURL) { setAttErr("Capture a photo first."); return; }

//   setAttBusy(true); setAttErr(null); setAttMsg(null);
//   try {
//     const blob = dataURLtoBlob(shotDataURL);
//     const fd = new FormData();
//     fd.append("user_id", uid);
//     fd.append("project_id", String(pid));
//     fd.append("photo", blob, "attendance.jpg");
//     if (forceAction) fd.append("force_action", forceAction);

//     // optional geoloc
//     try {
//       await new Promise((res) => {
//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             fd.append("lat", String(pos.coords.latitude));
//             fd.append("lon", String(pos.coords.longitude));
//             res();
//           },
//           () => res(),
//           { enableHighAccuracy: false, timeout: 2500 }
//         );
//       });
//     } catch {}

//     const { data } = await axiosInstance.post(ensureSlash(ATTEND_MARK_URL), fd);

//     const action = data.action || (data.check_out_at ? "OUT" : "IN");
//     const inAt  = data.check_in_at  || attState.inAt;
//     const outAt = data.check_out_at || attState.outAt;

//     setAttState({ inAt, outAt, lastAction: action });
//     setAttMsg(
//       action === "IN"
//         ? `Checked in at ${String(inAt)}`
//         : `Checked out at ${String(outAt)}`
//     );
//     stopCamera(); // optional
//   } catch (err) {
//     const r = err?.response;
//     const msg =
//       r?.data?.detail ||
//       r?.data?.message ||
//       (err?.message === "Network Error" ? "Network Error: CORS is blocking this call." : err?.message) ||
//       "Attendance failed.";
//     setAttErr(msg);
//   } finally {
//     setAttBusy(false);
//   }
// };


//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-start justify-end"
//       style={{
//         background: "rgba(20,16,10,0.33)",
//         backdropFilter: "blur(2px)",
//       }}
//     >
//       <div
//         ref={profileRef}
//         className="w-full max-w-md mx-auto rounded-3xl overflow-hidden max-h-[88vh] flex flex-col relative"
//         style={{
//           background: cardColor,
//           border: `2px solid ${borderColor}`,
//           color: textColor,
//           boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
//           marginTop: "32px",
//           marginRight: "32px",
//         }}
//       >
//         {/* Orange gradient bar */}
//         <div
//           style={{
//             width: "100%",
//             height: 5,
//             background: "linear-gradient(90deg, #ffbe63 30%, #ffd080 100%)",
//             borderTopLeftRadius: 18,
//             borderTopRightRadius: 18,
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: 20,
//           }}
//         ></div>

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: 14,
//             right: 18,
//             background: "#fff8f0",
//             border: `1.5px solid ${borderColor}`,
//             borderRadius: "50%",
//             width: 32,
//             height: 32,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: iconColor,
//             zIndex: 40,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//           }}
//           title="Close"
//         >
//           <span style={{ fontWeight: 700, fontSize: 21 }}>×</span>
//         </button>

//         {/* Header */}
//         <div
//           style={{
//             background: bgColor,
//             borderBottom: `1.5px solid ${borderColor}`,
//             padding: "32px 0 18px 0",
//           }}
//           className="flex flex-col items-center"
//         >
//           {/* Profile Image or Initials
//           {userData?.profile_image ? (
//             <img
//               src={userData.profile_image}
//               alt="profile"
//               style={{
//                 height: 76,
//                 width: 76,
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 border: `3px solid ${ORANGE}`,
//                 marginBottom: 8,
//                 boxShadow: "0 0 0 3px #fff",
//               }}
//             />
//           ) : (
//             <div
//               style={{
//                 height: 76,
//                 width: 76,
//                 borderRadius: "50%",
//                 background: ORANGE,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#fff",
//                 fontWeight: 700,
//                 fontSize: 32,
//                 border: `3px solid ${ORANGE}`,
//                 marginBottom: 8,
//                 boxShadow: "0 0 0 3px #fff",
//                 textTransform: "uppercase",
//                 letterSpacing: 2,
//               }}
//             >
//               {getInitials(userData)}
//             </div>
//           )} */}
//           {/* Profile Image / Initials + Add Photo */}
//  <div style={{ position: "relative", marginBottom: 8 }}>
//    {userData?.profile_image || userData?.photo ? (
//      <img
//        src={userData.profile_image || userData.photo}
//        alt="profile"
//        onError={(e) => {
//         const uid = String(userData?.user_id || userData?.id || "");
//         const b64 = uid && localStorage.getItem(AVATAR_B64_KEY(uid));
//         if (b64) e.currentTarget.src = b64;
//       }}
//        style={{
//          height: 76,
//          width: 76,
//          borderRadius: "50%",
//          objectFit: "cover",
//          border: `3px solid ${ORANGE}`,
//          boxShadow: "0 0 0 3px #fff",
//        }}
//      />
//    ) : (
//      <div
//        style={{
//          height: 76,
//          width: 76,
//          borderRadius: "50%",
//          background: ORANGE,
//          display: "flex",
//          alignItems: "center",
//          justifyContent: "center",
//          color: "#fff",
//          fontWeight: 700,
//          fontSize: 32,
//          border: `3px solid ${ORANGE}`,
//          boxShadow: "0 0 0 3px #fff",
//          textTransform: "uppercase",
//          letterSpacing: 2,
//        }}
//      >
//        {getInitials(userData)}
//      </div>
//    )}

//    {/* Add/Change Photo button (over avatar) */}
//   <button
//   onClick={handlePickPhoto}
//   disabled={uploadingPhoto}
//   title="Add/Change photo"
//   aria-label="Add/Change photo"
//   style={{
//     position: "absolute",
//     right: -6,
//     bottom: -6,
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     background: uploadingPhoto ? "#ffe4bd" : "#fff8f0",
//     border: `1.5px solid ${ORANGE}`,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#ad5700",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//     cursor: uploadingPhoto ? "not-allowed" : "pointer",
//     fontWeight: 700
//   }}
// >
//   {/* Option A: icon */}
//   <FiPlus size={16} />
//   {/* Option B (no icon lib): */}
//   {/* <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> */}
// </button>

//    <input
//      ref={fileInputRef}
//      type="file"
//      accept="image/*"
//      className="hidden"
//      onChange={handlePhotoSelected}
//    />
//  </div>
//  {/* {uploadErr && (
//    <div
//      style={{
//        color: "#b94a00",
//        fontSize: 12,
//        marginTop: 6,
//        background: "#fff3e6",
//        border: `1px solid ${ORANGE}`,
//        borderRadius: 10,
//        padding: "6px 10px",
//      }}
//    >
//      {uploadErr}
//    </div>
//  )} */}
//           <h2
//             style={{
//               fontWeight: 700,
//               fontSize: 22,
//               marginBottom: 4,
//               color: textColor,
//             }}
//           >
//             {userData?.username}
//           </h2>
//           {/* <div style={{ color: "#a37d31", fontSize: 15, marginBottom: 2 }}>
//             ID: {userData?.user_id}
//           </div> */}
//           <div
//             style={{
//               background: accentBg,
//               color: "#ad5700",
//               borderRadius: 14,
//               fontWeight: 600,
//               fontSize: 14,
//               padding: "4px 16px",
//               margin: "7px 0",
//               boxShadow: "0 1px 4px rgba(255,190,99,0.08)",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 7,
//             }}
//           >
//             <FiShield size={15} style={{ color: "#ad5700" }} /> {role}
//           </div>
//         </div>

//         {/* Scrollable content area */}
//         <div
//           className="flex-1 overflow-y-auto px-6 py-5"
//           style={{
//             background: theme === "dark" ? "#23232c" : "#fff",
//             minHeight: 160,
//           }}
//         >{/* --- Mark Attendance --- */}
// <div
//   className="rounded-2xl p-5 mb-5"
//   style={{ background: "#fff6ea", border: `1.2px solid ${borderColor}` }}
// >
//   <div className="flex items-center justify-between mb-4">
//     <h3 className="font-semibold text-base" style={{ color: "#9c670d" }}>
//       Mark attendance
//     </h3>
//     <div className="flex items-center gap-2">
//       <label className="text-xs" style={{ color: "#bfa672" }}>Action:</label>
//       <select
//         value={forceAction}
//         onChange={(e) => setForceAction(e.target.value)}
//         className="text-sm rounded-lg px-2 py-1"
//         style={{ border: `1px solid ${borderColor}`, background: "#fff" }}
//         title="Leave empty for auto IN/OUT"
//       >
//         <option value="">Auto</option>
//         <option value="IN">IN</option>
//         <option value="OUT">OUT</option>
//       </select>
//     </div>
//   </div>

//   <div className="flex flex-col items-center gap-3">
//     {!camOn && !shotDataURL && (
//   // IDLE: no camera, no photo selected
//   <div className="flex items-center gap-2">
//     <button
//       onClick={startCamera}
//       className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
//       style={{ background: ORANGE, color: "#ad5700", border: `1px solid ${borderColor}` }}
//     >
//       <FiCamera size={16} /> Click photo
//     </button>
//     <button
//       onClick={() => attendFileRef.current?.click()}
//       className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
//       style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
//     >
//       <FiUpload size={16} /> Upload photo
//     </button>
//   </div>
// )}

//     {camOn && !shotDataURL && (
//   // CAMERA ON: show live preview, still offer Upload
//   <div className="flex flex-col items-center gap-3">
//     <video
//       ref={videoRef}
//       autoPlay
//       playsInline
//       muted
//       style={{ width: 240, height: 240, borderRadius: 12, border: `1px solid ${borderColor}`, objectFit: "cover" }}
//     />
//     <div className="flex gap-2">
//       <button
//         onClick={captureShot}
//         className="px-4 py-2 rounded-lg font-semibold"
//         style={{ background: ORANGE, color: "#ad5700", border: `1px solid ${borderColor}` }}
//       >
//         Capture
//       </button>
//       <button
//         onClick={() => attendFileRef.current?.click()}
//         className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
//         style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
//       >
//         <FiUpload size={16} /> Upload
//       </button>
//       <button
//         onClick={stopCamera}
//         className="px-4 py-2 rounded-lg font-semibold"
//         style={{ background: "#fff0e1", color: "#ad5700", border: `1px solid ${borderColor}` }}
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
// )}

//     {shotDataURL && (
//   // PREVIEW: show taken/selected image + actions
//   <div className="flex flex-col items-center gap-3">
//     <img
//       src={shotDataURL}
//       alt="preview"
//       style={{ width: 240, height: 240, borderRadius: 12, border: `1px solid ${borderColor}`, objectFit: "cover" }}
//     />
//     <div className="flex flex-wrap gap-2">
//       <button
//         onClick={() => { setShotDataURL(null); startCamera(); }}
//         className="px-4 py-2 rounded-lg font-semibold"
//         style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
//       >
//         Retake
//       </button>
//       <button
//         onClick={() => attendFileRef.current?.click()}
//         className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
//         style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
//       >
//         <FiUpload size={16} /> Upload another
//       </button>
//       <button
//         onClick={markAttendance} // posts to /v2/attendance/mark/
//         className="px-4 py-2 rounded-lg font-semibold"
//         style={{ background: ORANGE, color: "#ad5700", border: `1px solid ${borderColor}` }}
//       >
//         Mark (auto IN/OUT)
//       </button>
//     </div>
//   </div>
// )}

//     {attErr && (
//       <div
//         className="mt-2 text-sm"
//         style={{ color: "#b94a00", background: "#fff3e6", border: `1px solid ${borderColor}`, borderRadius: 10, padding: "6px 10px" }}
//       >
//         {attErr}
//       </div>
//     )}
//     {attMsg && (
//       <div
//         className="mt-2 text-sm"
//         style={{ color: "#2f6f2f", background: "#eaffea", border: "1px solid #9ad29a", borderRadius: 10, padding: "6px 10px" }}
//       >
//         {attMsg}
//       </div>
//     )}

//     {/* Status tiles */}
//     <div className="mt-3 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
//       <div className="p-3 rounded-xl" style={{ background: "#fff", border: `1px solid ${borderColor}` }}>
//         <p className="text-sm" style={{ color: "#bfa672" }}>Checked in</p>
//         <p className="font-semibold" style={{ color: "#bb5600" }}>
//           {attState.inAt ? String(attState.inAt) : "—"}
//         </p>
//       </div>
//       <div className="p-3 rounded-xl" style={{ background: "#fff", border: `1px solid ${borderColor}` }}>
//         <p className="text-sm" style={{ color: "#bfa672" }}>Checked out</p>
//         <p className="font-semibold" style={{ color: "#bb5600" }}>
//           {attState.outAt ? String(attState.outAt) : "—"}
//         </p>
//       </div>
//     </div>
//   </div>
//   {/* <input
//   ref={attendFileRef}
//   type="file"
//   accept="image/*"
//   capture="user"           // lets mobile open front camera; still selectable from gallery
//   className="hidden"
//   onChange={onAttendanceFileSelected}
// /> */}
// <input
//   ref={attendFileRef}
//   type="file"
//   accept="image/*"
//   capture="user"
//   className="hidden"
//   onChange={onAttendanceFileSelected}
// />


//   {/* hidden canvas for snapshot */}
//   <canvas ref={canvasRef} className="hidden" />
// </div>

//           {/* Project Roles Section */}
//           {accesses?.length > 0 && (
//             <div
//               className="rounded-2xl p-5 mb-5"
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <div
//                 className="flex items-center gap-2 mb-4"
//                 style={{ color: ORANGE }}
//               >
                
//                 <FiBriefcase size={18} />
//                 <h3
//                   className="font-semibold text-base"
//                   style={{ color: "#9c670d" }}
//                 >
//                   Project Access
//                 </h3>
//               </div>
//               <div className="space-y-3">
//                 {accesses.slice(0, 3).map(
//                   (access, idx) =>
//                     isValidString(access.project_id) && (
//                       <div
//                         key={idx}
//                         className="rounded-xl p-4"
//                         style={{
//                           background: "#fff",
//                           border: `1px solid ${borderColor}`,
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <span
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {getProjectName(access)}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div className="flex flex-wrap gap-2">
//                             {access.roles?.slice(0, 2).map((role, j) => {
//                               const roleStr =
//                                 typeof role === "string" ? role : role?.role;
//                               return isValidString(roleStr) ? (
//                                 <span
//                                   key={j}
//                                   className="px-3 py-1"
//                                   style={{
//                                     background: ORANGE,
//                                     color: "#ad5700",
//                                     borderRadius: 12,
//                                     fontWeight: 600,
//                                     fontSize: 12,
//                                   }}
//                                 >
//                                   {roleStr}
//                                 </span>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                 )}
//                 {accesses.length > 3 && (
//                   <div
//                     className="text-center text-sm pt-2"
//                     style={{ color: "#a86c10" }}
//                   >
//                     +{accesses.length - 3} more projects
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Contact Information */}
//           {hasContactData() && (
//             <div
//               className="rounded-2xl p-5 mb-5"
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <h3
//                 className="font-semibold mb-4 flex items-center gap-2 text-base"
//                 style={{ color: "#9c670d" }}
//               >
//                 <FiMail size={18} />
//                 Contact Details
//               </h3>
//               <div className="space-y-3">
//                 {isValidString(userData?.email) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiMail size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Email
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.email}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.phone_number) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiPhone size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Phone
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.phone_number}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.date_joined) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiCalendar size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Joined
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.date_joined}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.last_login) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiClock size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Last Login
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.last_login}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Organization Section */}
//           {hasOrganizationData() && (
//             <div
//               className="rounded-2xl p-5 mb-4 relative"
//               ref={dropdownRef}
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <h3
//                 className="font-semibold mb-4 flex items-center gap-2 text-base"
//                 style={{ color: "#9c670d" }}
//               >
//                 <FiBriefcase size={18} />
//                 Organization Details
//               </h3>
//               {organizationDetails.loading ? (
//                 <div
//                   className="flex items-center justify-center p-6 rounded-xl"
//                   style={{
//                     background: "#fff0e1",
//                     border: `1px solid ${borderColor}`,
//                   }}
//                 >
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
//                   <span
//                     className="ml-3 text-sm font-medium"
//                     style={{ color: "#ab7a13" }}
//                   >
//                     Loading organization details...
//                   </span>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {/* Organization */}
//                   {organizationDetails.organization && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.organization.organization_name
//                             ? organizationDetails.organization
//                                 .organization_name[0]
//                             : "O"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Organization
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.organization
//                               .organization_name || `Org ${userData.org}`}
//                           </p>
//                           {organizationDetails.organization.contact_email && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {organizationDetails.organization.contact_email}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Company */}
//                   {organizationDetails.company && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.company.name
//                             ? organizationDetails.company.name[0]
//                             : "C"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Company
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.company.name}
//                           </p>
//                           {(organizationDetails.company.region ||
//                             organizationDetails.company.country) && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {[
//                                 organizationDetails.company.region,
//                                 organizationDetails.company.country,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Entity */}
//                   {organizationDetails.entity && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.entity.name
//                             ? organizationDetails.entity.name[0]
//                             : "E"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Entity
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.entity.name}
//                           </p>
//                           {(organizationDetails.entity.state ||
//                             organizationDetails.entity.region ||
//                             organizationDetails.entity.zone) && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {[
//                                 organizationDetails.entity.state,
//                                 organizationDetails.entity.region,
//                                 organizationDetails.entity.zone,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Fallback: org ID only */}
//                   {!organizationDetails.organization &&
//                     !organizationDetails.company &&
//                     !organizationDetails.entity &&
//                     isValidString(userData?.org) && (
//                       <button
//                         onClick={() => setManage(!manage)}
//                         className="w-full flex items-center justify-between p-4 rounded-xl"
//                         style={{
//                           background: "#fff",
//                           border: `1px solid ${borderColor}`,
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div
//                             className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                             style={{ background: accentBg, color: "#ad5700" }}
//                           >
//                             {isValidString(userData?.organization_name)
//                               ? String(userData.organization_name)[0]
//                               : String(userData.org)[0]}
//                           </div>
//                           <div className="text-left">
//                             <p
//                               className="font-semibold text-base"
//                               style={{ color: valueColor }}
//                             >
//                               {userData.organization_name ||
//                                 `Organization ${userData.org}`}
//                             </p>
//                             <p className="text-sm" style={{ color: "#bfa672" }}>
//                               Org ID: {userData.org}
//                             </p>
//                           </div>
//                         </div>
//                         <IoMdArrowDropdown
//                           size={20}
//                           style={{
//                             color: iconColor,
//                             transform: manage ? "rotate(180deg)" : undefined,
//                             transition: "transform 0.2s",
//                           }}
//                         />
//                       </button>
//                     )}
//                   {/* Manage Dropdown */}
//                   {manage && (
//                     <div
//                       className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50"
//                       style={{
//                         background: cardColor,
//                         border: `1.5px solid ${borderColor}`,
//                         boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
//                         animation: "slide-in-from-top .23s",
//                       }}
//                     >
//                       <button
//                         className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
//                         style={{
//                           background: ORANGE,
//                           color: "#ad5700",
//                         }}
//                         onClick={() =>
//                           alert("Organization management coming soon!")
//                         }
//                       >
//                         <FiSettings size={16} />
//                         Manage Organization
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {organizationDetails.error && (
//                 <div
//                   className="p-4 rounded-xl"
//                   style={{ background: "#ffeded", border: `1px solid #e96232` }}
//                 >
//                   <p className="text-red-400 text-sm font-medium">
//                     {organizationDetails.error}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Action buttons */}
//         <div
//           style={{
//             background: cardColor,
//             borderTop: `1.5px solid ${borderColor}`,
//             padding: 20,
//             borderBottomLeftRadius: 24,
//             borderBottomRightRadius: 24,
//           }}
//           className="flex gap-4"
//         >
//           <button
//             className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//             style={{
//               background: ORANGE,
//               color: "#8a4c00",
//               boxShadow: "0 2px 8px rgba(255, 190, 99, 0.15)",
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//             onClick={() => alert("Account details feature coming soon!")}
//           >
//             <FiUser size={16} style={{ color: "#ad5700" }} /> My Account
//           </button>
//           <button
//             className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//             style={{
//               background: "#fff0e1",
//               color: "#e24717",
//               border: `1.5px solid #e24717`,
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//             onClick={handleSignOut}
//           >
//             <FiLogOut size={16} style={{ color: "#e24717" }} /> Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;



import { getUserDetailsById , getUserAccessForProject, getProjectsByOrgOwnership,        // 🔸 new
  setActiveProjectId as persistActiveProjectId  } from "../api"; 
import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { ensureSlash } from "../utils/http";
import { setLoggingOut } from "../api/axiosInstance"; // adjust path if needed

import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiShield,
  FiPlus,
  FiCamera, 
  FiUpload,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import axiosInstance, { organnizationInstance } from "../api/axiosInstance";
import axios from "axios";
import {  getStagesByPhase } from "../api";

const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";

// ---- Helper: Get Initials ----
function getInitials(user) {
  if (!user) return "";
  if (user.first_name || user.last_name) {
    return (
      (user.first_name?.charAt(0) || "") +
      (user.last_name?.charAt(0) || "")
    ).toUpperCase();
  }
  if (user.username) {
    const parts = user.username.split(/[\s._-]+/);
    return (
      (parts[0]?.charAt(0) || "") + (parts[1]?.charAt(0) || "")
    ).toUpperCase();
  }
  return "";
}
// ---- Helper: Display Role (same logic as login) ----
function getDisplayRole(userData, accesses) {
  if (!userData) return "User";

  let allRoles = [];
  if (Array.isArray(accesses)) {
    accesses.forEach((access) => {
      if (Array.isArray(access.roles)) {
        access.roles.forEach((role) => {
          const roleStr = typeof role === "string" ? role : role?.role;
          if (roleStr) {
            allRoles.push(roleStr);
          }
        });
      }
    });
  }

  const uniqueRoles = [...new Set(allRoles)];
  const upperRoles = uniqueRoles.map((r) => String(r).toUpperCase());

  // 🔺 top-level flags – sabse upar priority
  if (userData?.superadmin || userData?.is_staff) return "Super Admin";
  if (userData?.is_client) return "Admin";

  // 🔺 NEW: watcher flags from token / USER_DATA
  if (userData?.is_project_head) return "Project Head";
  if (userData?.is_project_manager) return "Project Manager";

  // normal manager
  if (userData?.is_manager) return "Manager";

  // agar accesses ke roles me hi PROJECT_HEAD / PROJECT_MANAGER ho
  if (upperRoles.includes("PROJECT_HEAD")) return "Project Head";
  if (upperRoles.includes("PROJECT_MANAGER")) return "Project Manager";

  // baaki saare roles comma separated
  if (uniqueRoles.length > 0) {
    return uniqueRoles.join(", ");
  }

  return "User";
}


function Profile({ onClose }) {
  const [manage, setManage] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const [nameCache, setNameCache] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadErr, setUploadErr] = useState(null);
  const fileInputRef = useRef(null);
  const AVATAR_URL_KEY = (id) => `USER_AVATAR_URL_${id}`;
  const AVATAR_B64_KEY = (id) => `USER_AVATAR_DATAURL_${id}`;
  const cacheBust = (url) =>
    url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : url;
  const attendFileRef = useRef(null);

  const openAttendanceFilePicker = () => attendFileRef.current?.click();

  const onAttendanceFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttErr(null);
    try {
      const dataUrl = await shrinkImageToDataURL(file, 720, 0.9);
      setShotDataURL(dataUrl);
      stopCamera();
    } catch (err) {
      setAttErr("Could not read the selected image.");
    } finally {
      if (e?.target) e.target.value = "";
    }
  };
    // Flow roles (Maker / Checker / Supervisor) coming from UserAccess API
  const [flowRoles, setFlowRoles] = useState([]);
  const [flowRole, setFlowRole] = useState(
    localStorage.getItem("FLOW_ROLE") || ""
  );
  const [flowRoleLoading, setFlowRoleLoading] = useState(false);
  const [flowRoleError, setFlowRoleError] = useState("");
// project_id -> { ROLE_CODE -> { role, stages: [...], hasGlobalAllChecklist } }
const [flowRoleStagesByProject, setFlowRoleStagesByProject] = useState({});




const getStageInfo = (projectId, roleCode) => {
  if (!projectId || !roleCode) return null;

  const projMap = flowRoleStagesByProject[projectId];
  if (!projMap) return null;

  const info = projMap[String(roleCode).toUpperCase()];
  if (!info) return null;

  // duplicate stage ids remove kar do
  const uniqueStages = [];
  const seen = new Set();
  info.stages.forEach((s) => {
    if (!s.stageId || seen.has(s.stageId)) return;
    seen.add(s.stageId);
    uniqueStages.push(s);
  });

  const namesWithPurpose = uniqueStages.map((s) =>
    s.purposeName ? `${s.stageName} (${s.purposeName})` : s.stageName
  );

  let label = null;
  if (info.hasGlobalAllChecklist && !uniqueStages.length) {
    label = "All stages (all checklists)";
  } else if (info.hasGlobalAllChecklist && namesWithPurpose.length) {
    label = `All checklists in ${namesWithPurpose.join(", ")}`;
  } else if (namesWithPurpose.length === 1) {
    label = namesWithPurpose[0];
  } else if (namesWithPurpose.length > 1) {
    label = namesWithPurpose.join(", ");
  }

  return {
    ...info,
    stages: uniqueStages,
    label,
  };
};


// const getStageInfo = (projectId, roleCode) => {
//   if (!projectId || !roleCode) return null;
//   const projMap = flowRoleStagesByProject[projectId];
//   if (!projMap) return null;

//   const key = String(roleCode).toUpperCase();
//   const info = projMap[key];
//   if (!info) return null;

//   const stageIds = info.stages
//     .map((s) => s.stageId)
//     .filter(Boolean);

//   let label = null;

//   if (info.hasGlobalAllChecklist && !stageIds.length) {
//     label = "All stages (all checklists)";
//   } else if (info.hasGlobalAllChecklist && stageIds.length) {
//     label = `All checklists in stages ${stageIds.join(", ")}`;
//   } else if (stageIds.length === 1) {
//     label = `Stage ${stageIds[0]}`;
//   } else if (stageIds.length > 1) {
//     label = `Stages ${stageIds.join(", ")}`;
//   }

//   return {
//     ...info,
//     label,
//   };
// };


  const fileToDataUrl = (file) =>
    new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });

  async function shrinkImageToDataURL(file, maxW = 256, quality = 0.85) {
    const dataUrl = await fileToDataUrl(file);
    const img = new Image();
    img.src = dataUrl;
    await new Promise((r) => (img.onload = r));
    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  }

  const normImg = (u) =>
    u && !/^https?:\/\//i.test(u)
      ? `https://konstruct.world${u.startsWith("/") ? "" : "/"}${u}`
      : u;
  const [userData, setUserData] = useState(null);
  const [accesses, setAccesses] = useState([]);
 const [activeProjectId, setActiveProjectId] = useState(null);   // jo actually active hai
  const [pendingProjectId, setPendingProjectId] = useState(null); 
  const handlePickPhoto = () => fileInputRef.current?.click();

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userData) return;

    setUploadErr(null);
    setUploadingPhoto(true);

    const userId = String(userData.user_id || userData.id);
    const FACE_ENROLL_URL = "/v2/face/enroll/";

    try {
      const previewB64 = await shrinkImageToDataURL(file, 256, 0.85);
      localStorage.setItem(AVATAR_B64_KEY(userId), previewB64);
      setUserData((prev) =>
        prev ? { ...prev, profile_image: previewB64, photo: previewB64 } : prev
      );

      const fd = new FormData();
      fd.append("user_id", userId);
      fd.append("photo", file, file.name || "profile.jpg");
      fd.append("replace", "true");
      await axiosInstance.post(ensureSlash(FACE_ENROLL_URL), fd);

      const { data } = await getUserDetailsById(userId);
      const remote = normImg(data.profile_image || data.photo);
      const finalUrl = cacheBust(remote);

      const updated = { ...data, profile_image: finalUrl, photo: finalUrl };
      setUserData(updated);
      localStorage.setItem("USER_DATA", JSON.stringify(updated));
      localStorage.setItem(AVATAR_URL_KEY(userId), finalUrl);
    } catch (err) {
      const r = err?.response;
      const msg =
        (r?.data && (r.data.photo || r.data.detail || r.data.message)) ||
        (typeof r?.data === "string" ? r.data : null) ||
        (err?.message === "Network Error"
          ? "Network Error: CORS is blocking this call."
          : err?.message) ||
        "Photo upload failed.";
      setUploadErr(msg);
    } finally {
      setUploadingPhoto(false);
      if (e?.target) e.target.value = "";
    }
  };

  const [organizationDetails, setOrganizationDetails] = useState({
    organization: null,
    company: null,
    entity: null,
    loading: true,
    error: null,
  });

  const getProjectName = (access) => {
    if (access.project_name) return access.project_name;
    if (nameCache[access.project_id]) return nameCache[access.project_id];

    if (access.project_id && !nameCache[access.project_id]) {
      axios
        .get(`https://konstruct.world/projects/projects/${access.project_id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
          },
        })
        .then((res) => {
          if (res.data?.name) {
            setNameCache((prev) => ({
              ...prev,
              [access.project_id]: res.data.name,
            }));
          }
        })
        .catch(() => {
          setNameCache((prev) => ({
            ...prev,
            [access.project_id]: "Project " + access.project_id,
          }));
        });
    }
    return "Project " + access.project_id;
  };

  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#9c670d";
  const iconColor = ORANGE;
  const accentBg = ORANGE;

  const fetchOrganizationDetails = async (userData) => {
    if (!userData) return;
    try {
      setOrganizationDetails((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      const results = {};
      if (userData.org) {
        try {
          const orgResponse = await organnizationInstance.get(
            `organizations/${userData.org}/`
          );
          results.organization = orgResponse.data;
        } catch {}
      }
      if (userData.company_id || userData.company) {
        const companyId = userData.company_id || userData.company;
        try {
          const companyResponse = await organnizationInstance.get(
            `companies/${companyId}/`
          );
          results.company = companyResponse.data;
        } catch {}
      }
      if (userData.entity_id || userData.entity) {
        const entityId = userData.entity_id || userData.entity;
        try {
          const entityResponse = await organnizationInstance.get(
            `entities/${entityId}/`
          );
          results.entity = entityResponse.data;
        } catch {}
      }
      setOrganizationDetails({
        ...results,
        loading: false,
        error: null,
      });
    } catch (error) {
      setOrganizationDetails((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load organization details",
      }));
    }
  };
useEffect(() => {
  const init = async () => {
    // 1) USER_DATA load karo
    const userString = localStorage.getItem("USER_DATA");
    let parsedUser = null;

    if (userString && userString !== "undefined") {
      parsedUser = JSON.parse(userString);
      const uid = String(parsedUser.user_id || parsedUser.id || "");
      const urlFromCache = uid && localStorage.getItem(AVATAR_URL_KEY(uid));
      const b64FromCache = uid && localStorage.getItem(AVATAR_B64_KEY(uid));
      const serverUrl = parsedUser?.profile_image || parsedUser?.photo || "";
      const chosen = urlFromCache || serverUrl || b64FromCache || null;
      const merged = chosen
        ? { ...parsedUser, profile_image: chosen, photo: chosen }
        : parsedUser;

      setUserData(merged);
      fetchOrganizationDetails(merged);
      parsedUser = merged;
    }

    // 2) ACCESSES localStorage se padho (maker/checker users ke liye)
    let parsedAccesses = [];
    const accessString = localStorage.getItem("ACCESSES");
    if (accessString && accessString !== "undefined") {
      try {
        parsedAccesses = JSON.parse(accessString) || [];
      } catch {
        parsedAccesses = [];
      }
    }

    // 3) Agar MANAGER hai, ACCESSES khaali hai, aur org id hai =>
    //    /projects/projects/by_ownership/?organization_id=XXX se projects lao
    if (
      parsedUser &&
      parsedUser.is_manager &&                       // 🔥 manager check
      (!parsedAccesses || !parsedAccesses.length) && // koi access nahi
      (parsedUser.org || parsedUser.organization_id) // org id available
    ) {
      try {
        const orgId = parsedUser.org || parsedUser.organization_id;
        const res = await getProjectsByOrgOwnership(orgId);
        const projects = Array.isArray(res.data) ? res.data : [];

        // normalize into access-like objects
        parsedAccesses = projects.map((p) => ({
          project_id: p.id,
          project_name: p.name,
          roles: ["Manager"], // optional – just for display
        }));

        // optionally store in localStorage so other pages can reuse
        if (parsedAccesses.length) {
          localStorage.setItem("ACCESSES", JSON.stringify(parsedAccesses));
        }
      } catch (err) {
        console.error("Failed to load manager projects via by_ownership", err);
      }
    }

    // 4) state update karo
    setAccesses(parsedAccesses);

    // 5) Initial ACTIVE_PROJECT_ID decide karo
    let initialPid = null;

    // 5a) URL ?project_id
    try {
      const qs = new URLSearchParams(window.location.search);
      const q = qs.get("project_id");
      if (q) initialPid = Number(q);
    } catch {}

    // 5b) LocalStorage ACTIVE_PROJECT_ID / PROJECT_ID
    if (!initialPid) {
      const ls =
        localStorage.getItem("ACTIVE_PROJECT_ID") ||
        localStorage.getItem("PROJECT_ID");
      if (ls) initialPid = Number(ls);
    }

    // 5c) Agar phir bhi nahi mila, to first project from accesses
    if (!initialPid && parsedAccesses && parsedAccesses[0]?.project_id) {
      initialPid = Number(parsedAccesses[0].project_id);
    }

    // 6) Final: state + localStorage dono main set karo
    if (initialPid) {
      setActiveProjectId(initialPid);
      setPendingProjectId(initialPid);
      persistActiveProjectId(initialPid); // writes ACTIVE_PROJECT_ID
    }

    setHydrated(true);
  };

  init();
}, []);


  // useEffect(() => {
  //   const userString = localStorage.getItem("USER_DATA");
  //   if (userString && userString !== "undefined") {
  //     const parsed = JSON.parse(userString);
  //     const uid = String(parsed.user_id || parsed.id || "");
  //     const urlFromCache = uid && localStorage.getItem(AVATAR_URL_KEY(uid));
  //     const b64FromCache = uid && localStorage.getItem(AVATAR_B64_KEY(uid));
  //     const serverUrl = parsed?.profile_image || parsed?.photo || "";
  //     const chosen = urlFromCache || serverUrl || b64FromCache || null;
  //     const merged = chosen
  //       ? { ...parsed, profile_image: chosen, photo: chosen }
  //       : parsed;

  //     setUserData(merged);
  //     fetchOrganizationDetails(merged);
  //   }

  //   const accessString = localStorage.getItem("ACCESSES");
  //   if (accessString && accessString !== "undefined") {
  //     try {
  //       const parsedAccesses = JSON.parse(accessString);
  //       setAccesses(parsedAccesses);

  //       // 🔹 Initial active project decide karo
  //       let initialPid = null;
  //       try {
  //         const qs = new URLSearchParams(window.location.search);
  //         const q = qs.get("project_id");
  //         if (q) initialPid = Number(q);
  //       } catch {}

  //       if (!initialPid) {
  //         const ls =
  //           localStorage.getItem("ACTIVE_PROJECT_ID") ||
  //           localStorage.getItem("PROJECT_ID");
  //         if (ls) initialPid = Number(ls);
  //       }

  //       if (!initialPid && parsedAccesses && parsedAccesses[0]?.project_id) {
  //         initialPid = Number(parsedAccesses[0].project_id);
  //       }

  //       if (initialPid) {
  //         setActiveProjectId(initialPid);
  //         setPendingProjectId(initialPid);
  //       }
  //     } catch {
  //       setAccesses([]);
  //     }
  //   }

  //   setHydrated(true);
  // }, []);





  // useEffect(() => {
  //   const userString = localStorage.getItem("USER_DATA");
  //   if (userString && userString !== "undefined") {
  //     const parsed = JSON.parse(userString);
  //     const uid = String(parsed.user_id || parsed.id || "");
  //     const urlFromCache = uid && localStorage.getItem(AVATAR_URL_KEY(uid));
  //     const b64FromCache = uid && localStorage.getItem(AVATAR_B64_KEY(uid));
  //     const serverUrl = parsed?.profile_image || parsed?.photo || "";
  //     const chosen = urlFromCache || serverUrl || b64FromCache || null;
  //     const merged = chosen ? { ...parsed, profile_image: chosen, photo: chosen } : parsed;
  //     setUserData(merged);
  //     fetchOrganizationDetails(merged);
  //   }
  //   const accessString = localStorage.getItem("ACCESSES");
  //   if (accessString && accessString !== "undefined") {
  //     try {
  //       setAccesses(JSON.parse(accessString));
  //     } catch {
  //       setAccesses([]);
  //     }
  //   }
  //   setHydrated(true);
  // }, []);


    // Load Maker / Checker / Supervisor roles from UserAccess for the active project
  // useEffect(() => {
  //   if (!userData) return;

  //   const uid = String(userData.user_id || userData.id || "");
  //   const pid = getDefaultProjectId();
  //   if (!uid || !pid) return;

  //   const loadRoles = async () => {
  //     try {
  //       setFlowRoleLoading(true);
  //       setFlowRoleError("");

  //       const { data } = await getUserAccessForProject(uid, pid);
  //       const list = Array.isArray(data) ? data : [];

  //       const WHITELIST = ["MAKER", "CHECKER", "SUPERVISOR"];
  //       const rolesSet = new Set();

  //       list.forEach((access) => {
  //         // access.roles may be ["Maker","Checker"] or objects
  //         if (Array.isArray(access.roles)) {
  //           access.roles.forEach((r) => {
  //             if (!r) return;
  //             const raw = typeof r === "string" ? r : r.role || r.name;
  //             if (!raw) return;
  //             const norm = String(raw).toUpperCase();
  //             if (WHITELIST.includes(norm)) rolesSet.add(norm);
  //           });
  //         } else if (access.role) {
  //           const norm = String(access.role).toUpperCase();
  //           if (WHITELIST.includes(norm)) rolesSet.add(norm);
  //         }
  //       });

  //       const rolesArr = Array.from(rolesSet);
  //       setFlowRoles(rolesArr);

  //       // Restore previous selection if still valid
  //       const stored = localStorage.getItem("FLOW_ROLE");
  //       if (stored && rolesArr.includes(stored)) {
  //         setFlowRole(stored);
  //       } else if (!flowRole && rolesArr.length) {
  //         const first = rolesArr[0];
  //         setFlowRole(first);
  //         localStorage.setItem("FLOW_ROLE", first);
  //       }
  //     } catch (e) {
  //       console.error("Failed to load flow roles", e);
  //       setFlowRoleError("Could not load roles for this project.");
  //     } finally {
  //       setFlowRoleLoading(false);
  //     }
  //   };

  //   loadRoles();
  // }, [userData, accesses]); // accesses is already a state above
  useEffect(() => {
  if (!userData || !activeProjectId) return;

  const uid = String(userData.user_id || userData.id || "");
  const pid = activeProjectId;
  if (!uid || !pid) return;

  const loadRolesAndStages = async () => {
    try {
      setFlowRoleLoading(true);
      setFlowRoleError("");

      // 1) UserAccess fetch
      const { data } = await getUserAccessForProject(uid, pid);
      const list = Array.isArray(data) ? data : [];

      const WHITELIST = ["MAKER", "CHECKER", "SUPERVISOR", "INTIALIZER"];

      const rolesSet = new Set();
      const phaseIdSet = new Set();

      // phase ids + roles collect karo
      list.forEach((access) => {
        if (access.phase_id) {
          phaseIdSet.add(access.phase_id);
        }

        if (Array.isArray(access.roles)) {
          access.roles.forEach((r) => {
            if (!r) return;
            const raw = typeof r === "string" ? r : r.role || r.name;
            if (!raw) return;
            const norm = String(raw).toUpperCase();
            if (WHITELIST.includes(norm)) rolesSet.add(norm);
          });
        } else if (access.role) {
          const norm = String(access.role).toUpperCase();
          if (WHITELIST.includes(norm)) rolesSet.add(norm);
        }
      });

      const rolesArr = Array.from(rolesSet);
      setFlowRoles(rolesArr);

      // 2) har unique phase ke liye stages fetch karo
      let stageMap = {};
      if (phaseIdSet.size > 0) {
        const phaseIds = Array.from(phaseIdSet);

        const responses = await Promise.all(
          phaseIds.map((phId) =>
            getStagesByPhase(phId).catch(() => null)
          )
        );

        responses.forEach((res, idx) => {
          if (!res || !Array.isArray(res.data)) return;

          res.data.forEach((st) => {
            // purpose ka naam: "Snagging"
            const purposeName =
              st.purpose?.name?.purpose?.name ||
              st.purpose?.purpose?.name ||
              st.purpose?.name ||
              null;

            stageMap[st.id] = {
              id: st.id,
              name: st.name,                  // "stage 1"
              phaseId: st.phase ?? null,      // 139
              purposeId: st.purpose?.id ?? null,
              purposeName,                    // "Snagging"
            };
          });
        });
      }

      // 3) bucket per role banao (kis role ko kaunse stage)
      const bucketsByRole = {};
      const ensureBucket = (roleCode) => {
        const key = String(roleCode).toUpperCase();
        if (!bucketsByRole[key]) {
          bucketsByRole[key] = {
            hasGlobalAllChecklist: false,
            stages: [],  // {stageId, stageName, purposeName, ...}
          };
        }
        return bucketsByRole[key];
      };

      list.forEach((access) => {
        let accessRoles = [];
        if (Array.isArray(access.roles)) {
          accessRoles = access.roles
            .map((r) => (typeof r === "string" ? r : r.role || r.name))
            .filter(Boolean);
        } else if (access.role) {
          accessRoles = [access.role];
        }

        accessRoles.forEach((rawRole) => {
          const key = String(rawRole).toUpperCase();
          if (!WHITELIST.includes(key)) return;

          const bucket = ensureBucket(key);

          // pure project ka All_checklist (kisi ek role ke liye)
          if (access.All_checklist && !access.stage_id) {
            bucket.hasGlobalAllChecklist = true;
          }

          // specific stage access
          if (access.stage_id) {
            const st = stageMap[access.stage_id] || {};
            bucket.stages.push({
              stageId: access.stage_id,
              stageName: st.name || `Stage ${access.stage_id}`,
              phaseId: access.phase_id || st.phaseId || null,
              purposeId: access.purpose_id || st.purposeId || null,
              purposeName: st.purposeName || null,
              allChecklist: !!access.All_checklist,
            });
          }
        });
      });

      // 4) project wise store karo
      setFlowRoleStagesByProject((prev) => ({
        ...prev,
        [pid]: bucketsByRole,
      }));

      // 5) FLOW_ROLE ko sync rakho
      const stored = localStorage.getItem("FLOW_ROLE");
      if (stored && rolesArr.includes(stored)) {
        setFlowRole(stored);
      } else if (!flowRole && rolesArr.length) {
        const first = rolesArr[0];
        setFlowRole(first);
        localStorage.setItem("FLOW_ROLE", first);
      }
    } catch (e) {
      console.error("Failed to load flow roles + stages", e);
      setFlowRoleError("Could not load roles for this project.");
    } finally {
      setFlowRoleLoading(false);
    }
  };

  loadRolesAndStages();
}, [userData, activeProjectId]);   // ✅ same dependencies

  // useEffect(() => {
  //   if (!userData || !activeProjectId) return;

  //   const uid = String(userData.user_id || userData.id || "");
  //   const pid = activeProjectId;
  //   if (!uid || !pid) return;

  //   const loadRoles = async () => {
  //     try {
  //       setFlowRoleLoading(true);
  //       setFlowRoleError("");

  //       const { data } = await getUserAccessForProject(uid, pid);
  //       const list = Array.isArray(data) ? data : [];

  //       const WHITELIST = ["MAKER", "CHECKER", "SUPERVISOR","INTIALIZER"];
  //       const rolesSet = new Set();

  //       list.forEach((access) => {
  //         if (Array.isArray(access.roles)) {
  //           access.roles.forEach((r) => {
  //             if (!r) return;
  //             const raw = typeof r === "string" ? r : r.role || r.name;
  //             if (!raw) return;
  //             const norm = String(raw).toUpperCase();
  //             if (WHITELIST.includes(norm)) rolesSet.add(norm);
  //           });
  //         } else if (access.role) {
  //           const norm = String(access.role).toUpperCase();
  //           if (WHITELIST.includes(norm)) rolesSet.add(norm);
  //         }
  //       });

  //       const rolesArr = Array.from(rolesSet);
  //       setFlowRoles(rolesArr);

  //       const stored = localStorage.getItem("FLOW_ROLE");
  //       if (stored && rolesArr.includes(stored)) {
  //         setFlowRole(stored);
  //       } else if (!flowRole && rolesArr.length) {
  //         const first = rolesArr[0];
  //         setFlowRole(first);
  //         localStorage.setItem("FLOW_ROLE", first);
  //       }
  //     } catch (e) {
  //       console.error("Failed to load flow roles", e);
  //       setFlowRoleError("Could not load roles for this project.");
  //     } finally {
  //       setFlowRoleLoading(false);
  //     }
  //   };

  //   loadRoles();
  // }, [userData, activeProjectId]);   // <- accesses ki jagah ye

  // Keep selected flow role in localStorage for other pages
  useEffect(() => {
    if (flowRole) {
      localStorage.setItem("FLOW_ROLE", flowRole);
    }
  }, [flowRole]);

  useEffect(() => {
    if (hydrated && !userData) {
      navigate("/login", { replace: true });
    }
  }, [hydrated, userData, navigate]);

  // let allRoles = [];
  // if (Array.isArray(accesses)) {
  //   accesses.forEach((access) => {
  //     if (access.roles && Array.isArray(access.roles)) {
  //       access.roles.forEach((role) => {
  //         const roleStr = typeof role === "string" ? role : role?.role;
  //         if (roleStr && !allRoles.includes(roleStr)) {
  //           allRoles.push(roleStr);
  //         }
  //       });
  //     }
  //   });
  // }

  // let role = "User";
  // if (userData?.superadmin || userData?.is_staff) {
  //   role = "Super Admin";
  // } else if (userData?.is_client) {
  //   role = "Admin";
  // } else if (userData?.is_manager) {
  //   role = "Manager";
  // } else if (allRoles.length > 0) {
  //   const uniqueRoles = [...new Set(allRoles)];
  //   role = uniqueRoles.join(", ");
  // }
  const role = getDisplayRole(userData, accesses);

  useEffect(() => {
    localStorage.setItem("ROLE", role);
  }, [role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        onClose();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setManage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  const handleSignOut = async () => {
  setLoggingOut(true);

  // stop redux-persist writing back (if you use it)
  // try { persistor.pause(); } catch {}

  // remove auth & cached data
  const keys = [
    "ACCESS_TOKEN",
    "REFRESH_TOKEN",
    "token",            // <- you still have this in storage
    "access",
    "USER_DATA",
    "ACCESSES",
    "ROLE",
    "persist:root"  ,
    "FLOW_ROLE" ,
    "PROJECT_ID",
    "ACTIVE_PROJECT_ID",   // <- redux-persist cache
  ];
  keys.forEach(k => localStorage.removeItem(k));

  // remove avatar caches
  Object.keys(localStorage)
    .filter(k => k.startsWith("USER_AVATAR_URL_") || k.startsWith("USER_AVATAR_DATAURL_"))
    .forEach(k => localStorage.removeItem(k));

  // now hard navigate so no React effects run
  window.location.assign("/login");
};
// const handleSignOut = () => {
//   setLoggingOut(true); // <- tells interceptors to skip token + no refresh
//   localStorage.removeItem("ACCESS_TOKEN");
//   localStorage.removeItem("REFRESH_TOKEN");
//   localStorage.removeItem("USER_DATA");
//   localStorage.removeItem("ACCESSES");
//   localStorage.removeItem("ROLE");
//   window.location.replace("/login"); // hard redirect to stop in-flight calls
// };

  // const handleSignOut = () => {
  //   localStorage.removeItem("ACCESS_TOKEN");
  //   localStorage.removeItem("REFRESH_TOKEN");
  //   localStorage.removeItem("USER_DATA");
  //   localStorage.removeItem("ACCESSES");
  //   localStorage.removeItem("ROLE");
  //   navigate("/login");
  //   if (typeof onClose === "function") onClose();
  // };

  const isValidString = (value) => value && String(value).trim() !== "";
  const hasContactData = () =>
    isValidString(userData?.email) ||
    isValidString(userData?.phone_number) ||
    isValidString(userData?.date_joined) ||
    isValidString(userData?.last_login);

  const hasOrganizationData = () =>
    organizationDetails.organization ||
    organizationDetails.company ||
    organizationDetails.entity ||
    isValidString(userData?.org);

  const valueColor = "#bb5600";

  // Attendance
  const ATTEND_MARK_URL = "/v2/attendance/mark/";
  const ATTEND_LIST_URL = "/v2/attendance/";

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [camOn, setCamOn] = useState(false);
  const [shotDataURL, setShotDataURL] = useState(null);
  const [attBusy, setAttBusy] = useState(false);
  const [attErr, setAttErr] = useState(null);
  const [attMsg, setAttMsg] = useState(null);
  const [forceAction, setForceAction] = useState("");
  const [attState, setAttState] = useState({ inAt: null, outAt: null, lastAction: null });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const ymdToday = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  const getDefaultProjectId = () => {
    try {
      const u = new URLSearchParams(window.location.search);
      const q = u.get("project_id");
      if (q) return Number(q);
    } catch {}
    const ls =
      localStorage.getItem("ACTIVE_PROJECT_ID") ||
      localStorage.getItem("PROJECT_ID");
    if (ls) return Number(ls);
    return (accesses && accesses[0]?.project_id) ? Number(accesses[0].project_id) : null;
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(","), mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]); let n = bstr.length; const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new Blob([u8], { type: mime });
  };

  const startCamera = async () => {
    setAttErr(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamOn(true);
        setShotDataURL(null);
      }
    } catch {
      setAttErr("Camera permission denied or not available.");
    }
  };

  const stopCamera = () => {
    const v = videoRef.current;
    const s = v?.srcObject;
    if (s?.getTracks) s.getTracks().forEach(t => t.stop());
    if (v) v.srcObject = null;
    setCamOn(false);
  };

  const captureShot = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth || 480;
    c.height = v.videoHeight || 480;
    c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
    setShotDataURL(c.toDataURL("image/jpeg", 0.9));
  };

  useEffect(() => () => stopCamera(), []);
  const handlePendingProjectChange = (e) => {
    const value = e.target.value;
    setPendingProjectId(value ? Number(value) : null);
  };
const handleActivateProject = () => {
  if (!pendingProjectId) return;
  setActiveProjectId(pendingProjectId);
  persistActiveProjectId(pendingProjectId); // single source of truth for localStorage
};

  // const handleActivateProject = () => {
  //   if (!pendingProjectId) return;
  //   setActiveProjectId(pendingProjectId);
  //   localStorage.setItem("ACTIVE_PROJECT_ID", String(pendingProjectId));
  // };

  // Fetch attendance history for calendar
  const fetchAttendanceHistory = async () => {
    const uid = String(userData?.user_id || userData?.id || "");
   // const pid = getDefaultProjectId();
    const pid = activeProjectId;

    if (!uid || !pid) return;

    try {
      const year = calendarMonth.getFullYear();
      const month = calendarMonth.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const formatDate = (d) => {
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${mm}-${dd}`;
      };

      const { data } = await axiosInstance.get(
        ensureSlash(ATTEND_LIST_URL) +
          `?user_id=${uid}&project_id=${pid}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`
      );
      
      setAttendanceHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch attendance history:", err);
    }
  };

  const prefillToday = async () => {
    const uid = String(userData?.user_id || userData?.id || "");
   // const pid = getDefaultProjectId();
    const pid = activeProjectId;

    if (!uid || !pid) return;
    try {
      const { data } = await axiosInstance.get(
        ensureSlash(ATTEND_LIST_URL) +
          `?user_id=${uid}&project_id=${pid}&date=${ymdToday()}`
      );
      const latest = Array.isArray(data) ? data[0] : null;
      setAttState({
        inAt: latest?.check_in_at || null,
        outAt: latest?.check_out_at || null,
        lastAction: latest?.check_out_at ? "OUT" : (latest?.check_in_at ? "IN" : null),
      });
    } catch {}
  };

  // useEffect(() => { 
  //   if (userData) {
  //     prefillToday();
  //     fetchAttendanceHistory();
  //   }
  // }, [userData, calendarMonth]);
  useEffect(() => { 
    if (userData && activeProjectId) {
      prefillToday();
      fetchAttendanceHistory();
    }
  }, [userData, calendarMonth, activeProjectId]);

  const markAttendance = async () => {
    const uid = String(userData?.user_id || userData?.id || "");
    //const pid = getDefaultProjectId();
    const pid = activeProjectId;

    if (!uid) { setAttErr("Missing user id."); return; }
    if (!pid) { setAttErr("Missing project id."); return; }
    if (!shotDataURL) { setAttErr("Capture a photo first."); return; }

    setAttBusy(true); setAttErr(null); setAttMsg(null);
    try {
      const blob = dataURLtoBlob(shotDataURL);
      const fd = new FormData();
      fd.append("user_id", uid);
      fd.append("project_id", String(pid));
      fd.append("photo", blob, "attendance.jpg");
      if (forceAction) fd.append("force_action", forceAction);

      try {
        await new Promise((res) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              fd.append("lat", String(pos.coords.latitude));
              fd.append("lon", String(pos.coords.longitude));
              res();
            },
            () => res(),
            { enableHighAccuracy: false, timeout: 2500 }
          );
        });
      } catch {}

      const { data } = await axiosInstance.post(ensureSlash(ATTEND_MARK_URL), fd);

      const action = data.action || (data.check_out_at ? "OUT" : "IN");
      const inAt  = data.check_in_at  || attState.inAt;
      const outAt = data.check_out_at || attState.outAt;

      setAttState({ inAt, outAt, lastAction: action });
      setAttMsg(
        action === "IN"
          ? `Checked in at ${String(inAt)}`
          : `Checked out at ${String(outAt)}`
      );
      fetchAttendanceHistory(); // Refresh calendar
      stopCamera();
    } catch (err) {
      const r = err?.response;
      const msg =
        r?.data?.detail ||
        r?.data?.message ||
        (err?.message === "Network Error" ? "Network Error: CORS is blocking this call." : err?.message) ||
        "Attendance failed.";
      setAttErr(msg);
    } finally {
      setAttBusy(false);
    }
  };
  useEffect(() => {
  if (!userData || !Array.isArray(accesses) || !accesses.length) return;

  const uid = String(userData.user_id || userData.id || "");
  if (!uid) return;

  // unique project ids
  const uniquePids = [
    ...new Set(accesses.map((a) => a.project_id).filter(Boolean)),
  ].filter((pid) => !flowRoleStagesByProject[pid]); // jo already loaded hai unko skip karo

  if (!uniquePids.length) return;

  uniquePids.forEach(async (pid) => {
    try {
      const { data } = await getUserAccessForProject(uid, pid);
      const list = Array.isArray(data) ? data : [data];

      const roleStageMap = {};

      list.forEach((access) => {
        if (!Array.isArray(access.roles)) return;

        access.roles.forEach((r) => {
          if (!r) return;
          const code = typeof r === "string" ? r : r.role || r.name;
          if (!code) return;

          const key = String(code).toUpperCase();

          if (!roleStageMap[key]) {
            roleStageMap[key] = {
              role: code,
              stages: [],
              hasGlobalAllChecklist: false,
            };
          }

          const bucket = roleStageMap[key];

          // backend field: All_checklist (capital A)
          if (access.All_checklist && !access.stage_id) {
            bucket.hasGlobalAllChecklist = true;
          }

          if (access.stage_id) {
            const already = bucket.stages.some(
              (s) => s.stageId === access.stage_id
            );
            if (!already) {
              bucket.stages.push({
                stageId: access.stage_id,
                phaseId: access.phase_id,
                purposeId: access.purpose_id,
                allChecklist: !!access.All_checklist,
              });
            }
          }
        });
      });

      setFlowRoleStagesByProject((prev) => ({
        ...prev,
        [pid]: roleStageMap,
      }));
    } catch (err) {
      console.error("Failed to load role/stage map for project", pid, err);
    }
  });
}, [userData, accesses, flowRoleStagesByProject]);

const currentFlowRoleStage = activeProjectId
  ? getStageInfo(activeProjectId, flowRole)
  : null;

  // Calendar rendering helpers
  const getAttendanceStatus = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const record = attendanceHistory.find(att => {
      const attDate = att.date || att.check_in_at?.split('T')[0];
      return attDate === dateStr;
    });
    
    if (record) {
      return record.check_in_at ? 'present' : 'absent';
    }
    return null;
  };

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getAttendanceStatus(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium relative"
          style={{
            background: status === 'present' 
              ? '#d4f4dd' 
              : status === 'absent' 
              ? '#ffd4d4' 
              : isToday 
              ? '#fff8e1' 
              : 'transparent',
            border: isToday ? `2px solid ${ORANGE}` : status ? '1px solid transparent' : '1px solid #f0f0f0',
            color: status === 'present' 
              ? '#1d7a3a' 
              : status === 'absent' 
              ? '#b91c1c' 
              : textColor,
          }}
        >
          {day}
          {status && (
            <div className="absolute top-1 right-1">
              {status === 'present' ? (
                <FiCheck size={10} style={{ color: '#1d7a3a' }} />
              ) : (
                <FiX size={10} style={{ color: '#b91c1c' }} />
              )}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const changeMonth = (offset) => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-end"
      style={{
        background: "rgba(20,16,10,0.33)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        ref={profileRef}
        className="w-full max-w-md mx-auto rounded-3xl overflow-hidden max-h-[90vh] flex flex-col relative"
        style={{
          background: cardColor,
          border: `2px solid ${borderColor}`,
          color: textColor,
          boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          marginTop: "32px",
          marginRight: "32px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 5,
            background: "linear-gradient(90deg, #ffbe63 30%, #ffd080 100%)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
          }}
        ></div>

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "#fff8f0",
            border: `1.5px solid ${borderColor}`,
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            zIndex: 40,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
          title="Close"
        >
          <span style={{ fontWeight: 700, fontSize: 21 }}>×</span>
        </button>

        {/* Header */}
        <div
          style={{
            background: bgColor,
            borderBottom: `1.5px solid ${borderColor}`,
            padding: "32px 0 18px 0",
          }}
          className="flex flex-col items-center"
        >
          <div style={{ position: "relative", marginBottom: 8 }}>
            {userData?.profile_image || userData?.photo ? (
              <img
                src={userData.profile_image || userData.photo}
                alt="profile"
                onError={(e) => {
                  const uid = String(userData?.user_id || userData?.id || "");
                  const b64 = uid && localStorage.getItem(AVATAR_B64_KEY(uid));
                  if (b64) e.currentTarget.src = b64;
                }}
                style={{
                  height: 76,
                  width: 76,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${ORANGE}`,
                  boxShadow: "0 0 0 3px #fff",
                }}
              />
            ) : (
              <div
                style={{
                  height: 76,
                  width: 76,
                  borderRadius: "50%",
                  background: ORANGE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 32,
                  border: `3px solid ${ORANGE}`,
                  boxShadow: "0 0 0 3px #fff",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {getInitials(userData)}
              </div>
            )}

            <button
              onClick={handlePickPhoto}
              disabled={uploadingPhoto}
              title="Add/Change photo"
              aria-label="Add/Change photo"
              style={{
                position: "absolute",
                right: -6,
                bottom: -6,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: uploadingPhoto ? "#ffe4bd" : "#fff8f0",
                border: `1.5px solid ${ORANGE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ad5700",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                cursor: uploadingPhoto ? "not-allowed" : "pointer",
                fontWeight: 700
              }}
            >
              <FiPlus size={16} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handlePhotoSelected}
            />
          </div>

          <h2
            style={{
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 4,
              color: textColor,
            }}
          >
            {userData?.username}
          </h2>
          <div
            style={{
              background: accentBg,
              color: "#ad5700",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              padding: "4px 16px",
              margin: "7px 0",
              boxShadow: "0 1px 4px rgba(255,190,99,0.08)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <FiShield size={15} style={{ color: "#ad5700" }} /> {role}
          </div>
        </div>


         {/* ✅ Active project selector */}
        {accesses?.length > 0 && (
          <div
            style={{
              marginTop: 10,
              width: "100%",
              maxWidth: 300,
              alignSelf: "center",
              paddingInline: 24,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 4,
                color: "#bfa672",
                textAlign: "center",
              }}
            >
              Active project (for attendance & workflows)
            </label>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <select
                value={pendingProjectId || ""}
                onChange={handlePendingProjectChange}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${borderColor}`,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#ad5700",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <option value="">Select project</option>
                {accesses.map((a) => (
                  <option key={a.project_id} value={a.project_id}>
                    {getProjectName(a)}
                    {activeProjectId === Number(a.project_id)
                      ? " (Active)"
                      : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={handleActivateProject}
                disabled={!pendingProjectId}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `1px solid ${borderColor}`,
                  background: pendingProjectId ? ORANGE : "#eee",
                  color: "#ad5700",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: pendingProjectId ? "pointer" : "not-allowed",
                  whiteSpace: "nowrap",
                }}
              >
                Make Active
              </button>
            </div>
            {activeProjectId && (
              <div
                style={{
                  fontSize: 11,
                  marginTop: 4,
                  textAlign: "center",
                  color: "#bfa672",
                }}
              >
                Working on:{" "}
                <strong>
                  {getProjectName(
                    accesses.find(
                      (a) => Number(a.project_id) === activeProjectId
                    ) || { project_id: activeProjectId }
                  )}
                </strong>
              </div>
            )}
          </div>
        )}
                  {/* Flow role (Maker / Checker / Supervisor) dropdown from UserAccess */}
          <div style={{ marginTop: 8, width: "100%", maxWidth: 260 }}>
            <label
              htmlFor="flow-role-select"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 4,
                color: "#bfa672",
                textAlign: "center",
              }}
            >
              Act as role for workflows
            </label>
            {currentFlowRoleStage && currentFlowRoleStage.label && (
  <div
    style={{
      marginTop: 4,
      fontSize: 11,
      textAlign: "center",
      color: "#bfa672",
    }}
  >
    Assigned stages:&nbsp;
    <strong>{currentFlowRoleStage.label}</strong>
  </div>
)}


            {flowRoleLoading ? (
              <div
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: "#bfa672",
                }}
              >
                Loading roles…
              </div>
            ) : flowRoleError ? (
              <div
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: "#b94a00",
                  background: "#fff3e6",
                  borderRadius: 10,
                  padding: "4px 8px",
                  margin: "0 auto",
                }}
              >
                {flowRoleError}
              </div>
            ) : flowRoles.length ? (
              <select
                id="flow-role-select"
                value={flowRole}
                onChange={(e) => setFlowRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${borderColor}`,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#ad5700",
                  background: "#fff",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {flowRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <div
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: "#bfa672",
                }}
              >
                No Maker/Checker/Supervisor role assigned on this project.
              </div>
            )}
          </div>


        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5"
          style={{
            background: theme === "dark" ? "#23232c" : "#fff",
            minHeight: 160,
          }}
        >
          {/* Mark Attendance Section - Improved */}
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "#fff6ea", border: `1.2px solid ${borderColor}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "#9c670d" }}>
                <FiCamera size={18} />
                Mark Attendance
              </h3>
              <select
                value={forceAction}
                onChange={(e) => setForceAction(e.target.value)}
                className="text-sm rounded-lg px-3 py-1.5 font-medium"
                style={{ 
                  border: `1px solid ${borderColor}`, 
                  background: "#fff",
                  color: "#9c670d"
                }}
                title="Leave empty for auto IN/OUT"
              >
                <option value="">Auto</option>
                <option value="IN">Check IN</option>
                <option value="OUT">Check OUT</option>
              </select>
            </div>

            <div className="flex flex-col items-center gap-3">
              {!camOn && !shotDataURL && (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <button
                    onClick={startCamera}
                    className="w-full sm:flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md"
                    style={{ background: ORANGE, color: "#ad5700", border: `1px solid ${borderColor}` }}
                  >
                    <FiCamera size={18} /> Click Photo
                  </button>
                  <button
                    onClick={() => attendFileRef.current?.click()}
                    className="w-full sm:flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md"
                    style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
                  >
                    <FiUpload size={18} /> Upload Photo
                  </button>
                </div>
              )}

              {camOn && !shotDataURL && (
                <div className="flex flex-col items-center gap-3 w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ 
                      width: "100%", 
                      maxWidth: 280, 
                      height: 280, 
                      borderRadius: 16, 
                      border: `2px solid ${borderColor}`, 
                      objectFit: "cover",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    <button
                      onClick={captureShot}
                      className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md"
                      style={{ background: ORANGE, color: "#ad5700", border: `1px solid ${borderColor}` }}
                    >
                      Capture
                    </button>
                    <button
                      onClick={() => attendFileRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-md"
                      style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
                    >
                      <FiUpload size={16} /> Upload
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md"
                      style={{ background: "#fff0e1", color: "#ad5700", border: `1px solid ${borderColor}` }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {shotDataURL && (
                <div className="flex flex-col items-center gap-3 w-full">
                  <img
                    src={shotDataURL}
                    alt="preview"
                    style={{ 
                      width: "100%", 
                      maxWidth: 280, 
                      height: 280, 
                      borderRadius: 16, 
                      border: `2px solid ${borderColor}`, 
                      objectFit: "cover",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    <button
                      onClick={() => { setShotDataURL(null); startCamera(); }}
                      className="px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md"
                      style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
                    >
                      Retake
                    </button>
                    <button
                      onClick={() => attendFileRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-md"
                      style={{ background: "#fff", color: "#ad5700", border: `1px solid ${borderColor}` }}
                    >
                      <FiUpload size={16} /> Upload
                    </button>
                    <button
                      onClick={markAttendance}
                      disabled={attBusy}
                      className="px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md disabled:opacity-50"
                      style={{ background: ORANGE, color: "#ad5700", border: `1px solid ${borderColor}` }}
                    >
                      {attBusy ? "Marking..." : "Mark Attendance"}
                    </button>
                  </div>
                </div>
              )}

              {attErr && (
                <div
                  className="mt-2 text-sm w-full text-center"
                  style={{ 
                    color: "#b94a00", 
                    background: "#fff3e6", 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: 12, 
                    padding: "8px 12px" 
                  }}
                >
                  {attErr}
                </div>
              )}
              {attMsg && (
                <div
                  className="mt-2 text-sm w-full text-center"
                  style={{ 
                    color: "#2f6f2f", 
                    background: "#eaffea", 
                    border: "1px solid #9ad29a", 
                    borderRadius: 12, 
                    padding: "8px 12px" 
                  }}
                >
                  {attMsg}
                </div>
              )}

              {/* Status tiles */}
              <div className="mt-3 w-full grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ background: "#fff", border: `1px solid ${borderColor}` }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#bfa672" }}>Checked In</p>
                  <p className="font-bold text-sm" style={{ color: "#bb5600" }}>
                    {attState.inAt ? new Date(attState.inAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "—"}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "#fff", border: `1px solid ${borderColor}` }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#bfa672" }}>Checked Out</p>
                  <p className="font-bold text-sm" style={{ color: "#bb5600" }}>
                    {attState.outAt ? new Date(attState.outAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "—"}
                  </p>
                </div>
              </div>
            </div>

            <input
              ref={attendFileRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={onAttendanceFileSelected}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Attendance Calendar */}
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "#fff6ea", border: `1.2px solid ${borderColor}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "#9c670d" }}>
                <FiCalendar size={18} />
                Attendance Calendar
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                  style={{ background: "#fff", border: `1px solid ${borderColor}`, color: "#ad5700" }}
                >
                  ←
                </button>
                <span className="text-sm font-semibold px-2" style={{ color: "#9c670d" }}>
                  {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                  style={{ background: "#fff", border: `1px solid ${borderColor}`, color: "#ad5700" }}
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-bold" style={{ color: "#bfa672" }}>
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: ORANGE }}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: '#d4f4dd' }}></div>
                <span className="text-xs font-medium" style={{ color: "#1d7a3a" }}>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: '#ffd4d4' }}></div>
                <span className="text-xs font-medium" style={{ color: "#b91c1c" }}>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2" style={{ borderColor: ORANGE }}></div>
                <span className="text-xs font-medium" style={{ color: "#9c670d" }}>Today</span>
              </div>
            </div>
          </div>

          {/* Project Roles Section */}
          {accesses?.length > 0 && (
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: "#fff6ea",
                border: `1.2px solid ${borderColor}`,
              }}
            >
              <div
                className="flex items-center gap-2 mb-4"
                style={{ color: ORANGE }}
              >
                <FiBriefcase size={18} />
                <h3
                  className="font-bold text-base"
                  style={{ color: "#9c670d" }}
                >
                  Project Access
                </h3>
              </div>
              <div className="space-y-3">
               {accesses.slice(0, 3).map(
  (access, idx) =>
    isValidString(access.project_id) && (
      <div
        key={idx}
        className="rounded-xl p-4 transition-all hover:shadow-md"
        style={{
          background: "#fff",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-bold text-base"
            style={{ color: valueColor }}
          >
            {getProjectName(access)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {/* Roles badges */}
          <div className="flex flex-wrap gap-2">
            {access.roles?.slice(0, 2).map((role, j) => {
              const roleStr =
                typeof role === "string" ? role : role?.role;
              return isValidString(roleStr) ? (
                <span
                  key={j}
                  className="px-3 py-1"
                  style={{
                    background: ORANGE,
                    color: "#ad5700",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {roleStr}
                </span>
              ) : null;
            })}
          </div>

          {/* 👇 NEW: Stage info (current selected FLOW_ROLE ke hisaab se) */}
          {flowRole && (
            (() => {
              const stageInfo = getStageInfo(access.project_id, flowRole);
              if (!stageInfo || !stageInfo.label) return null;
              return (
                <div
                  className="text-xs mt-1"
                  style={{ color: "#bfa672" }}
                >
                  Stage access as{" "}
                  <span style={{ fontWeight: 600 }}>{flowRole}</span>:{" "}
                  <span
                    style={{ fontWeight: 600, color: valueColor }}
                  >
                    {stageInfo.label}
                  </span>
                </div>
              );
            })()
          )}
        </div>
      </div>
    )
)}

                {accesses.length > 3 && (
                  <div
                    className="text-center text-sm pt-2 font-medium"
                    style={{ color: "#a86c10" }}
                  >
                    +{accesses.length - 3} more projects
                  </div>
                )}
              </div>
            </div>
          )}
          

          {/* Contact Information */}
          {hasContactData() && (
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: "#fff6ea",
                border: `1.2px solid ${borderColor}`,
              }}
            >
              <h3
                className="font-bold mb-4 flex items-center gap-2 text-base"
                style={{ color: "#9c670d" }}
              >
                <FiMail size={18} />
                Contact Details
              </h3>
              <div className="space-y-3">
                {isValidString(userData?.email) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiMail size={18} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: "#bfa672" }}
                      >
                        Email
                      </p>
                      <p
                        className="font-bold text-sm"
                        style={{ color: valueColor }}
                      >
                        {userData.email}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.phone_number) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiPhone size={18} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: "#bfa672" }}
                      >
                        Phone
                      </p>
                      <p
                        className="font-bold text-sm"
                        style={{ color: valueColor }}
                      >
                        {userData.phone_number}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.date_joined) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiCalendar size={18} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: "#bfa672" }}
                      >
                        Joined
                      </p>
                      <p
                        className="font-bold text-sm"
                        style={{ color: valueColor }}
                      >
                        {new Date(userData.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.last_login) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiClock size={18} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: "#bfa672" }}
                      >
                        Last Login
                      </p>
                      <p
                        className="font-bold text-sm"
                        style={{ color: valueColor }}
                      >
                        {new Date(userData.last_login).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organization Section */}
          {hasOrganizationData() && (
            <div
              className="rounded-2xl p-5 mb-4 relative"
              ref={dropdownRef}
              style={{
                background: "#fff6ea",
                border: `1.2px solid ${borderColor}`,
              }}
            >
              <h3
                className="font-bold mb-4 flex items-center gap-2 text-base"
                style={{ color: "#9c670d" }}
              >
                <FiBriefcase size={18} />
                Organization Details
              </h3>
              {organizationDetails.loading ? (
                <div
                  className="flex items-center justify-center p-6 rounded-xl"
                  style={{
                    background: "#fff0e1",
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                  <span
                    className="ml-3 text-sm font-medium"
                    style={{ color: "#ab7a13" }}
                  >
                    Loading organization details...
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {organizationDetails.organization && (
                    <div
                      className="p-4 rounded-xl transition-all hover:shadow-md"
                      style={{
                        background: "#fff",
                        border: `1px solid ${borderColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                          style={{ background: accentBg, color: "#ad5700" }}
                        >
                          {organizationDetails.organization.organization_name
                            ? organizationDetails.organization
                                .organization_name[0]
                            : "O"}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold mb-0.5"
                            style={{ color: "#bfa672" }}
                          >
                            Organization
                          </p>
                          <p
                            className="font-bold text-sm"
                            style={{ color: valueColor }}
                          >
                            {organizationDetails.organization
                              .organization_name || `Org ${userData.org}`}
                          </p>
                          {organizationDetails.organization.contact_email && (
                            <p
                              className="text-xs"
                              style={{ color: valueColor }}
                            >
                              {organizationDetails.organization.contact_email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {organizationDetails.company && (
                    <div
                      className="p-4 rounded-xl transition-all hover:shadow-md"
                      style={{
                        background: "#fff",
                        border: `1px solid ${borderColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                          style={{ background: accentBg, color: "#ad5700" }}
                        >
                          {organizationDetails.company.name
                            ? organizationDetails.company.name[0]
                            : "C"}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold mb-0.5"
                            style={{ color: "#bfa672" }}
                          >
                            Company
                          </p>
                          <p
                            className="font-bold text-sm"
                            style={{ color: valueColor }}
                          >
                            {organizationDetails.company.name}
                          </p>
                          {(organizationDetails.company.region ||
                            organizationDetails.company.country) && (
                            <p
                              className="text-xs"
                              style={{ color: valueColor }}
                            >
                              {[
                                organizationDetails.company.region,
                                organizationDetails.company.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {organizationDetails.entity && (
                    <div
                      className="p-4 rounded-xl transition-all hover:shadow-md"
                      style={{
                        background: "#fff",
                        border: `1px solid ${borderColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                          style={{ background: accentBg, color: "#ad5700" }}
                        >
                          {organizationDetails.entity.name
                            ? organizationDetails.entity.name[0]
                            : "E"}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold mb-0.5"
                            style={{ color: "#bfa672" }}
                          >
                            Entity
                          </p>
                          <p
                            className="font-bold text-sm"
                            style={{ color: valueColor }}
                          >
                            {organizationDetails.entity.name}
                          </p>
                          {(organizationDetails.entity.state ||
                            organizationDetails.entity.region ||
                            organizationDetails.entity.zone) && (
                            <p
                              className="text-xs"
                              style={{ color: valueColor }}
                            >
                              {[
                                organizationDetails.entity.state,
                                organizationDetails.entity.region,
                                organizationDetails.entity.zone,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {!organizationDetails.organization &&
                    !organizationDetails.company &&
                    !organizationDetails.entity &&
                    isValidString(userData?.org) && (
                      <button
                        onClick={() => setManage(!manage)}
                        className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md"
                        style={{
                          background: "#fff",
                          border: `1px solid ${borderColor}`,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                            style={{ background: accentBg, color: "#ad5700" }}
                          >
                            {isValidString(userData?.organization_name)
                              ? String(userData.organization_name)[0]
                              : String(userData.org)[0]}
                          </div>
                          <div className="text-left">
                            <p
                              className="font-bold text-sm"
                              style={{ color: valueColor }}
                            >
                              {userData.organization_name ||
                                `Organization ${userData.org}`}
                            </p>
                            <p className="text-xs" style={{ color: "#bfa672" }}>
                              Org ID: {userData.org}
                            </p>
                          </div>
                        </div>
                        <IoMdArrowDropdown
                          size={20}
                          style={{
                            color: iconColor,
                            transform: manage ? "rotate(180deg)" : undefined,
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                    )}
                  {manage && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50"
                      style={{
                        background: cardColor,
                        border: `1.5px solid ${borderColor}`,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        animation: "slide-in-from-top .23s",
                      }}
                    >
                      <button
                        className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-md"
                        style={{
                          background: ORANGE,
                          color: "#ad5700",
                        }}
                        onClick={() =>
                          alert("Organization management coming soon!")
                        }
                      >
                        <FiSettings size={16} />
                        Manage Organization
                      </button>
                    </div>
                  )}
                </div>
              )}
              {organizationDetails.error && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "#ffeded", border: `1px solid #e96232` }}
                >
                  <p className="text-red-400 text-sm font-medium">
                    {organizationDetails.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          style={{
            background: cardColor,
            borderTop: `1.5px solid ${borderColor}`,
            padding: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
          className="flex gap-4"
        >
          <button
            className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            style={{
              background: ORANGE,
              color: "#8a4c00",
              boxShadow: "0 2px 8px rgba(255, 190, 99, 0.15)",
              fontWeight: 700,
              fontSize: 16,
            }}
            onClick={() => alert("Account details feature coming soon!")}
          >
            <FiUser size={16} style={{ color: "#ad5700" }} /> My Account
          </button>
          <button
            className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            style={{
              background: "#fff0e1",
              color: "#e24717",
              border: `1.5px solid #e24717`,
              fontWeight: 700,
              fontSize: 16,
            }}
            onClick={handleSignOut}
          >
            <FiLogOut size={16} style={{ color: "#e24717" }} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;