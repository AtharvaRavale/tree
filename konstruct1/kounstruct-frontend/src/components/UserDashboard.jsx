// import React, { useState, useEffect } from "react";
// import { getUserDashboard } from "../api/index";
// import { showToast } from "../utils/toast";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Activity,
//   Target,
//   Zap,
//   Download,
//   Filter,
//   RefreshCw,
//   Building,
//   Building2,
//   Factory,
// } from "lucide-react";

// const UserDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

//   // Enhanced theme system
//   const theme = {
//     light: {
//       bg: "#f7f8fa",
//       card: "bg-white",
//       text: "text-gray-900",
//       textSecondary: "text-gray-600",
//       border: "border-gray-200",
//       hover: "hover:bg-gray-50",
//       gradient: "bg-gradient-to-br from-purple-100 to-blue-100",
//     },
//     dark: {
//       bg: "#0f172a",
//       card: "bg-slate-800",
//       text: "text-white",
//       textSecondary: "text-slate-300",
//       border: "border-slate-700",
//       hover: "hover:bg-slate-700",
//       gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
//     },
//   };

//   const currentTheme = isDarkMode ? theme.dark : theme.light;

//   // Enhanced palette with role gradients
//   const palette = {
//     bg: currentTheme.bg,
//     card: currentTheme.card,
//     text: currentTheme.text,
//     border: currentTheme.border,
//     shadow: "shadow-xl",
//     gradient: currentTheme.gradient,
//     managerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
//     clientGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     adminGradient: "bg-gradient-to-r from-red-500 to-pink-500",
//     supervisorGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
//     makerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     checkerGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [selectedTimeRange]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await getUserDashboard();

//       console.log("Full API Response:", response);
//       console.log("Response Data:", response.data);

//       if (response.status === 200) {
//         setDashboardData(response.data.dashboard);
//         setUserId(response.data.user_id);
//         showToast("Dashboard loaded successfully", "success");
//       } else {
//         showToast("Failed to fetch dashboard data", "error");
//       }
//     } catch (error) {
//       console.error("Dashboard fetch error:", error);
//       console.error("Error response:", error.response?.data);
//       showToast(`Error loading dashboard: ${error.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enhanced KPI Card Component
//   const KPICard = ({
//     title,
//     value,
//     trend,
//     icon: Icon,
//     color,
//     suffix = "",
//     description,
//   }) => (
//     <div
//       className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-3">
//             <div
//               className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}
//             >
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className={`font-semibold ${currentTheme.text}`}>{title}</h3>
//               {description && (
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>
//                   {description}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-end gap-3">
//             <span className={`text-3xl font-bold ${currentTheme.text}`}>
//               {typeof value === "number" ? value.toLocaleString() : value}
//               {suffix}
//             </span>
//             {trend && (
//               <div
//                 className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
//                   trend > 0
//                     ? "text-green-600 bg-green-100"
//                     : "text-red-600 bg-red-100"
//                 }`}
//               >
//                 {trend > 0 ? (
//                   <TrendingUp className="w-4 h-4" />
//                 ) : (
//                   <TrendingDown className="w-4 h-4" />
//                 )}
//                 <span className="font-medium">{Math.abs(trend)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Custom Tooltip for Charts
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div
//           className={`${palette.card} p-4 rounded-lg shadow-lg border ${palette.border} backdrop-blur-sm`}
//         >
//           <p className={`font-medium ${currentTheme.text} mb-2`}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               <span className="font-medium">{entry.name}:</span> {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Generate time series data from role analytics
//   const generateTimeSeriesData = (data, role) => {
//     const days =
//       selectedTimeRange === "1d"
//         ? 1
//         : selectedTimeRange === "7d"
//         ? 7
//         : selectedTimeRange === "30d"
//         ? 30
//         : 90;

//     return Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));

//       let tasks = 0,
//         completed = 0,
//         pending = 0;

//       if (role === "SUPER_ADMIN") {
//         const baseChecklists = data.total_checklists || 0;
//         tasks = Math.floor(
//           (baseChecklists * (0.7 + Math.random() * 0.4)) / days
//         );
//         completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "USER" && data.projects_roles_analytics) {
//         data.projects_roles_analytics.forEach((item) => {
//           if (item.analytics && !item.analytics.error) {
//             Object.values(item.analytics).forEach((val) => {
//               if (typeof val === "number") {
//                 tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
//               }
//             });
//           }
//         });
//         completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "CLIENT") {
//         const baseProjects = data.created_project_count || 0;
//         tasks = Math.floor(baseProjects * 5 * (0.8 + Math.random() * 0.4));
//         completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
//         pending = Math.max(0, tasks - completed);
//       } else {
//         tasks = Math.floor(
//           (data.organizations_created || 1) * 3 * (0.8 + Math.random() * 0.4)
//         );
//         completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       }

//       return {
//         date: `${date.getMonth() + 1}/${date.getDate()}`,
//         tasks: Math.max(0, tasks),
//         completed: Math.max(0, completed),
//         pending: Math.max(0, pending),
//       };
//     });
//   };

//   // Generate role distribution pie chart data
//   const generateRoleDistribution = (data, role) => {
//     if (role === "SUPER_ADMIN") {
//       const totalMakers = data.total_makers || 0;
//       const totalCheckers = data.total_checkers || 0;
//       const totalUsers = data.total_users || 1;
//       const supervisors = Math.floor(totalUsers * 0.1);
//       const initializers = Math.floor(totalUsers * 0.05);

//       return [
//         { name: "Makers", value: totalMakers, color: "#8B5CF6" },
//         { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
//         { name: "Supervisors", value: supervisors, color: "#10B981" },
//         { name: "Initializers", value: initializers, color: "#F59E0B" },
//       ].filter((item) => item.value > 0);
//     } else if (role === "USER" && data.projects_roles_analytics) {
//       const roleCounts = {};
//       data.projects_roles_analytics.forEach((item) => {
//         roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
//       });

//       const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
//       return Object.entries(roleCounts).map(([role, count], index) => ({
//         name: role,
//         value: count,
//         color: colors[index % colors.length],
//       }));
//     }

//     return [];
//   };

//   // Get role icon
//   const getRoleIcon = (role) => {
//     switch (role.toUpperCase()) {
//       case "SUPER_ADMIN":
//         return "👑";
//       case "CLIENT":
//         return "👤";
//       case "MANAGER":
//         return "👥";
//       case "SUPERVISOR":
//         return "👥";
//       case "MAKER":
//         return "🔧";
//       case "CHECKER":
//         return "✅";
//       default:
//         return "📋";
//     }
//   };

//   // Get role gradient
//   const getRoleGradient = (role) => {
//     switch (role.toUpperCase()) {
//       case "SUPER_ADMIN":
//         return palette.adminGradient;
//       case "CLIENT":
//         return palette.clientGradient;
//       case "MANAGER":
//         return palette.managerGradient;
//       case "SUPERVISOR":
//         return palette.supervisorGradient;
//       case "MAKER":
//         return palette.makerGradient;
//       case "CHECKER":
//         return palette.checkerGradient;
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // Enhanced Manager Dashboard with Charts
//   const renderManagerDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "MANAGER");

//     const kpis = [
//       {
//         title: "Organizations",
//         value: data.organizations_created || 0,
//         trend: 12.5,
//         icon: Building,
//         color: "from-purple-500 to-purple-600",
//         description: "Created by you",
//       },
//       {
//         title: "Companies",
//         value: data.companies_created || 0,
//         trend: 8.3,
//         icon: Building2,
//         color: "from-blue-500 to-blue-600",
//         description: "Under management",
//       },
//       {
//         title: "Entities",
//         value: data.entities_created || 0,
//         trend: 15.7,
//         icon: Factory,
//         color: "from-green-500 to-green-600",
//         description: "Total entities",
//       },
//     ];

//     return (
//       <div className="space-y-8">
//         {/* Enhanced Header */}
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Manager Dashboard
//                 </h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>
//                   Organization management and analytics
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {(data.organizations_created || 0) +
//                   (data.companies_created || 0) +
//                   (data.entities_created || 0)}
//               </div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>
//                 Total Managed
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((kpi, index) => (
//             <KPICard key={index} {...kpi} />
//           ))}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           {/* Activity Trends */}
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//               Activity Trends
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={isDarkMode ? "#374151" : "#E5E7EB"}
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
//                 />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasks)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={0.6}
//                   fill="#10B981"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Performance Metrics */}
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//               Performance Overview
//             </h3>
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-purple-600 mb-2">
//                   92.5%
//                 </div>
//                 <div className={`text-sm ${currentTheme.textSecondary} mb-3`}>
//                   Management Efficiency
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-purple-600 h-3 rounded-full"
//                     style={{ width: "92.5%" }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <div className="text-4xl font-bold text-green-600 mb-2">
//                   87.3%
//                 </div>
//                 <div className={`text-sm ${currentTheme.textSecondary} mb-3`}>
//                   Success Rate
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-green-600 h-3 rounded-full"
//                     style={{ width: "87.3%" }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <div className="text-4xl font-bold text-blue-600 mb-2">
//                   3.2h
//                 </div>
//                 <div className={`text-sm ${currentTheme.textSecondary}`}>
//                   Avg Response Time
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Enhanced Super Admin Dashboard with Advanced Analytics
//   const renderSuperAdminDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "SUPER_ADMIN");
//     const roleDistribution = generateRoleDistribution(data, "SUPER_ADMIN");

//     const kpis = [
//       {
//         title: "Total Users",
//         value: data.total_users || 0,
//         trend: 8.5,
//         icon: Users,
//         color: "from-blue-500 to-blue-600",
//         description: "System wide",
//       },
//       {
//         title: "Active Projects",
//         value: data.total_projects || 0,
//         trend: 12.3,
//         icon: Target,
//         color: "from-green-500 to-green-600",
//         description: "In progress",
//       },
//       {
//         title: "Total Checklists",
//         value: data.total_checklists || 0,
//         trend: 15.7,
//         icon: CheckCircle,
//         color: "from-purple-500 to-purple-600",
//         description: "All projects",
//       },
//       {
//         title: "Makers",
//         value: data.total_makers || 0,
//         trend: 5.2,
//         icon: Activity,
//         color: "from-orange-500 to-orange-600",
//         description: "Active makers",
//       },
//       {
//         title: "Checkers",
//         value: data.total_checkers || 0,
//         trend: 7.8,
//         icon: Zap,
//         color: "from-red-500 to-red-600",
//         description: "Quality control",
//       },
//       {
//         title: "Efficiency",
//         value: "94.2",
//         trend: 3.1,
//         icon: BarChart3,
//         color: "from-indigo-500 to-indigo-600",
//         suffix: "%",
//         description: "Overall system",
//       },
//     ];

//     return (
//       <div className="space-y-8">
//         {/* Enhanced Header */}
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Super Admin Dashboard
//                 </h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>
//                   System-wide analytics and management
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">98.5%</div>
//                 <div className={`text-xs ${currentTheme.textSecondary}`}>
//                   Uptime
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {data.total_users || 0}
//                 </div>
//                 <div className={`text-xs ${currentTheme.textSecondary}`}>
//                   Online
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* KPI Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//           {kpis.map((kpi, index) => (
//             <KPICard key={index} {...kpi} />
//           ))}
//         </div>

//         {/* Advanced Charts */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* System Activity */}
//           <div
//             className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h3 className={`text-xl font-bold ${currentTheme.text}`}>
//                 System Activity
//               </h3>
//               <div className="flex gap-2 text-sm">
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                   Tasks
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   Completed
//                 </span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasksAdmin"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient
//                     id="colorCompletedAdmin"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={isDarkMode ? "#374151" : "#E5E7EB"}
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
//                 />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasksAdmin)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorCompletedAdmin)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Distribution */}
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//               Team Distribution
//             </h3>
//             {roleDistribution.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={roleDistribution}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {roleDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         ></div>
//                         <span
//                           className={`text-sm ${currentTheme.textSecondary}`}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${currentTheme.text}`}
//                       >
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <div className={`text-gray-400 text-sm`}>
//                   No team data available
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Organization Summary */}
//         {data.org_project_user_summary &&
//           data.org_project_user_summary.length > 0 && (
//             <div
//               className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//             >
//               <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//                 Organization Overview
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {data.org_project_user_summary.slice(0, 6).map((org, index) => (
//                   <div
//                     key={index}
//                     className={`p-4 rounded-lg border ${palette.border} ${currentTheme.hover} transition-colors`}
//                   >
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
//                         🏢
//                       </div>
//                       <div>
//                         <h4 className={`font-semibold ${currentTheme.text}`}>
//                           Org {org.org_id}
//                         </h4>
//                         <p className={`text-sm ${currentTheme.textSecondary}`}>
//                           {org.project_count} projects
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className={`text-sm ${currentTheme.textSecondary}`}>
//                         Users: {org.user_ids?.length || 0}
//                       </span>
//                       <span className="text-lg font-bold text-blue-600">
//                         {org.project_count}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//       </div>
//     );
//   };

//   // Enhanced Client Dashboard
//   const renderClientDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "CLIENT");

//     return (
//       <div className="space-y-8">
//         {/* Enhanced Header */}
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Client Dashboard
//                 </h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>
//                   Your projects and performance overview
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-blue-600">
//                 {data.created_project_count || 0}
//               </div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>
//                 Active Projects
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <KPICard
//             title="Projects Created"
//             value={data.created_project_count || 0}
//             trend={15.2}
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//             description="Total projects"
//           />
//           <KPICard
//             title="Success Rate"
//             value="94.2"
//             trend={5.8}
//             icon={CheckCircle}
//             color="from-green-500 to-green-600"
//             suffix="%"
//             description="Project completion"
//           />
//           <KPICard
//             title="Avg Duration"
//             value="2.4"
//             trend={-8.3}
//             icon={Clock}
//             color="from-purple-500 to-purple-600"
//             suffix="mo"
//             description="Per project"
//           />
//         </div>

//         {/* Charts and Projects */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           {/* Project Activity */}
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//               Project Activity
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasksClient"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={isDarkMode ? "#374151" : "#E5E7EB"}
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
//                 />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#06B6D4"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasksClient)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={0.6}
//                   fill="#10B981"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Recent Projects */}
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//               Recent Projects
//             </h3>
//             <div className="space-y-4">
//               {data.created_projects && data.created_projects.length > 0 ? (
//                 data.created_projects.slice(0, 5).map((project, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-center gap-4 p-3 rounded-lg ${currentTheme.hover} transition-colors border ${palette.border}`}
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
//                       🏗️
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className={`font-medium ${currentTheme.text}`}>
//                             {project.name || `Project ${project.id}`}
//                           </p>
//                           <p
//                             className={`text-sm ${currentTheme.textSecondary}`}
//                           >
//                             Created by you • Active
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
//                             Active
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <div className={`text-gray-400 text-sm`}>
//                     No projects created yet
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Enhanced User Dashboard with Role Analytics
//   const renderUserDashboard = (data) => {
//     const rolesData = data.projects_roles_analytics || [];
//     const timeSeriesData = generateTimeSeriesData(data, "USER");
//     const roleDistribution = generateRoleDistribution(data, "USER");

//     // Group by project
//     const groupedData = rolesData.reduce((acc, item) => {
//       const projectId = item.project_id;
//       if (!acc[projectId]) {
//         acc[projectId] = {};
//       }
//       acc[projectId][item.role] = item.analytics;
//       return acc;
//     }, {});

//     // Calculate total metrics
//     let totalTasks = 0;
//     let totalAssigned = 0;
//     rolesData.forEach((item) => {
//       if (item.analytics && !item.analytics.error) {
//         Object.entries(item.analytics).forEach(([key, value]) => {
//           if (typeof value === "number") {
//             totalTasks += value;
//             if (key.includes("assigned") || key.includes("pending_for_me")) {
//               totalAssigned += value;
//             }
//           }
//         });
//       }
//     });

//     return (
//       <div className="space-y-8">
//         {/* Enhanced Header */}
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${palette.gradient} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 📊
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   User Analytics Dashboard
//                 </h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>
//                   Your work analytics across all projects and roles
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {Object.keys(groupedData).length}
//               </div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>
//                 Active Projects
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* User KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KPICard
//             title="Total Tasks"
//             value={totalTasks}
//             trend={8.5}
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//             description="All assigned"
//           />
//           <KPICard
//             title="Assigned to Me"
//             value={totalAssigned}
//             trend={12.3}
//             icon={Users}
//             color="from-green-500 to-green-600"
//             description="Current workload"
//           />
//           <KPICard
//             title="Projects"
//             value={Object.keys(groupedData).length}
//             trend={5.7}
//             icon={BarChart3}
//             color="from-purple-500 to-purple-600"
//             description="Active projects"
//           />
//           <KPICard
//             title="Efficiency"
//             value={
//               totalTasks > 0
//                 ? Math.round((totalAssigned / totalTasks) * 100)
//                 : 0
//             }
//             trend={3.2}
//             icon={Zap}
//             color="from-orange-500 to-orange-600"
//             suffix="%"
//             description="Task completion"
//           />
//         </div>

//         {/* Charts Section */}
//         {rolesData.length > 0 && (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             {/* Activity Timeline */}
//             <div
//               className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//             >
//               <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//                 Activity Timeline
//               </h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSeriesData}>
//                   <defs>
//                     <linearGradient
//                       id="colorTasksUser"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={isDarkMode ? "#374151" : "#E5E7EB"}
//                   />
//                   <XAxis
//                     dataKey="date"
//                     stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
//                   />
//                   <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone"
//                     dataKey="tasks"
//                     stroke="#8B5CF6"
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#colorTasksUser)"
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="completed"
//                     stroke="#10B981"
//                     strokeWidth={2}
//                     fillOpacity={0.6}
//                     fill="#10B981"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Role Distribution */}
//             {roleDistribution.length > 0 && (
//               <div
//                 className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//               >
//                 <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
//                   My Roles
//                 </h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={roleDistribution}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={50}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {roleDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         ></div>
//                         <span
//                           className={`text-sm ${currentTheme.textSecondary}`}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${currentTheme.text}`}
//                       >
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Projects and Roles */}
//         {Object.keys(groupedData).length === 0 ? (
//           <div
//             className={`text-center py-12 ${palette.card} rounded-lg ${palette.shadow}`}
//           >
//             <div
//               className={`w-16 h-16 ${palette.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4`}
//             >
//               📈
//             </div>
//             <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
//               No Analytics Data Available
//             </h3>
//             <p className={`${currentTheme.textSecondary}`}>
//               You don't have any active role assignments yet.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {Object.entries(groupedData).map(([projectId, roles]) => (
//               <div key={projectId} className="space-y-4">
//                 {/* Project Header */}
//                 <div
//                   className={`p-4 rounded-lg ${palette.gradient} border ${palette.border}`}
//                 >
//                   <h2
//                     className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}
//                   >
//                     🏗️ Project {projectId}
//                     <span
//                       className={`text-sm font-normal px-3 py-1 rounded-full bg-white bg-opacity-20 text-white`}
//                     >
//                       {Object.keys(roles).length} role
//                       {Object.keys(roles).length !== 1 ? "s" : ""}
//                     </span>
//                   </h2>
//                 </div>

//                 {/* Role Cards Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {Object.entries(roles).map(([role, analytics]) => {
//                     const metrics = Object.entries(analytics || {}).map(
//                       ([key, value]) => ({
//                         label: key
//                           .replace(/_/g, " ")
//                           .replace(/\b\w/g, (l) => l.toUpperCase()),
//                         value: value || 0,
//                         key,
//                       })
//                     );

//                     return (
//                       <div
//                         key={role}
//                         className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} transform hover:scale-105 transition-all duration-300`}
//                       >
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`w-12 h-12 ${getRoleGradient(
//                                 role
//                               )} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}
//                             >
//                               {getRoleIcon(role)}
//                             </div>
//                             <div>
//                               <h3
//                                 className={`text-lg font-bold ${currentTheme.text}`}
//                               >
//                                 {role.toUpperCase()}
//                               </h3>
//                               <p
//                                 className={`text-sm ${currentTheme.textSecondary}`}
//                               >
//                                 Role Analytics
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 gap-3">
//                           {analytics && !analytics.error ? (
//                             metrics.map((metric) => (
//                               <div
//                                 key={metric.key}
//                                 className={`p-3 rounded-lg ${currentTheme.gradient} border ${palette.border}`}
//                               >
//                                 <div className="flex items-center justify-between">
//                                   <span
//                                     className={`text-sm ${currentTheme.textSecondary}`}
//                                   >
//                                     {metric.label}
//                                   </span>
//                                   <span
//                                     className={`text-xl font-bold text-purple-600`}
//                                   >
//                                     {metric.value}
//                                   </span>
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="text-center py-4">
//                               <span className="text-red-500 text-sm">
//                                 {analytics?.error || "No data available"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center transition-colors duration-300"
//         style={{ background: palette.bg }}
//       >
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//           <p className={`mt-4 text-lg font-medium ${currentTheme.text}`}>
//             Loading Analytics...
//           </p>
//           <p className={`${currentTheme.textSecondary} text-sm`}>
//             Preparing your insights
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen transition-colors duration-300"
//       style={{ background: palette.bg }}
//     >
//       {/* Enhanced Header */}
//       <div
//         className={`${palette.card} border-b ${palette.border} px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}
//       >
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
//                   Analytics Dashboard
//                 </h1>
//                 <p className={`${currentTheme.textSecondary} text-sm`}>
//                   Real-time insights and performance metrics
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Time Range Selector */}
//             <select
//               value={selectedTimeRange}
//               onChange={(e) => setSelectedTimeRange(e.target.value)}
//               className={`px-4 py-2 rounded-lg border ${palette.border} ${palette.card} ${currentTheme.text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
//             >
//               <option value="1d">Last 24 hours</option>
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 3 months</option>
//             </select>

//             {/* Action Buttons */}
//             <button
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <Download className="w-5 h-5" />
//             </button>
//             <button
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <Filter className="w-5 h-5" />
//             </button>
//             <button
//               onClick={fetchDashboardData}
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <RefreshCw
//                 className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
//               />
//             </button>

//             {/* Dark Mode Toggle */}
//             <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               {isDarkMode ? "☀️" : "🌙"}
//             </button>

//             {/* User ID Badge */}
//             {userId && (
//               <div className="px-3 py-1 rounded-full bg-purple-100 border border-purple-200">
//                 <span className="text-sm font-medium text-purple-800">
//                   ID: {userId}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Dashboard Content Based on Role */}
//         {!dashboardData ? (
//           <div
//             className={`text-center py-12 ${palette.card} rounded-xl ${palette.shadow}`}
//           >
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
//               No Dashboard Data Available
//             </h3>
//             <p className={`${currentTheme.textSecondary}`}>
//               Unable to load dashboard information.
//             </p>
//           </div>
//         ) : (
//           <>
//             {dashboardData.role === "MANAGER" &&
//               renderManagerDashboard(dashboardData)}
//             {dashboardData.role === "SUPER_ADMIN" &&
//               renderSuperAdminDashboard(dashboardData)}
//             {dashboardData.role === "CLIENT" &&
//               renderClientDashboard(dashboardData)}
//             {dashboardData.role === "USER" &&
//               renderUserDashboard(dashboardData)}
//           </>
//         )}

//         {/* Enhanced Refresh Section */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={fetchDashboardData}
//             disabled={loading}
//             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Refreshing...
//               </>
//             ) : (
//               <>
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh Dashboard
//               </>
//             )}
//           </button>

//           {/* Debug Info for Development */}
//           {dashboardData && (
//             <div className="mt-6">
//               <details
//                 className={`${palette.card} rounded-lg p-4 border ${palette.border} inline-block text-left max-w-2xl`}
//               >
//                 <summary
//                   className={`${currentTheme.text} cursor-pointer font-medium hover:text-purple-600 transition-colors`}
//                 >
//                   🔍 Debug Info (Development Only)
//                 </summary>
//                 <pre
//                   className={`mt-3 text-xs ${
//                     currentTheme.textSecondary
//                   } overflow-auto max-h-60 p-3 bg-gray-50 ${
//                     isDarkMode ? "bg-slate-900" : ""
//                   } rounded border-2 border-dashed border-gray-200`}
//                 >
//                   {JSON.stringify(dashboardData, null, 2)}
//                 </pre>
//               </details>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default UserDashboard;

// // src/pages/UserDashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { showToast } from "../utils/toast";
// import { getUserDashboard, getSnagStats } from "../api"; // expects getSnagStats(projectId)
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Activity,
//   Target,
//   Zap,
//   Download,
//   Filter,
//   RefreshCw,
//   Building,
//   Building2,
//   Factory,
// } from "lucide-react";

// /** Resolve active project id from URL or localStorage */
// function getActiveProjectId() {
//   try {
//     const urlParams = new URLSearchParams(window.location.search);
//     const q = urlParams.get("project_id");
//     if (q) return Number(q);
//   } catch {}
//   const ls =
//     localStorage.getItem("ACTIVE_PROJECT_ID") ||
//     localStorage.getItem("PROJECT_ID");
//   return ls ? Number(ls) : null;
// }

// const UserDashboard = () => {
//   // ---------------- Theme ----------------
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const theme = {
//     light: {
//       bg: "#f7f8fa",
//       card: "bg-white",
//       text: "text-gray-900",
//       textSecondary: "text-gray-600",
//       border: "border-gray-200",
//       hover: "hover:bg-gray-50",
//       gradient: "bg-gradient-to-br from-purple-100 to-blue-100",
//     },
//     dark: {
//       bg: "#0f172a",
//       card: "bg-slate-800",
//       text: "text-white",
//       textSecondary: "text-slate-300",
//       border: "border-slate-700",
//       hover: "hover:bg-slate-700",
//       gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
//     },
//   };
//   const currentTheme = isDarkMode ? theme.dark : theme.light;
//   const palette = {
//     bg: currentTheme.bg,
//     card: currentTheme.card,
//     text: currentTheme.text,
//     border: currentTheme.border,
//     hover: currentTheme.hover,
//     shadow: "shadow-xl",
//     gradient: currentTheme.gradient,
//     managerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
//     clientGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     adminGradient: "bg-gradient-to-r from-red-500 to-pink-500",
//     supervisorGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
//     makerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     checkerGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
//   };

//   // -------------- Core State --------------
//   const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // -------------- Snag Stats --------------
//   const [snagStats, setSnagStats] = useState(null);
//   const [snagLoading, setSnagLoading] = useState(false);

//   // -------------- Fetchers --------------
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const res = await getUserDashboard();
//       if (res?.status === 200) {
//         setDashboardData(res.data.dashboard);
//         setUserId(res.data.user_id);
//       } else {
//         showToast("Failed to fetch dashboard data", "error");
//       }
//     } catch (e) {
//       console.error(e);
//       showToast(`Error loading dashboard: ${e.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnagStats = async () => {
//     const pid = getActiveProjectId();
//     if (!pid) {
//       setSnagStats(null);
//       return;
//     }
//     try {
//       setSnagLoading(true);
//       const { data } = await getSnagStats(pid);
//       setSnagStats(data);
//     } catch (e) {
//       console.error("getSnagStats error:", e);
//       showToast("Failed to load snag statistics", "error");
//     } finally {
//       setSnagLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     fetchSnagStats();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedTimeRange]);

//   // -------------- Reusable UI --------------
//   const KPICard = ({
//     title,
//     value,
//     trend,
//     icon: Icon,
//     color,
//     suffix = "",
//     description,
//   }) => (
//     <div
//       className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-3">
//             <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className={`font-semibold ${currentTheme.text}`}>{title}</h3>
//               {description && (
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>{description}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-end gap-3">
//             <span className={`text-3xl font-bold ${currentTheme.text}`}>
//               {typeof value === "number" ? value.toLocaleString() : value}
//               {suffix}
//             </span>
//             {typeof trend === "number" && (
//               <div
//                 className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
//                   trend > 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
//                 }`}
//               >
//                 {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//                 <span className="font-medium">{Math.abs(trend)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload?.length) {
//       return (
//         <div
//           className={`${palette.card} p-4 rounded-lg shadow-lg border ${palette.border} backdrop-blur-sm`}
//         >
//           <p className={`font-medium ${currentTheme.text} mb-2`}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               <span className="font-medium">{entry.name}:</span> {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // -------------- Helpers --------------
//   const pct = (n) => (n == null ? "0.0" : Number(n).toFixed(1));

//   const generateTimeSeriesData = (data, role) => {
//     const days =
//       selectedTimeRange === "1d" ? 1 : selectedTimeRange === "7d" ? 7 : selectedTimeRange === "30d" ? 30 : 90;

//     return Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));

//       let tasks = 0,
//         completed = 0,
//         pending = 0;

//       if (role === "SUPER_ADMIN") {
//         const baseChecklists = data?.total_checklists || 0;
//         tasks = Math.floor((baseChecklists * (0.7 + Math.random() * 0.4)) / days);
//         completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "USER" && data?.projects_roles_analytics) {
//         data.projects_roles_analytics.forEach((item) => {
//           if (item.analytics && !item.analytics.error) {
//             Object.values(item.analytics).forEach((val) => {
//               if (typeof val === "number") {
//                 tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
//               }
//             });
//           }
//         });
//         completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "CLIENT") {
//         const baseProjects = data?.created_project_count || 0;
//         tasks = Math.floor(baseProjects * 5 * (0.8 + Math.random() * 0.4));
//         completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
//         pending = Math.max(0, tasks - completed);
//       } else {
//         tasks = Math.floor(((data?.organizations_created || 1) * 3 * (0.8 + Math.random() * 0.4)));
//         completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       }

//       return {
//         date: `${date.getMonth() + 1}/${date.getDate()}`,
//         tasks: Math.max(0, tasks),
//         completed: Math.max(0, completed),
//         pending: Math.max(0, pending),
//       };
//     });
//   };

//   const generateRoleDistribution = (data, role) => {
//     if (role === "SUPER_ADMIN") {
//       const totalMakers = data?.total_makers || 0;
//       const totalCheckers = data?.total_checkers || 0;
//       const totalUsers = data?.total_users || 1;
//       const supervisors = Math.floor(totalUsers * 0.1);
//       const initializers = Math.floor(totalUsers * 0.05);
//       return [
//         { name: "Makers", value: totalMakers, color: "#8B5CF6" },
//         { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
//         { name: "Supervisors", value: supervisors, color: "#10B981" },
//         { name: "Initializers", value: initializers, color: "#F59E0B" },
//       ].filter((x) => x.value > 0);
//     } else if (role === "USER" && data?.projects_roles_analytics) {
//       const roleCounts = {};
//       data.projects_roles_analytics.forEach((item) => {
//         roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
//       });
//       const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
//       return Object.entries(roleCounts).map(([r, count], i) => ({
//         name: r,
//         value: count,
//         color: colors[i % colors.length],
//       }));
//     }
//     return [];
//   };

//   const getRoleIcon = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return "👑";
//       case "CLIENT":
//         return "👤";
//       case "MANAGER":
//       case "SUPERVISOR":
//         return "👥";
//       case "MAKER":
//         return "🔧";
//       case "CHECKER":
//         return "✅";
//       default:
//         return "📋";
//     }
//   };
//   const getRoleGradient = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return palette.adminGradient;
//       case "CLIENT":
//         return palette.clientGradient;
//       case "MANAGER":
//         return palette.managerGradient;
//       case "SUPERVISOR":
//         return palette.supervisorGradient;
//       case "MAKER":
//         return palette.makerGradient;
//       case "CHECKER":
//         return palette.checkerGradient;
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // ----------- Derived Snag Data -----------
//   const inspectedPieData = useMemo(
//     () =>
//       snagStats
//         ? [
//             { name: "Inspected", value: snagStats?.snags_inspected?.count || 0 },
//             { name: "Not Inspected", value: snagStats?.snags_not_inspected?.count || 0 },
//           ]
//         : [],
//     [snagStats]
//   );

//   const statusBarData = useMemo(() => {
//     if (!snagStats?.snags_status) return [];
//     return Object.entries(snagStats.snags_status).map(([k, v]) => ({
//       name: k.replace(/_/g, " "),
//       count: v?.count ?? 0,
//       percent: v?.percent ?? 0,
//     }));
//   }, [snagStats]);

//   const categoryBarData = useMemo(
//     () =>
//       snagStats?.category_wise?.map((c) => ({
//         name: `Cat ${c.category_id}`,
//         snags: c.snags || 0,
//       })) || [],
//     [snagStats]
//   );

//   const toStageStack = (list) =>
//     (list || []).map((s) => ({
//       stage: `S${s.stage_id}`,
//       pending: s.pending || 0,
//       work_in_progress: s.work_in_progress || 0,
//       completed: s.completed || 0,
//     }));

//   const inspectorStageData = useMemo(
//     () => toStageStack(snagStats?.inspector_stage_unit_status),
//     [snagStats]
//   );
//   const makerStageData = useMemo(
//     () => toStageStack(snagStats?.maker_stage_unit_status),
//     [snagStats]
//   );
//   const supervisorStageData = useMemo(
//     () => toStageStack(snagStats?.supervisor_stage_unit_status),
//     [snagStats]
//   );

//   const kpiEntries = useMemo(
//     () =>
//       snagStats
//         ? Object.entries(snagStats.kpis || {}).map(([k, v]) => ({
//             label: k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
//             value: v == null ? "—" : v,
//           }))
//         : [],
//     [snagStats]
//   );

//   const multiTotals = snagStats?.category_multi_submissions?.totals || [];
//   const multiItemsByUser = snagStats?.multi_submission_items_by_user || [];

//   // -------------- Role Dashboards --------------
//   const renderManagerDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "MANAGER");
//     const kpis = [
//       {
//         title: "Organizations",
//         value: data?.organizations_created || 0,
//         trend: 12.5,
//         icon: Building,
//         color: "from-purple-500 to-purple-600",
//         description: "Created by you",
//       },
//       {
//         title: "Companies",
//         value: data?.companies_created || 0,
//         trend: 8.3,
//         icon: Building2,
//         color: "from-blue-500 to-blue-600",
//         description: "Under management",
//       },
//       {
//         title: "Entities",
//         value: data?.entities_created || 0,
//         trend: 15.7,
//         icon: Factory,
//         color: "from-green-500 to-green-600",
//         description: "Total entities",
//       },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${getRoleGradient(data.role)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Manager Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>Organization management and analytics</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {(data?.organizations_created || 0) + (data?.companies_created || 0) + (data?.entities_created || 0)}
//               </div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>Total Managed</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Activity Trends</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                 <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
//                 <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={0.6} fill="#10B981" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Performance Overview</h3>
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-purple-600 mb-2">92.5%</div>
//                 <div className={`text-sm ${currentTheme.textSecondary} mb-3`}>Management Efficiency</div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div className="bg-purple-600 h-3 rounded-full" style={{ width: "92.5%" }}></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-green-600 mb-2">87.3%</div>
//                 <div className={`text-sm ${currentTheme.textSecondary} mb-3`}>Success Rate</div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div className="bg-green-600 h-3 rounded-full" style={{ width: "87.3%" }}></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-blue-600 mb-2">3.2h</div>
//                 <div className={`text-sm ${currentTheme.textSecondary}`}>Avg Response Time</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSuperAdminDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "SUPER_ADMIN");
//     const roleDistribution = generateRoleDistribution(data, "SUPER_ADMIN");
//     const kpis = [
//       { title: "Total Users", value: data?.total_users || 0, trend: 8.5, icon: Users, color: "from-blue-500 to-blue-600", description: "System wide" },
//       { title: "Active Projects", value: data?.total_projects || 0, trend: 12.3, icon: Target, color: "from-green-500 to-green-600", description: "In progress" },
//       { title: "Total Checklists", value: data?.total_checklists || 0, trend: 15.7, icon: CheckCircle, color: "from-purple-500 to-purple-600", description: "All projects" },
//       { title: "Makers", value: data?.total_makers || 0, trend: 5.2, icon: Activity, color: "from-orange-500 to-orange-600", description: "Active makers" },
//       { title: "Checkers", value: data?.total_checkers || 0, trend: 7.8, icon: Zap, color: "from-red-500 to-red-600", description: "Quality control" },
//       { title: "Efficiency", value: "94.2", trend: 3.1, icon: BarChart3, color: "from-indigo-500 to-indigo-600", suffix: "%", description: "Overall system" },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${getRoleGradient(data.role)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Super Admin Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>System-wide analytics and management</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">98.5%</div>
//                 <div className={`text-xs ${currentTheme.textSecondary}`}>Uptime</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{data?.total_users || 0}</div>
//                 <div className={`text-xs ${currentTheme.textSecondary}`}>Online</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <div className="flex items-center justify-between mb-6">
//               <h3 className={`text-xl font-bold ${currentTheme.text}`}>System Activity</h3>
//               <div className="flex gap-2 text-sm">
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div> Tasks
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div> Completed
//                 </span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasksAdmin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorCompletedAdmin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                 <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasksAdmin)" />
//                 <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletedAdmin)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Team Distribution</h3>
//             {roleDistribution.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
//                       {roleDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
//                         <span className={`text-sm ${currentTheme.textSecondary}`}>{item.name}</span>
//                       </div>
//                       <span className={`text-sm font-medium ${currentTheme.text}`}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <div className={`text-gray-400 text-sm`}>No team data available</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderClientDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "CLIENT");
//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${getRoleGradient(data.role)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Client Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>Your projects and performance overview</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-blue-600">{data?.created_project_count || 0}</div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>Active Projects</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <KPICard title="Projects Created" value={data?.created_project_count || 0} trend={15.2} icon={Target} color="from-blue-500 to-blue-600" description="Total projects" />
//           <KPICard title="Success Rate" value="94.2" trend={5.8} icon={CheckCircle} color="from-green-500 to-green-600" suffix="%" description="Project completion" />
//           <KPICard title="Avg Duration" value="2.4" trend={-8.3} icon={Clock} color="from-purple-500 to-purple-600" suffix="mo" description="Per project" />
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Project Activity</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasksClient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                 <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorTasksClient)" />
//                 <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={0.6} fill="#10B981" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Recent Projects</h3>
//             <div className="space-y-4">
//               {data?.created_projects?.length ? (
//                 data.created_projects.slice(0, 5).map((project, index) => (
//                   <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${currentTheme.hover} transition-colors border ${palette.border}`}>
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">🏗️</div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className={`font-medium ${currentTheme.text}`}>{project.name || `Project ${project.id}`}</p>
//                           <p className={`text-sm ${currentTheme.textSecondary}`}>Created by you • Active</p>
//                         </div>
//                         <div className="text-right">
//                           <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">Active</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <div className={`text-gray-400 text-sm`}>No projects created yet</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderUserDashboard = (data) => {
//     const rolesData = data?.projects_roles_analytics || [];
//     const timeSeriesData = generateTimeSeriesData(data, "USER");
//     const roleDistribution = generateRoleDistribution(data, "USER");

//     const groupedData = rolesData.reduce((acc, item) => {
//       const projectId = item.project_id;
//       if (!acc[projectId]) acc[projectId] = {};
//       acc[projectId][item.role] = item.analytics;
//       return acc;
//     }, {});
//     let totalTasks = 0;
//     let totalAssigned = 0;
//     rolesData.forEach((item) => {
//       if (item.analytics && !item.analytics.error) {
//         Object.entries(item.analytics).forEach(([key, value]) => {
//           if (typeof value === "number") {
//             totalTasks += value;
//             if (key.includes("assigned") || key.includes("pending_for_me")) {
//               totalAssigned += value;
//             }
//           }
//         });
//       }
//     });

//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${palette.gradient} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 📊
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>User Analytics Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>Your work analytics across all projects and roles</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">{Object.keys(groupedData).length}</div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>Active Projects</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KPICard title="Total Tasks" value={totalTasks} trend={8.5} icon={Target} color="from-blue-500 to-blue-600" description="All assigned" />
//           <KPICard title="Assigned to Me" value={totalAssigned} trend={12.3} icon={Users} color="from-green-500 to-green-600" description="Current workload" />
//           <KPICard title="Projects" value={Object.keys(groupedData).length} trend={5.7} icon={BarChart3} color="from-purple-500 to-purple-600" description="Active projects" />
//           <KPICard
//             title="Efficiency"
//             value={totalTasks > 0 ? Math.round((totalAssigned / totalTasks) * 100) : 0}
//             trend={3.2}
//             icon={Zap}
//             color="from-orange-500 to-orange-600"
//             suffix="%"
//             description="Task completion"
//           />
//         </div>

//         {rolesData.length > 0 && (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//               <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Activity Timeline</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSeriesData}>
//                   <defs>
//                     <linearGradient id="colorTasksUser" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                   <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                   <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasksUser)" />
//                   <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={0.6} fill="#10B981" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {roleDistribution.length > 0 && (
//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//                 <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>My Roles</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={5} dataKey="value">
//                       {roleDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
//                         <span className={`text-sm ${currentTheme.textSecondary}`}>{item.name}</span>
//                       </div>
//                       <span className={`text-sm font-medium ${currentTheme.text}`}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {Object.keys(groupedData).length === 0 ? (
//           <div className={`text-center py-12 ${palette.card} rounded-lg ${palette.shadow}`}>
//             <div className={`w-16 h-16 ${palette.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4`}>📈</div>
//             <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>No Analytics Data Available</h3>
//             <p className={`${currentTheme.textSecondary}`}>You don't have any active role assignments yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {Object.entries(groupedData).map(([projectId, roles]) => (
//               <div key={projectId} className="space-y-4">
//                 <div className={`p-4 rounded-lg ${palette.gradient} border ${palette.border}`}>
//                   <h2 className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}>
//                     🏗️ Project {projectId}
//                     <span className={`text-sm font-normal px-3 py-1 rounded-full bg-white bg-opacity-20 text-white`}>
//                       {Object.keys(roles).length} role{Object.keys(roles).length !== 1 ? "s" : ""}
//                     </span>
//                   </h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {Object.entries(roles).map(([role, analytics]) => {
//                     const metrics = Object.entries(analytics || {}).map(([key, value]) => ({
//                       label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
//                       value: value || 0,
//                       key,
//                     }));
//                     return (
//                       <div key={role} className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} transform hover:scale-105 transition-all duration-300`}>
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className={`w-12 h-12 ${getRoleGradient(role)} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
//                             {getRoleIcon(role)}
//                           </div>
//                           <div>
//                             <h3 className={`text-lg font-bold ${currentTheme.text}`}>{role.toUpperCase()}</h3>
//                             <p className={`text-sm ${currentTheme.textSecondary}`}>Role Analytics</p>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 gap-3">
//                           {analytics && !analytics.error ? (
//                             metrics.map((m) => (
//                               <div key={m.key} className={`p-3 rounded-lg ${currentTheme.gradient} border ${palette.border}`}>
//                                 <div className="flex items-center justify-between">
//                                   <span className={`text-sm ${currentTheme.textSecondary}`}>{m.label}</span>
//                                   <span className={`text-xl font-bold text-purple-600`}>{m.value}</span>
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="text-center py-4">
//                               <span className="text-red-500 text-sm">{analytics?.error || "No data available"}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // -------------- Loader --------------
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: palette.bg }}>
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//           <p className={`mt-4 text-lg font-medium ${currentTheme.text}`}>Loading Analytics...</p>
//           <p className={`${currentTheme.textSecondary} text-sm`}>Preparing your insights</p>
//         </div>
//       </div>
//     );
//   }

//   // -------------- Render --------------
//   return (
//     <div className="min-h-screen transition-colors duration-300" style={{ background: palette.bg }}>
//       {/* Header */}
//       <div className={`${palette.card} border-b ${palette.border} px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}>
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className={`text-2xl font-bold ${currentTheme.text}`}>Analytics Dashboard</h1>
//                 <p className={`${currentTheme.textSecondary} text-sm`}>Real-time insights and performance metrics</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <select
//               value={selectedTimeRange}
//               onChange={(e) => setSelectedTimeRange(e.target.value)}
//               className={`px-4 py-2 rounded-lg border ${palette.border} ${palette.card} ${currentTheme.text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
//             >
//               <option value="1d">Last 24 hours</option>
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 3 months</option>
//             </select>

//             <button className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               <Download className="w-5 h-5" />
//             </button>
//             <button className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               <Filter className="w-5 h-5" />
//             </button>
//             <button onClick={() => { fetchDashboardData(); fetchSnagStats(); }} className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               <RefreshCw className="w-5 h-5" />
//             </button>

//             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               {isDarkMode ? "☀️" : "🌙"}
//             </button>

//             {userId && (
//               <div className="px-3 py-1 rounded-full bg-purple-100 border border-purple-200">
//                 <span className="text-sm font-medium text-purple-800">ID: {userId}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* ===== Snag Stats Section ===== */}
//         <div className="space-y-8">
//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">🧩</div>
//                 <div>
//                   <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Snag Statistics</h2>
//                   <p className={`${currentTheme.textSecondary} text-sm`}>Project {snagStats?.project_id ?? "—"}</p>
//                 </div>
//               </div>
//               <button onClick={fetchSnagStats} className={`px-3 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} border ${palette.border}`}>
//                 {snagLoading ? "Refreshing..." : "Refresh Snags"}
//               </button>
//             </div>

//             {/* KPI Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-teal-50 ${isDarkMode ? 'from-emerald-900/20 to-teal-900/20' : ''}`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
//                     <BarChart3 className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-right">
//                     <div className="text-3xl font-bold text-emerald-600">{snagStats?.snags_raised ?? 0}</div>
//                   </div>
//                 </div>
//                 <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Snags Raised</h3>
//                 <p className="text-xs text-emerald-600/70 mt-1">Total raised</p>
//               </div>

//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-cyan-50 ${isDarkMode ? 'from-blue-900/20 to-cyan-900/20' : ''}`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
//                     <CheckCircle className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-blue-600">{snagStats?.snags_inspected?.count ?? 0}</div>
//                     <div className="text-sm font-semibold text-blue-500">{pct(snagStats?.snags_inspected?.percent)}%</div>
//                   </div>
//                 </div>
//                 <h3 className="font-semibold text-blue-700 dark:text-blue-400">Inspected</h3>
//                 <p className="text-xs text-blue-600/70 mt-1">Mode: {snagStats?.snags_inspected?.mode ?? "—"}</p>
//               </div>

//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-amber-50 to-orange-50 ${isDarkMode ? 'from-amber-900/20 to-orange-900/20' : ''}`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
//                     <Clock className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-amber-600">{snagStats?.snags_not_inspected?.count ?? 0}</div>
//                     <div className="text-sm font-semibold text-amber-500">{pct(snagStats?.snags_not_inspected?.percent)}%</div>
//                   </div>
//                 </div>
//                 <h3 className="font-semibold text-amber-700 dark:text-amber-400">Not Inspected</h3>
//                 <p className="text-xs text-amber-600/70 mt-1">Pending inspection</p>
//               </div>

//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-indigo-50 ${isDarkMode ? 'from-purple-900/20 to-indigo-900/20' : ''}`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
//                     <Activity className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-right">
//                     <div className="text-3xl font-bold text-purple-600">{snagStats?.units_progress?.verification_completed ?? 0}</div>
//                   </div>
//                 </div>
//                 <h3 className="font-semibold text-purple-700 dark:text-purple-400">Units Progress</h3>
//                 <p className="text-xs text-purple-600/70 mt-1">Verification completed</p>
//               </div>
//             </div>

//             {/* Charts: Pie + Status */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//                 <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Inspection Coverage</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <PieChart>
//                     <Pie data={inspectedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
//                       {inspectedPieData.map((_, i) => (
//                         <Cell key={i} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//                 <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Snags Status</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={statusBarData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                     <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                     <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" name="Count" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Category + Multi-submission */}
//             <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} mt-8`}>
//               <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Category-wise Snags</h3>
//               {categoryBarData.length ? (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={categoryBarData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                     <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                     <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="snags" name="Snags" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className={`${currentTheme.textSecondary}`}>No category data.</div>
//               )}

//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className={`p-4 rounded-lg border ${palette.border}`}>
//                   <div className={`text-sm ${currentTheme.textSecondary}`}>Multi-Submission Level Used</div>
//                   <div className="text-2xl font-bold">{snagStats?.category_multi_submissions?.level_used ?? "—"}</div>
//                 </div>
//                 <div className={`p-4 rounded-lg border ${palette.border}`}>
//                   <div className={`text-sm ${currentTheme.textSecondary}`}>Totals (by Category)</div>
//                   <div className="mt-2 space-y-1">
//                     {multiTotals.length ? (
//                       multiTotals.map((t, i) => (
//                         <div key={i} className="flex items-center justify-between text-sm">
//                           <span className={`${currentTheme.text}`}>Cat {t.category_id}</span>
//                           <span className="font-semibold">{t.count}</span>
//                         </div>
//                       ))
//                     ) : (
//                       <div className={`${currentTheme.textSecondary}`}>—</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stage Status */}
//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
//               {[
//                 { title: "Inspector Stage Status", data: inspectorStageData },
//                 { title: "Maker Stage Status", data: makerStageData },
//                 { title: "Supervisor Stage Status", data: supervisorStageData },
//               ].map((blk, i) => (
//                 <div key={i} className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//                   <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>{blk.title}</h3>
//                   {blk.data.length ? (
//                     <ResponsiveContainer width="100%" height={260}>
//                       <BarChart data={blk.data}>
//                         <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                         <XAxis dataKey="stage" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                         <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="pending" stackId="a" name="Pending" />
//                         <Bar dataKey="work_in_progress" stackId="a" name="WIP" />
//                         <Bar dataKey="completed" stackId="a" name="Completed" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className={`${currentTheme.textSecondary}`}>No stage data.</div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Checklist KPIs */}
//             <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} mt-8`}>
//               <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Checklist KPIs</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {kpiEntries.length ? (
//                   kpiEntries.map((k, i) => (
//                     <div key={i} className={`p-4 rounded-lg border ${palette.border} ${currentTheme.hover}`}>
//                       <div className={`text-xs ${currentTheme.textSecondary}`}>{k.label}</div>
//                       <div className="text-xl font-semibold">{k.value}</div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className={`${currentTheme.textSecondary}`}>—</div>
//                 )}
//               </div>
//             </div>

//             {/* Units progress */}
//             <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} mt-8`}>
//               <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Units Progress</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {["raised_by_inspector", "verification_completed", "handover_given"].map((k) => (
//                   <div key={k} className={`p-4 rounded-lg border ${palette.border}`}>
//                     <div className={`text-xs ${currentTheme.textSecondary}`}>{k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
//                     <div className="text-2xl font-bold">{snagStats?.units_progress?.[k] ?? 0}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Multi-submission items by user */}
//             <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} mt-8`}>
//               <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Multi-Submission Items by User</h3>
//               {multiItemsByUser.length ? (
//                 <div className="overflow-auto">
//                   <table className="min-w-full text-sm">
//                     <thead>
//                       <tr className={`text-left border-b ${palette.border}`}>
//                         <th className="py-2 pr-4">User ID</th>
//                         <th className="py-2 pr-4">Items Count</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {multiItemsByUser.map((u, i) => (
//                         <tr key={i} className={`border-b ${palette.border}`}>
//                           <td className="py-2 pr-4">{u.user_id}</td>
//                           <td className="py-2 pr-4 font-semibold">{u.items_count}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className={`${currentTheme.textSecondary}`}>No user item data.</div>
//               )}
//             </div>

//             {/* Raw JSON (debug) */}
//             {/* <div className="mt-6">
//               <details className={`${palette.card} rounded-lg p-4 border ${palette.border} inline-block text-left max-w-2xl`}>
//                 <summary className={`${currentTheme.text} cursor-pointer font-medium`}>🔎 Raw Snag Stats (debug)</summary>
//                 <pre
//                   className={`mt-3 text-xs ${currentTheme.textSecondary} overflow-auto max-h-72 p-3 rounded border-2 border-dashed ${palette.border} ${
//                     isDarkMode ? "bg-slate-900" : "bg-gray-50"
//                   }`}
//                 >
//                   {JSON.stringify(snagStats, null, 2)}
//                 </pre>
//               </details>
//             </div> */}
//           </div>
//         </div>

//         {/* ===== Role Dashboards ===== */}
//         {!dashboardData ? (
//           <div className={`text-center py-12 ${palette.card} rounded-xl ${palette.shadow} mt-8`}>
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>No Dashboard Data Available</h3>
//             <p className={`${currentTheme.textSecondary}`}>Unable to load dashboard information.</p>
//           </div>
//         ) : (
//           <>
//             {dashboardData.role === "MANAGER" && renderManagerDashboard(dashboardData)}
//             {dashboardData.role === "SUPER_ADMIN" && renderSuperAdminDashboard(dashboardData)}
//             {dashboardData.role === "CLIENT" && renderClientDashboard(dashboardData)}
//             {dashboardData.role === "USER" && renderUserDashboard(dashboardData)}
//           </>
//         )}

//         {/* Refresh */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => {
//               fetchDashboardData();
//               fetchSnagStats();
//             }}
//             disabled={loading || snagLoading}
//             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
//           >
//             {(loading || snagLoading) ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Refreshing...
//               </>
//             ) : (
//               <>
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh Dashboard
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;


// // src/pages/UserDashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { showToast } from "../utils/toast";
// import { getUserDashboard, getSnagStats } from "../api"; // expects getSnagStats(projectId)
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Activity,
//   Target,
//   Zap,
//   Download,
//   Filter,
//   RefreshCw,
//   Building,
//   Building2,
//   Factory,
// } from "lucide-react";

// /** Resolve active project id from URL or localStorage */
// function getActiveProjectId() {
//   try {
//     const urlParams = new URLSearchParams(window.location.search);
//     const q = urlParams.get("project_id");
//     if (q) return Number(q);
//   } catch {}
//   const ls =
//     localStorage.getItem("ACTIVE_PROJECT_ID") ||
//     localStorage.getItem("PROJECT_ID");
//   return ls ? Number(ls) : null;
// }

// const UserDashboard = () => {
//   // ---------------- Theme ----------------
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const theme = {
//     light: {
//       bg: "#f7f8fa",
//       card: "bg-white",
//       text: "text-gray-900",
//       textSecondary: "text-gray-600",
//       border: "border-gray-200",
//       hover: "hover:bg-gray-50",
//       gradient: "bg-gradient-to-br from-purple-100 to-blue-100",
//     },
//     dark: {
//       bg: "#0f172a",
//       card: "bg-slate-800",
//       text: "text-white",
//       textSecondary: "text-slate-300",
//       border: "border-slate-700",
//       hover: "hover:bg-slate-700",
//       gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
//     },
//   };
//   const currentTheme = isDarkMode ? theme.dark : theme.light;
//   const palette = {
//     bg: currentTheme.bg,
//     card: currentTheme.card,
//     text: currentTheme.text,
//     border: currentTheme.border,
//     hover: currentTheme.hover,
//     shadow: "shadow-xl",
//     gradient: currentTheme.gradient,
//     managerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
//     clientGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     adminGradient: "bg-gradient-to-r from-red-500 to-pink-500",
//     supervisorGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
//     makerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     checkerGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
//   };

//   // -------------- Core State --------------
//   const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // -------------- Snag Stats --------------
//   const [snagStats, setSnagStats] = useState(null);
//   const [snagLoading, setSnagLoading] = useState(false);

//   // -------------- Fetchers --------------
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const res = await getUserDashboard();
//       if (res?.status === 200) {
//         setDashboardData(res.data.dashboard);
//         setUserId(res.data.user_id);
//       } else {
//         showToast("Failed to fetch dashboard data", "error");
//       }
//     } catch (e) {
//       console.error(e);
//       showToast(`Error loading dashboard: ${e.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnagStats = async () => {
//     const pid = getActiveProjectId();
//     if (!pid) {
//       setSnagStats(null);
//       return;
//     }
//     try {
//       setSnagLoading(true);
//       const { data } = await getSnagStats(pid);
//       setSnagStats(data);
//     } catch (e) {
//       console.error("getSnagStats error:", e);
//       showToast("Failed to load snag statistics", "error");
//     } finally {
//       setSnagLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     fetchSnagStats();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedTimeRange]);

//   // -------------- Reusable UI --------------
//   const KPICard = ({
//     title,
//     value,
//     trend,
//     icon: Icon,
//     color,
//     suffix = "",
//     description,
//   }) => (
//     <div
//       className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-3">
//             <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className={`font-semibold ${currentTheme.text}`}>{title}</h3>
//               {description && (
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>{description}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-end gap-3">
//             <span className={`text-3xl font-bold ${currentTheme.text}`}>
//               {typeof value === "number" ? value.toLocaleString() : value}
//               {suffix}
//             </span>
//             {typeof trend === "number" && (
//               <div
//                 className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
//                   trend > 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
//                 }`}
//               >
//                 {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//                 <span className="font-medium">{Math.abs(trend)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload?.length) {
//       return (
//         <div
//           className={`${palette.card} p-4 rounded-lg shadow-lg border ${palette.border} backdrop-blur-sm`}
//         >
//           <p className={`font-medium ${currentTheme.text} mb-2`}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               <span className="font-medium">{entry.name}:</span> {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // -------------- Helpers --------------
//   const pct = (n) => (n == null ? "0.0" : Number(n).toFixed(1));

//   const generateTimeSeriesData = (data, role) => {
//     const days =
//       selectedTimeRange === "1d" ? 1 : selectedTimeRange === "7d" ? 7 : selectedTimeRange === "30d" ? 30 : 90;

//     return Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));

//       let tasks = 0,
//         completed = 0,
//         pending = 0;

//       if (role === "SUPER_ADMIN") {
//         const baseChecklists = data?.total_checklists || 0;
//         tasks = Math.floor((baseChecklists * (0.7 + Math.random() * 0.4)) / days);
//         completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "USER" && data?.projects_roles_analytics) {
//         data.projects_roles_analytics.forEach((item) => {
//           if (item.analytics && !item.analytics.error) {
//             Object.values(item.analytics).forEach((val) => {
//               if (typeof val === "number") {
//                 tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
//               }
//             });
//           }
//         });
//         completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "CLIENT") {
//         const baseProjects = data?.created_project_count || 0;
//         tasks = Math.floor(baseProjects * 5 * (0.8 + Math.random() * 0.4));
//         completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
//         pending = Math.max(0, tasks - completed);
//       } else {
//         tasks = Math.floor(((data?.organizations_created || 1) * 3 * (0.8 + Math.random() * 0.4)));
//         completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       }

//       return {
//         date: `${date.getMonth() + 1}/${date.getDate()}`,
//         tasks: Math.max(0, tasks),
//         completed: Math.max(0, completed),
//         pending: Math.max(0, pending),
//       };
//     });
//   };

//   const generateRoleDistribution = (data, role) => {
//     if (role === "SUPER_ADMIN") {
//       const totalMakers = data?.total_makers || 0;
//       const totalCheckers = data?.total_checkers || 0;
//       const totalUsers = data?.total_users || 1;
//       const supervisors = Math.floor(totalUsers * 0.1);
//       const initializers = Math.floor(totalUsers * 0.05);
//       return [
//         { name: "Makers", value: totalMakers, color: "#8B5CF6" },
//         { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
//         { name: "Supervisors", value: supervisors, color: "#10B981" },
//         { name: "Initializers", value: initializers, color: "#F59E0B" },
//       ].filter((x) => x.value > 0);
//     } else if (role === "USER" && data?.projects_roles_analytics) {
//       const roleCounts = {};
//       data.projects_roles_analytics.forEach((item) => {
//         roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
//       });
//       const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
//       return Object.entries(roleCounts).map(([r, count], i) => ({
//         name: r,
//         value: count,
//         color: colors[i % colors.length],
//       }));
//     }
//     return [];
//   };

//   const getRoleIcon = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return "👑";
//       case "CLIENT":
//         return "👤";
//       case "MANAGER":
//       case "SUPERVISOR":
//         return "👥";
//       case "MAKER":
//         return "🔧";
//       case "CHECKER":
//         return "✅";
//       default:
//         return "📋";
//     }
//   };
//   const getRoleGradient = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return palette.adminGradient;
//       case "CLIENT":
//         return palette.clientGradient;
//       case "MANAGER":
//         return palette.managerGradient;
//       case "SUPERVISOR":
//         return palette.supervisorGradient;
//       case "MAKER":
//         return palette.makerGradient;
//       case "CHECKER":
//         return palette.checkerGradient;
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // ----------- Derived Snag Data -----------
//   const inspectedPieData = useMemo(
//     () =>
//       snagStats
//         ? [
//             { name: "Inspected", value: snagStats?.snags_inspected?.count || 0 },
//             { name: "Not Inspected", value: snagStats?.snags_not_inspected?.count || 0 },
//           ]
//         : [],
//     [snagStats]
//   );

//   const statusBarData = useMemo(() => {
//     if (!snagStats?.snags_status) return [];
//     return Object.entries(snagStats.snags_status).map(([k, v]) => ({
//       name: k.replace(/_/g, " "),
//       count: v?.count ?? 0,
//       percent: v?.percent ?? 0,
//     }));
//   }, [snagStats]);

//   const categoryBarData = useMemo(
//     () =>
//       snagStats?.category_wise?.map((c) => ({
//         name: `Cat ${c.category_id}`,
//         snags: c.snags || 0,
//       })) || [],
//     [snagStats]
//   );

//   const toStageStack = (list) =>
//     (list || []).map((s) => ({
//       stage: `S${s.stage_id}`,
//       pending: s.pending || 0,
//       work_in_progress: s.work_in_progress || 0,
//       completed: s.completed || 0,
//     }));

//   const inspectorStageData = useMemo(
//     () => toStageStack(snagStats?.inspector_stage_unit_status),
//     [snagStats]
//   );
//   const makerStageData = useMemo(
//     () => toStageStack(snagStats?.maker_stage_unit_status),
//     [snagStats]
//   );
//   const supervisorStageData = useMemo(
//     () => toStageStack(snagStats?.supervisor_stage_unit_status),
//     [snagStats]
//   );

//   const kpiEntries = useMemo(
//     () =>
//       snagStats
//         ? Object.entries(snagStats.kpis || {}).map(([k, v]) => ({
//             label: k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
//             value: v == null ? "—" : v,
//           }))
//         : [],
//     [snagStats]
//   );

//   const multiTotals = snagStats?.category_multi_submissions?.totals || [];
//   const multiItemsByUser = snagStats?.multi_submission_items_by_user || [];

//   // -------------- Role Dashboards --------------
//   const renderManagerDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "MANAGER");
//     const kpis = [
//       {
//         title: "Organizations",
//         value: data?.organizations_created || 0,
//         trend: 12.5,
//         icon: Building,
//         color: "from-purple-500 to-purple-600",
//         description: "Created by you",
//       },
//       {
//         title: "Companies",
//         value: data?.companies_created || 0,
//         trend: 8.3,
//         icon: Building2,
//         color: "from-blue-500 to-blue-600",
//         description: "Under management",
//       },
//       {
//         title: "Entities",
//         value: data?.entities_created || 0,
//         trend: 15.7,
//         icon: Factory,
//         color: "from-green-500 to-green-600",
//         description: "Total entities",
//       },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${getRoleGradient(data.role)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Manager Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>Organization management and analytics</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {(data?.organizations_created || 0) + (data?.companies_created || 0) + (data?.entities_created || 0)}
//               </div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>Total Managed</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Activity Trends</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                 <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
//                 <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={0.6} fill="#10B981" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Performance Overview</h3>
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-purple-600 mb-2">92.5%</div>
//                 <div className={`text-sm ${currentTheme.textSecondary} mb-3`}>Management Efficiency</div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div className="bg-purple-600 h-3 rounded-full" style={{ width: "92.5%" }}></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-green-600 mb-2">87.3%</div>
//                 <div className={`text-sm ${currentTheme.textSecondary} mb-3`}>Success Rate</div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div className="bg-green-600 h-3 rounded-full" style={{ width: "87.3%" }}></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-blue-600 mb-2">3.2h</div>
//                 <div className={`text-sm ${currentTheme.textSecondary}`}>Avg Response Time</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSuperAdminDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "SUPER_ADMIN");
//     const roleDistribution = generateRoleDistribution(data, "SUPER_ADMIN");
//     const kpis = [
//       { title: "Total Users", value: data?.total_users || 0, trend: 8.5, icon: Users, color: "from-blue-500 to-blue-600", description: "System wide" },
//       { title: "Active Projects", value: data?.total_projects || 0, trend: 12.3, icon: Target, color: "from-green-500 to-green-600", description: "In progress" },
//       { title: "Total Checklists", value: data?.total_checklists || 0, trend: 15.7, icon: CheckCircle, color: "from-purple-500 to-purple-600", description: "All projects" },
//       { title: "Makers", value: data?.total_makers || 0, trend: 5.2, icon: Activity, color: "from-orange-500 to-orange-600", description: "Active makers" },
//       { title: "Checkers", value: data?.total_checkers || 0, trend: 7.8, icon: Zap, color: "from-red-500 to-red-600", description: "Quality control" },
//       { title: "Efficiency", value: "94.2", trend: 3.1, icon: BarChart3, color: "from-indigo-500 to-indigo-600", suffix: "%", description: "Overall system" },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${getRoleGradient(data.role)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Super Admin Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>System-wide analytics and management</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">98.5%</div>
//                 <div className={`text-xs ${currentTheme.textSecondary}`}>Uptime</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{data?.total_users || 0}</div>
//                 <div className={`text-xs ${currentTheme.textSecondary}`}>Online</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <div className="flex items-center justify-between mb-6">
//               <h3 className={`text-xl font-bold ${currentTheme.text}`}>System Activity</h3>
//               <div className="flex gap-2 text-sm">
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div> Tasks
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div> Completed
//                 </span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasksAdmin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorCompletedAdmin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                 <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasksAdmin)" />
//                 <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletedAdmin)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Team Distribution</h3>
//             {roleDistribution.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
//                       {roleDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
//                         <span className={`text-sm ${currentTheme.textSecondary}`}>{item.name}</span>
//                       </div>
//                       <span className={`text-sm font-medium ${currentTheme.text}`}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <div className={`text-gray-400 text-sm`}>No team data available</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderClientDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "CLIENT");
//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${getRoleGradient(data.role)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Client Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>Your projects and performance overview</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-blue-600">{data?.created_project_count || 0}</div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>Active Projects</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <KPICard title="Projects Created" value={data?.created_project_count || 0} trend={15.2} icon={Target} color="from-blue-500 to-blue-600" description="Total projects" />
//           <KPICard title="Success Rate" value="94.2" trend={5.8} icon={CheckCircle} color="from-green-500 to-green-600" suffix="%" description="Project completion" />
//           <KPICard title="Avg Duration" value="2.4" trend={-8.3} icon={Clock} color="from-purple-500 to-purple-600" suffix="mo" description="Per project" />
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Project Activity</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasksClient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                 <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorTasksClient)" />
//                 <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={0.6} fill="#10B981" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Recent Projects</h3>
//             <div className="space-y-4">
//               {data?.created_projects?.length ? (
//                 data.created_projects.slice(0, 5).map((project, index) => (
//                   <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${currentTheme.hover} transition-colors border ${palette.border}`}>
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">🏗️</div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className={`font-medium ${currentTheme.text}`}>{project.name || `Project ${project.id}`}</p>
//                           <p className={`text-sm ${currentTheme.textSecondary}`}>Created by you • Active</p>
//                         </div>
//                         <div className="text-right">
//                           <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">Active</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <div className={`text-gray-400 text-sm`}>No projects created yet</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderUserDashboard = (data) => {
//     const rolesData = data?.projects_roles_analytics || [];
//     const timeSeriesData = generateTimeSeriesData(data, "USER");
//     const roleDistribution = generateRoleDistribution(data, "USER");

//     const groupedData = rolesData.reduce((acc, item) => {
//       const projectId = item.project_id;
//       if (!acc[projectId]) acc[projectId] = {};
//       acc[projectId][item.role] = item.analytics;
//       return acc;
//     }, {});
//     let totalTasks = 0;
//     let totalAssigned = 0;
//     rolesData.forEach((item) => {
//       if (item.analytics && !item.analytics.error) {
//         Object.entries(item.analytics).forEach(([key, value]) => {
//           if (typeof value === "number") {
//             totalTasks += value;
//             if (key.includes("assigned") || key.includes("pending_for_me")) {
//               totalAssigned += value;
//             }
//           }
//         });
//       }
//     });

//     return (
//       <div className="space-y-8">
//         <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className={`w-16 h-16 ${palette.gradient} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
//                 📊
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>User Analytics Dashboard</h2>
//                 <p className={`${currentTheme.textSecondary} text-lg`}>Your work analytics across all projects and roles</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">{Object.keys(groupedData).length}</div>
//               <div className={`text-sm ${currentTheme.textSecondary}`}>Active Projects</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KPICard title="Total Tasks" value={totalTasks} trend={8.5} icon={Target} color="from-blue-500 to-blue-600" description="All assigned" />
//           <KPICard title="Assigned to Me" value={totalAssigned} trend={12.3} icon={Users} color="from-green-500 to-green-600" description="Current workload" />
//           <KPICard title="Projects" value={Object.keys(groupedData).length} trend={5.7} icon={BarChart3} color="from-purple-500 to-purple-600" description="Active projects" />
//           <KPICard
//             title="Efficiency"
//             value={totalTasks > 0 ? Math.round((totalAssigned / totalTasks) * 100) : 0}
//             trend={3.2}
//             icon={Zap}
//             color="from-orange-500 to-orange-600"
//             suffix="%"
//             description="Task completion"
//           />
//         </div>

//         {rolesData.length > 0 && (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//               <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>Activity Timeline</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSeriesData}>
//                   <defs>
//                     <linearGradient id="colorTasksUser" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                   <XAxis dataKey="date" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                   <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasksUser)" />
//                   <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={0.6} fill="#10B981" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {roleDistribution.length > 0 && (
//               <div className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}>
//                 <h3 className={`text-xl font-bold ${currentTheme.text} mb-6`}>My Roles</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={5} dataKey="value">
//                       {roleDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
//                         <span className={`text-sm ${currentTheme.textSecondary}`}>{item.name}</span>
//                       </div>
//                       <span className={`text-sm font-medium ${currentTheme.text}`}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {Object.keys(groupedData).length === 0 ? (
//           <div className={`text-center py-12 ${palette.card} rounded-lg ${palette.shadow}`}>
//             <div className={`w-16 h-16 ${palette.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4`}>📈</div>
//             <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>No Analytics Data Available</h3>
//             <p className={`${currentTheme.textSecondary}`}>You don't have any active role assignments yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {Object.entries(groupedData).map(([projectId, roles]) => (
//               <div key={projectId} className="space-y-4">
//                 <div className={`p-4 rounded-lg ${palette.gradient} border ${palette.border}`}>
//                   <h2 className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}>
//                     🏗️ Project {projectId}
//                     <span className={`text-sm font-normal px-3 py-1 rounded-full bg-white bg-opacity-20 text-white`}>
//                       {Object.keys(roles).length} role{Object.keys(roles).length !== 1 ? "s" : ""}
//                     </span>
//                   </h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {Object.entries(roles).map(([role, analytics]) => {
//                     const metrics = Object.entries(analytics || {}).map(([key, value]) => ({
//                       label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
//                       value: value || 0,
//                       key,
//                     }));
//                     return (
//                       <div key={role} className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} transform hover:scale-105 transition-all duration-300`}>
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className={`w-12 h-12 ${getRoleGradient(role)} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
//                             {getRoleIcon(role)}
//                           </div>
//                           <div>
//                             <h3 className={`text-lg font-bold ${currentTheme.text}`}>{role.toUpperCase()}</h3>
//                             <p className={`text-sm ${currentTheme.textSecondary}`}>Role Analytics</p>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 gap-3">
//                           {analytics && !analytics.error ? (
//                             metrics.map((m) => (
//                               <div key={m.key} className={`p-3 rounded-lg ${currentTheme.gradient} border ${palette.border}`}>
//                                 <div className="flex items-center justify-between">
//                                   <span className={`text-sm ${currentTheme.textSecondary}`}>{m.label}</span>
//                                   <span className={`text-xl font-bold text-purple-600`}>{m.value}</span>
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="text-center py-4">
//                               <span className="text-red-500 text-sm">{analytics?.error || "No data available"}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // -------------- Loader --------------
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: palette.bg }}>
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//           <p className={`mt-4 text-lg font-medium ${currentTheme.text}`}>Loading Analytics...</p>
//           <p className={`${currentTheme.textSecondary} text-sm`}>Preparing your insights</p>
//         </div>
//       </div>
//     );
//   };

//   // Enhanced color palette for snag stats
//   const snagColors = {
//     raised: {
//       gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
//       bg: isDarkMode ? 'from-violet-900/20 via-purple-900/20 to-fuchsia-900/20' : 'from-violet-50 via-purple-50 to-fuchsia-50',
//       text: isDarkMode ? 'text-violet-400' : 'text-violet-700',
//       value: isDarkMode ? 'text-violet-300' : 'text-violet-600',
//       icon: '🚀'
//     },
//     inspected: {
//       gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
//       bg: isDarkMode ? 'from-emerald-900/20 via-teal-900/20 to-cyan-900/20' : 'from-emerald-50 via-teal-50 to-cyan-50',
//       text: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
//       value: isDarkMode ? 'text-emerald-300' : 'text-emerald-600',
//       icon: '✓'
//     },
//     notInspected: {
//       gradient: 'from-amber-500 via-orange-500 to-red-400',
//       bg: isDarkMode ? 'from-amber-900/20 via-orange-900/20 to-red-900/20' : 'from-amber-50 via-orange-50 to-red-50',
//       text: isDarkMode ? 'text-amber-400' : 'text-amber-700',
//       value: isDarkMode ? 'text-amber-300' : 'text-amber-600',
//       icon: '⏳'
//     },
//     progress: {
//       gradient: 'from-blue-500 via-indigo-500 to-purple-500',
//       bg: isDarkMode ? 'from-blue-900/20 via-indigo-900/20 to-purple-900/20' : 'from-blue-50 via-indigo-50 to-purple-50',
//       text: isDarkMode ? 'text-blue-400' : 'text-blue-700',
//       value: isDarkMode ? 'text-blue-300' : 'text-blue-600',
//       icon: '📊'
//     }
//   };

//   const chartColors = {
//     inspected: '#10B981',
//     notInspected: '#F59E0B',
//     pending: '#EF4444',
//     wip: '#F59E0B',
//     completed: '#10B981',
//     categories: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1']
//   };

//   // -------------- Render --------------
//   return (
//     <div className="min-h-screen transition-colors duration-300" style={{ background: palette.bg }}>
//       {/* Header */}
//       <div className={`${palette.card} border-b ${palette.border} px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}>
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className={`text-2xl font-bold ${currentTheme.text}`}>Analytics Dashboard</h1>
//                 <p className={`${currentTheme.textSecondary} text-sm`}>Real-time insights and performance metrics</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <select
//               value={selectedTimeRange}
//               onChange={(e) => setSelectedTimeRange(e.target.value)}
//               className={`px-4 py-2 rounded-lg border ${palette.border} ${palette.card} ${currentTheme.text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
//             >
//               <option value="1d">Last 24 hours</option>
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 3 months</option>
//             </select>

//             <button className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               <Download className="w-5 h-5" />
//             </button>
//             <button className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               <Filter className="w-5 h-5" />
//             </button>
//             <button onClick={() => { fetchDashboardData(); fetchSnagStats(); }} className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               <RefreshCw className="w-5 h-5" />
//             </button>

//             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}>
//               {isDarkMode ? "☀️" : "🌙"}
//             </button>

//             {userId && (
//               <div className="px-3 py-1 rounded-full bg-purple-100 border border-purple-200">
//                 <span className="text-sm font-medium text-purple-800">ID: {userId}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* ===== Enhanced Snag Stats Section ===== */}
//         <div className="space-y-8 mb-12">
//           {/* Header Card */}
//           <div className={`${palette.card} rounded-2xl p-8 border ${palette.border} ${palette.shadow} bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-2xl transform rotate-3">
//                     <span className="text-3xl">🎯</span>
//                   </div>
//                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
//                 </div>
//                 <div>
//                   <h2 className={`text-3xl font-bold ${currentTheme.text} mb-1`}>Snag Analytics Hub</h2>
//                   <p className={`${currentTheme.textSecondary} text-base flex items-center gap-2`}>
//                     <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
//                     Project {snagStats?.project_id ?? "—"} • Live Monitoring
//                   </p>
//                 </div>
//               </div>
//               <button 
//                 onClick={fetchSnagStats} 
//                 disabled={snagLoading}
//                 className={`px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
//               >
//                 <RefreshCw className={`w-4 h-4 ${snagLoading ? 'animate-spin' : ''}`} />
//                 {snagLoading ? "Syncing..." : "Refresh Stats"}
//               </button>
//             </div>
//           </div>

//           {/* Enhanced KPI Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Snags Raised */}
//             <div className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.raised.bg} relative overflow-hidden group`}>
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.raised.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.raised.gradient} shadow-xl`}>
//                     <span className="text-2xl">{snagColors.raised.icon}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-4xl font-black ${snagColors.raised.value}`}>{snagStats?.snags_raised ?? 0}</div>
//                   </div>
//                 </div>
//                 <h3 className={`font-bold text-lg ${snagColors.raised.text} mb-1`}>Snags Raised</h3>
//                 <p className={`text-xs ${currentTheme.textSecondary} font-medium`}>Total snags identified</p>
//               </div>
//             </div>

//             {/* Inspected */}
//             <div className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.inspected.bg} relative overflow-hidden group`}>
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.inspected.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.inspected.gradient} shadow-xl`}>
//                     <span className="text-2xl">{snagColors.inspected.icon}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-3xl font-black ${snagColors.inspected.value}`}>{snagStats?.snags_inspected?.count ?? 0}</div>
//                     <div className={`text-sm font-bold ${snagColors.inspected.text} mt-1`}>{pct(snagStats?.snags_inspected?.percent)}%</div>
//                   </div>
//                 </div>
//                 <h3 className={`font-bold text-lg ${snagColors.inspected.text} mb-1`}>Inspected</h3>
//                 <p className={`text-xs ${currentTheme.textSecondary} font-medium`}>Mode: {snagStats?.snags_inspected?.mode ?? "—"}</p>
//               </div>
//             </div>

//             {/* Not Inspected */}
//             <div className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.notInspected.bg} relative overflow-hidden group`}>
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.notInspected.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.notInspected.gradient} shadow-xl`}>
//                     <span className="text-2xl">{snagColors.notInspected.icon}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-3xl font-black ${snagColors.notInspected.value}`}>{snagStats?.snags_not_inspected?.count ?? 0}</div>
//                     <div className={`text-sm font-bold ${snagColors.notInspected.text} mt-1`}>{pct(snagStats?.snags_not_inspected?.percent)}%</div>
//                   </div>
//                 </div>
//                 <h3 className={`font-bold text-lg ${snagColors.notInspected.text} mb-1`}>Pending Review</h3>
//                 <p className={`text-xs ${currentTheme.textSecondary} font-medium`}>Awaiting inspection</p>
//               </div>
//             </div>

//             {/* Units Progress */}
//             <div className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.progress.bg} relative overflow-hidden group`}>
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.progress.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.progress.gradient} shadow-xl`}>
//                     <span className="text-2xl">{snagColors.progress.icon}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-4xl font-black ${snagColors.progress.value}`}>{snagStats?.units_progress?.verification_completed ?? 0}</div>
//                   </div>
//                 </div>
//                 <h3 className={`font-bold text-lg ${snagColors.progress.text} mb-1`}>Units Verified</h3>
//                 <p className={`text-xs ${currentTheme.textSecondary} font-medium`}>Verification completed</p>
//               </div>
//             </div>
//           </div>

//           {/* Charts: Enhanced Pie + Status */}
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//             <div className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//                   <Activity className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className={`text-xl font-bold ${currentTheme.text}`}>Inspection Coverage</h3>
//               </div>
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie 
//                     data={inspectedPieData} 
//                     dataKey="value" 
//                     nameKey="name" 
//                     cx="50%" 
//                     cy="50%" 
//                     outerRadius={110}
//                     innerRadius={60}
//                     paddingAngle={3}
//                   >
//                     {inspectedPieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={index === 0 ? chartColors.inspected : chartColors.notInspected} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend verticalAlign="bottom" height={36} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
//                   <BarChart3 className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className={`text-xl font-bold ${currentTheme.text}`}>Status Distribution</h3>
//               </div>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={statusBarData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                   <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
//                   <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar dataKey="count" name="Count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Category Analysis */}
//           <div className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}>
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
//                   <Target className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className={`text-xl font-bold ${currentTheme.text}`}>Category Analysis</h3>
//                   <p className={`text-sm ${currentTheme.textSecondary}`}>Snags by category breakdown</p>
//                 </div>
//               </div>
//             </div>
//             {categoryBarData.length ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={categoryBarData}>
//                   <defs>
//                     <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
//                       <stop offset="95%" stopColor="#EC4899" stopOpacity={0.9} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                   <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
//                   <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar dataKey="snags" name="Snags" fill="url(#colorCategory)" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
//                   <span className="text-2xl">📊</span>
//                 </div>
//                 <p className={`${currentTheme.textSecondary} font-medium`}>No category data available</p>
//               </div>
//             )}

//             {/* Multi-submission info cards */}
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={`p-5 rounded-xl border-2 ${palette.border} bg-gradient-to-br from-indigo-50 to-purple-50 ${isDarkMode ? 'from-indigo-900/20 to-purple-900/20' : ''}`}>
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
//                     <Zap className="w-4 h-4 text-white" />
//                   </div>
//                   <div className={`text-sm font-semibold ${currentTheme.textSecondary}`}>Multi-Submission Level</div>
//                 </div>
//                 <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {snagStats?.category_multi_submissions?.level_used ?? "—"}
//                 </div>
//               </div>
//               <div className={`p-5 rounded-xl border-2 ${palette.border} bg-gradient-to-br from-pink-50 to-rose-50 ${isDarkMode ? 'from-pink-900/20 to-rose-900/20' : ''}`}>
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
//                     <CheckCircle className="w-4 h-4 text-white" />
//                   </div>
//                   <div className={`text-sm font-semibold ${currentTheme.textSecondary}`}>Category Totals</div>
//                 </div>
//                 <div className="space-y-2">
//                   {multiTotals.length ? (
//                     multiTotals.slice(0, 3).map((t, i) => (
//                       <div key={i} className="flex items-center justify-between">
//                         <span className={`text-sm font-medium ${currentTheme.text}`}>Cat {t.category_id}</span>
//                         <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{t.count}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <div className={`text-sm ${currentTheme.textSecondary}`}>No data</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stage Status Grid - Enhanced */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             {[
//               { title: "Inspector Stage", data: inspectorStageData, gradient: 'from-cyan-500 to-blue-500', icon: '🔍' },
//               { title: "Maker Stage", data: makerStageData, gradient: 'from-orange-500 to-red-500', icon: '🔨' },
//               { title: "Supervisor Stage", data: supervisorStageData, gradient: 'from-green-500 to-emerald-500', icon: '👁️' },
//             ].map((blk, i) => (
//               <div key={i} className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}>
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className={`p-3 rounded-xl bg-gradient-to-br ${blk.gradient} shadow-lg`}>
//                     <span className="text-xl">{blk.icon}</span>
//                   </div>
//                   <div>
//                     <h3 className={`text-lg font-bold ${currentTheme.text}`}>{blk.title}</h3>
//                     <p className={`text-xs ${currentTheme.textSecondary}`}>Unit status tracking</p>
//                   </div>
//                 </div>
//                 {blk.data.length ? (
//                   <ResponsiveContainer width="100%" height={260}>
//                     <BarChart data={blk.data}>
//                       <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
//                       <XAxis dataKey="stage" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={11} />
//                       <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={11} />
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend wrapperStyle={{ fontSize: '11px' }} />
//                       <Bar dataKey="pending" stackId="a" name="Pending" fill={chartColors.pending} radius={[4, 4, 0, 0]} />
//                       <Bar dataKey="work_in_progress" stackId="a" name="WIP" fill={chartColors.wip} />
//                       <Bar dataKey="completed" stackId="a" name="Done" fill={chartColors.completed} radius={[4, 4, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2">
//                       <span className="text-xl">📈</span>
//                     </div>
//                     <p className={`text-sm ${currentTheme.textSecondary}`}>No stage data</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* KPIs Grid - Enhanced */}
//           <div className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
//                 <Activity className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h3 className={`text-xl font-bold ${currentTheme.text}`}>Checklist KPIs</h3>
//                 <p className={`text-sm ${currentTheme.textSecondary}`}>Key performance indicators</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {kpiEntries.length ? (
//                 kpiEntries.map((k, i) => (
//                   <div key={i} className={`p-5 rounded-xl border-2 ${palette.border} ${currentTheme.hover} transition-all duration-200 bg-gradient-to-br ${i % 4 === 0 ? 'from-blue-50 to-cyan-50' : i % 4 === 1 ? 'from-purple-50 to-pink-50' : i % 4 === 2 ? 'from-green-50 to-emerald-50' : 'from-orange-50 to-red-50'} ${isDarkMode ? 'from-slate-800/50 to-slate-700/50' : ''}`}>
//                     <div className={`text-xs font-semibold ${currentTheme.textSecondary} mb-2 uppercase tracking-wide`}>{k.label}</div>
//                     <div className={`text-2xl font-black ${currentTheme.text}`}>{k.value}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className={`col-span-full text-center py-8 ${currentTheme.textSecondary}`}>No KPI data available</div>
//               )}
//             </div>
//           </div>

//           {/* Units Progress - Enhanced */}
//           <div className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//                 <Target className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h3 className={`text-xl font-bold ${currentTheme.text}`}>Units Progress</h3>
//                 <p className={`text-sm ${currentTheme.textSecondary}`}>Lifecycle tracking</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 { key: 'raised_by_inspector', label: 'Raised by Inspector', gradient: 'from-blue-500 to-cyan-500', icon: '🔍' },
//                 { key: 'verification_completed', label: 'Verification Done', gradient: 'from-green-500 to-emerald-500', icon: '✓' },
//                 { key: 'handover_given', label: 'Handover Given', gradient: 'from-purple-500 to-pink-500', icon: '🎉' }
//               ].map((item, idx) => (
//                 <div key={idx} className={`p-6 rounded-xl border-2 ${palette.border} bg-gradient-to-br ${isDarkMode ? 'from-slate-800/50 to-slate-700/50' : 'from-white to-gray-50'} hover:shadow-lg transition-all duration-300`}>
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className={`p-3 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg`}>
//                       <span className="text-xl">{item.icon}</span>
//                     </div>
//                     <div className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}>{item.label}</div>
//                   </div>
//                   <div className={`text-4xl font-black ${currentTheme.text}`}>{snagStats?.units_progress?.[item.key] ?? 0}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Multi-submission Users - Enhanced */}
//           {multiItemsByUser.length > 0 && (
//             <div className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
//                   <Users className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className={`text-xl font-bold ${currentTheme.text}`}>Multi-Submission by User</h3>
//                   <p className={`text-sm ${currentTheme.textSecondary}`}>User contribution tracking</p>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className={`border-b-2 ${palette.border}`}>
//                       <th className={`py-3 px-4 text-left text-sm font-bold ${currentTheme.text}`}>User ID</th>
//                       <th className={`py-3 px-4 text-right text-sm font-bold ${currentTheme.text}`}>Items Count</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {multiItemsByUser.map((u, i) => (
//                       <tr key={i} className={`border-b ${palette.border} hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${isDarkMode ? 'hover:from-indigo-900/20 hover:to-purple-900/20' : ''} transition-colors`}>
//                         <td className={`py-3 px-4 ${currentTheme.text} font-medium`}>User #{u.user_id}</td>
//                         <td className="py-3 px-4 text-right">
//                           <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg text-sm">
//                             {u.items_count}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ===== Role Dashboards ===== */}
//         {!dashboardData ? (
//           <div className={`text-center py-12 ${palette.card} rounded-xl ${palette.shadow} mt-8`}>
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>No Dashboard Data Available</h3>
//             <p className={`${currentTheme.textSecondary}`}>Unable to load dashboard information.</p>
//           </div>
//         ) : (
//           <>
//             {dashboardData.role === "MANAGER" && renderManagerDashboard(dashboardData)}
//             {dashboardData.role === "SUPER_ADMIN" && renderSuperAdminDashboard(dashboardData)}
//             {dashboardData.role === "CLIENT" && renderClientDashboard(dashboardData)}
//             {dashboardData.role === "USER" && renderUserDashboard(dashboardData)}
//           </>
//         )}

//         {/* Enhanced Refresh Button */}
//         <div className="mt-12 text-center">
//           <button
//             onClick={() => {
//               fetchDashboardData();
//               fetchSnagStats();
//             }}
//             disabled={loading || snagLoading}
//             className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
//           >
//             {(loading || snagLoading) ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span className="text-lg">Refreshing Dashboard...</span>
//               </>
//             ) : (
//               <>
//                 <RefreshCw className="w-5 h-5" />
//                 <span className="text-lg">Refresh All Data</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

// // src/pages/UserDashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { showToast } from "../utils/toast";
// import { getUserDashboard, getSnagStats, resolveActiveProjectId } from "../api";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Activity,
//   Target,
//   Zap,
//   Download,
//   Filter,
//   RefreshCw,
//   Building,
//   Building2,
//   Factory,
// } from "lucide-react";

// const UserDashboard = () => {
//   // ---------------- Theme ----------------
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const theme = {
//     light: {
//       bg: "#f7f8fa",
//       card: "bg-white",
//       text: "text-gray-900",
//       textSecondary: "text-gray-600",
//       border: "border-gray-200",
//       hover: "hover:bg-gray-50",
//       gradient: "bg-gradient-to-br from-purple-100 to-blue-100",
//     },
//     dark: {
//       bg: "#0f172a",
//       card: "bg-slate-800",
//       text: "text-white",
//       textSecondary: "text-slate-300",
//       border: "border-slate-700",
//       hover: "hover:bg-slate-700",
//       gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
//     },
//   };
//   const currentTheme = isDarkMode ? theme.dark : theme.light;
//   const palette = {
//     bg: currentTheme.bg,
//     card: currentTheme.card,
//     text: currentTheme.text,
//     border: currentTheme.border,
//     hover: currentTheme.hover,
//     shadow: "shadow-xl",
//     gradient: currentTheme.gradient,
//     managerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
//     clientGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     adminGradient: "bg-gradient-to-r from-red-500 to-pink-500",
//     supervisorGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
//     makerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     checkerGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
//   };

//   // -------------- Core State --------------
//   const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // -------------- Snag Stats --------------
//   const [snagStats, setSnagStats] = useState(null);
//   const [snagLoading, setSnagLoading] = useState(false);

//   // -------------- Fetchers --------------
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       // NOTE: getUserDashboard ko api.js me time_range handle karne ke liye update karna hai
//       const res = await getUserDashboard(selectedTimeRange);
//       if (res?.status === 200) {
//         setDashboardData(res.data.dashboard);
//         setUserId(res.data.user_id);
//       } else {
//         showToast("Failed to fetch dashboard data", "error");
//       }
//     } catch (e) {
//       console.error(e);
//       showToast(`Error loading dashboard: ${e.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnagStats = async () => {
//     const pid = resolveActiveProjectId();
//     if (!pid) {
//       setSnagStats(null);
//       return;
//     }
//     try {
//       setSnagLoading(true);
//       // getSnagStats(project_id, extraParams) – second param object hi dena hai
//       const { data } = await getSnagStats(pid, { time_range: selectedTimeRange });
//       setSnagStats(data);
//     } catch (e) {
//       console.error("getSnagStats error:", e);
//       showToast("Failed to load snag statistics", "error");
//     } finally {
//       setSnagLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     fetchSnagStats();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedTimeRange]);

//   // -------------- Reusable UI --------------
//   const KPICard = ({
//     title,
//     value,
//     trend,
//     icon: Icon,
//     color,
//     suffix = "",
//     description,
//   }) => (
//     <div
//       className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-3">
//             <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className={`font-semibold ${currentTheme.text}`}>{title}</h3>
//               {description && (
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>{description}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-end gap-3">
//             <span className={`text-3xl font-bold ${currentTheme.text}`}>
//               {typeof value === "number" ? value.toLocaleString() : value}
//               {suffix}
//             </span>
//             {typeof trend === "number" && (
//               <div
//                 className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
//                   trend > 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
//                 }`}
//               >
//                 {trend > 0 ? (
//                   <TrendingUp className="w-4 h-4" />
//                 ) : (
//                   <TrendingDown className="w-4 h-4" />
//                 )}
//                 <span className="font-medium">{Math.abs(trend)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload?.length) {
//       return (
//         <div
//           className={`${palette.card} p-4 rounded-lg shadow-lg border ${palette.border} backdrop-blur-sm`}
//         >
//           <p className={`font-medium ${currentTheme.text} mb-2`}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               <span className="font-medium">{entry.name}:</span> {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // -------------- Helpers --------------
//   const pct = (n) => (n == null ? "0.0" : Number(n).toFixed(1));

//   const generateTimeSeriesData = (data, role) => {
//     const days =
//       selectedTimeRange === "1d"
//         ? 1
//         : selectedTimeRange === "7d"
//         ? 7
//         : selectedTimeRange === "30d"
//         ? 30
//         : 90;

//     return Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));

//       let tasks = 0,
//         completed = 0,
//         pending = 0;

//       if (role === "SUPER_ADMIN") {
//         const baseChecklists = data?.total_checklists || 0;
//         tasks = Math.floor(
//           (baseChecklists * (0.7 + Math.random() * 0.4)) / days
//         );
//         completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "USER" && data?.projects_roles_analytics) {
//         data.projects_roles_analytics.forEach((item) => {
//           if (item.analytics && !item.analytics.error) {
//             Object.values(item.analytics).forEach((val) => {
//               if (typeof val === "number") {
//                 tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
//               }
//             });
//           }
//         });
//         completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "CLIENT") {
//         const baseProjects = data?.created_project_count || 0;
//         tasks = Math.floor(
//           baseProjects * 5 * (0.8 + Math.random() * 0.4)
//         );
//         completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
//         pending = Math.max(0, tasks - completed);
//       } else {
//         tasks = Math.floor(
//           ((data?.organizations_created || 1) *
//             3 *
//             (0.8 + Math.random() * 0.4))
//         );
//         completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       }

//       return {
//         date: `${date.getMonth() + 1}/${date.getDate()}`,
//         tasks: Math.max(0, tasks),
//         completed: Math.max(0, completed),
//         pending: Math.max(0, pending),
//       };
//     });
//   };

//   const generateRoleDistribution = (data, role) => {
//     if (role === "SUPER_ADMIN") {
//       const totalMakers = data?.total_makers || 0;
//       const totalCheckers = data?.total_checkers || 0;
//       const totalUsers = data?.total_users || 1;
//       const supervisors = Math.floor(totalUsers * 0.1);
//       const initializers = Math.floor(totalUsers * 0.05);
//       return [
//         { name: "Makers", value: totalMakers, color: "#8B5CF6" },
//         { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
//         { name: "Supervisors", value: supervisors, color: "#10B981" },
//         { name: "Initializers", value: initializers, color: "#F59E0B" },
//       ].filter((x) => x.value > 0);
//     } else if (role === "USER" && data?.projects_roles_analytics) {
//       const roleCounts = {};
//       data.projects_roles_analytics.forEach((item) => {
//         roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
//       });
//       const colors = [
//         "#8B5CF6",
//         "#06B6D4",
//         "#10B981",
//         "#F59E0B",
//         "#EF4444",
//       ];
//       return Object.entries(roleCounts).map(([r, count], i) => ({
//         name: r,
//         value: count,
//         color: colors[i % colors.length],
//       }));
//     }
//     return [];
//   };

//   const getRoleIcon = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return "👑";
//       case "CLIENT":
//         return "👤";
//       case "MANAGER":
//       case "SUPERVISOR":
//         return "👥";
//       case "MAKER":
//         return "🔧";
//       case "CHECKER":
//         return "✅";
//       default:
//         return "📋";
//     }
//   };
//   const getRoleGradient = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return palette.adminGradient;
//       case "CLIENT":
//         return palette.clientGradient;
//       case "MANAGER":
//         return palette.managerGradient;
//       case "SUPERVISOR":
//         return palette.supervisorGradient;
//       case "MAKER":
//         return palette.makerGradient;
//       case "CHECKER":
//         return palette.checkerGradient;
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // ----------- Derived Snag Data -----------
//   const inspectedPieData = useMemo(
//     () =>
//       snagStats
//         ? [
//             {
//               name: "Inspected",
//               value: snagStats?.snags_inspected?.count || 0,
//             },
//             {
//               name: "Not Inspected",
//               value: snagStats?.snags_not_inspected?.count || 0,
//             },
//           ]
//         : [],
//     [snagStats]
//   );

//   const statusBarData = useMemo(() => {
//     if (!snagStats?.snags_status) return [];
//     return Object.entries(snagStats.snags_status).map(([k, v]) => ({
//       name: k.replace(/_/g, " "),
//       count: v?.count ?? 0,
//       percent: v?.percent ?? 0,
//     }));
//   }, [snagStats]);

//   const categoryBarData = useMemo(
//     () =>
//       snagStats?.category_wise?.map((c) => ({
//         name: `Cat ${c.category_id}`,
//         snags: c.snags || 0,
//       })) || [],
//     [snagStats]
//   );

//   const toStageStack = (list) =>
//     (list || []).map((s) => ({
//       stage: `S${s.stage_id}`,
//       pending: s.pending || 0,
//       work_in_progress: s.work_in_progress || 0,
//       completed: s.completed || 0,
//     }));

//   const inspectorStageData = useMemo(
//     () => toStageStack(snagStats?.inspector_stage_unit_status),
//     [snagStats]
//   );
//   const makerStageData = useMemo(
//     () => toStageStack(snagStats?.maker_stage_unit_status),
//     [snagStats]
//   );
//   const supervisorStageData = useMemo(
//     () => toStageStack(snagStats?.supervisor_stage_unit_status),
//     [snagStats]
//   );

//   const kpiEntries = useMemo(
//     () =>
//       snagStats
//         ? Object.entries(snagStats.kpis || {}).map(([k, v]) => ({
//             label: k
//               .replace(/_/g, " ")
//               .replace(/\b\w/g, (l) => l.toUpperCase()),
//             value: v == null ? "—" : v,
//           }))
//         : [],
//     [snagStats]
//   );

//   const multiTotals =
//     snagStats?.category_multi_submissions?.totals || [];
//   const multiItemsByUser =
//     snagStats?.multi_submission_items_by_user || [];

//   // -------------- Role Dashboards --------------
//   const renderManagerDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "MANAGER");
//     const kpis = [
//       {
//         title: "Organizations",
//         value: data?.organizations_created || 0,
//         trend: 12.5,
//         icon: Building,
//         color: "from-purple-500 to-purple-600",
//         description: "Created by you",
//       },
//       {
//         title: "Companies",
//         value: data?.companies_created || 0,
//         trend: 8.3,
//         icon: Building2,
//         color: "from-blue-500 to-blue-600",
//         description: "Under management",
//       },
//       {
//         title: "Entities",
//         value: data?.entities_created || 0,
//         trend: 15.7,
//         icon: Factory,
//         color: "from-green-500 to-green-600",
//         description: "Total entities",
//       },
//     ];
//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Manager Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   Organization management and analytics
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {(data?.organizations_created || 0) +
//                   (data?.companies_created || 0) +
//                   (data?.entities_created || 0)}
//               </div>
//               <div
//                 className={`text-sm ${currentTheme.textSecondary}`}
//               >
//                 Total Managed
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Activity Trends
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasks"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={
//                     isDarkMode ? "#374151" : "#E5E7EB"
//                   }
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <YAxis
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasks)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={0.6}
//                   fill="#10B981"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Performance Overview
//             </h3>
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-purple-600 mb-2">
//                   92.5%
//                 </div>
//                 <div
//                   className={`text-sm ${currentTheme.textSecondary} mb-3`}
//                 >
//                   Management Efficiency
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-purple-600 h-3 rounded-full"
//                     style={{ width: "92.5%" }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-green-600 mb-2">
//                   87.3%
//                 </div>
//                 <div
//                   className={`text-sm ${currentTheme.textSecondary} mb-3`}
//                 >
//                   Success Rate
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-green-600 h-3 rounded-full"
//                     style={{ width: "87.3%" }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-blue-600 mb-2">
//                   3.2h
//                 </div>
//                 <div
//                   className={`text-sm ${currentTheme.textSecondary}`}
//                 >
//                   Avg Response Time
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSuperAdminDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(
//       data,
//       "SUPER_ADMIN"
//     );
//     const roleDistribution = generateRoleDistribution(
//       data,
//       "SUPER_ADMIN"
//     );
//     const kpis = [
//       {
//         title: "Total Users",
//         value: data?.total_users || 0,
//         trend: 8.5,
//         icon: Users,
//         color: "from-blue-500 to-blue-600",
//         description: "System wide",
//       },
//       {
//         title: "Active Projects",
//         value: data?.total_projects || 0,
//         trend: 12.3,
//         icon: Target,
//         color: "from-green-500 to-green-600",
//         description: "In progress",
//       },
//       {
//         title: "Total Checklists",
//         value: data?.total_checklists || 0,
//         trend: 15.7,
//         icon: CheckCircle,
//         color: "from-purple-500 to-purple-600",
//         description: "All projects",
//       },
//       {
//         title: "Makers",
//         value: data?.total_makers || 0,
//         trend: 5.2,
//         icon: Activity,
//         color: "from-orange-500 to-orange-600",
//         description: "Active makers",
//       },
//       {
//         title: "Checkers",
//         value: data?.total_checkers || 0,
//         trend: 7.8,
//         icon: Zap,
//         color: "from-red-500 to-red-600",
//         description: "Quality control",
//       },
//       {
//         title: "Efficiency",
//         value: "94.2",
//         trend: 3.1,
//         icon: BarChart3,
//         color: "from-indigo-500 to-indigo-600",
//         suffix: "%",
//         description: "Overall system",
//       },
//     ];
//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Super Admin Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   System-wide analytics and management
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">
//                   98.5%
//                 </div>
//                 <div
//                   className={`text-xs ${currentTheme.textSecondary}`}
//                 >
//                   Uptime
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {data?.total_users || 0}
//                 </div>
//                 <div
//                   className={`text-xs ${currentTheme.textSecondary}`}
//                 >
//                   Online
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div
//             className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h3
//                 className={`text-xl font-bold ${currentTheme.text}`}
//               >
//                 System Activity
//               </h3>
//               <div className="flex gap-2 text-sm">
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>{" "}
//                   Tasks
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>{" "}
//                   Completed
//                 </span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasksAdmin"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                   <linearGradient
//                     id="colorCompletedAdmin"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#10B981"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#10B981"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={
//                     isDarkMode ? "#374151" : "#E5E7EB"
//                   }
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <YAxis
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasksAdmin)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorCompletedAdmin)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Team Distribution
//             </h3>
//             {roleDistribution.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={roleDistribution}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {roleDistribution.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         ></div>
//                         <span
//                           className={`text-sm ${currentTheme.textSecondary}`}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${currentTheme.text}`}
//                       >
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <div className={`text-gray-400 text-sm`}>
//                   No team data available
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderClientDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "CLIENT");
//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Client Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   Your projects and performance overview
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-blue-600">
//                 {data?.created_project_count || 0}
//               </div>
//               <div
//                 className={`text-sm ${currentTheme.textSecondary}`}
//               >
//                 Active Projects
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <KPICard
//             title="Projects Created"
//             value={data?.created_project_count || 0}
//             trend={15.2}
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//             description="Total projects"
//           />
//           <KPICard
//             title="Success Rate"
//             value="94.2"
//             trend={5.8}
//             icon={CheckCircle}
//             color="from-green-500 to-green-600"
//             suffix="%"
//             description="Project completion"
//           />
//           <KPICard
//             title="Avg Duration"
//             value="2.4"
//             trend={-8.3}
//             icon={Clock}
//             color="from-purple-500 to-purple-600"
//             suffix="mo"
//             description="Per project"
//           />
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Project Activity
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasksClient"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#06B6D4"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#06B6D4"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={
//                     isDarkMode ? "#374151" : "#E5E7EB"
//                   }
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <YAxis
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#06B6D4"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasksClient)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={0.6}
//                   fill="#10B981"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Recent Projects
//             </h3>
//             <div className="space-y-4">
//               {data?.created_projects?.length ? (
//                 data.created_projects.slice(0, 5).map(
//                   (project, index) => (
//                     <div
//                       key={index}
//                       className={`flex items-center gap-4 p-3 rounded-lg ${currentTheme.hover} transition-colors border ${palette.border}`}
//                     >
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
//                         🏗️
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p
//                               className={`font-medium ${currentTheme.text}`}
//                             >
//                               {project.name ||
//                                 `Project ${project.id}`}
//                             </p>
//                             <p
//                               className={`text-sm ${currentTheme.textSecondary}`}
//                             >
//                               Created by you • Active
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
//                               Active
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )
//               ) : (
//                 <div className="text-center py-8">
//                   <div className={`text-gray-400 text-sm`}>
//                     No projects created yet
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderUserDashboard = (data) => {
//     const rolesData = data?.projects_roles_analytics || [];
//     const timeSeriesData = generateTimeSeriesData(data, "USER");
//     const roleDistribution = generateRoleDistribution(
//       data,
//       "USER"
//     );

//     const groupedData = rolesData.reduce((acc, item) => {
//       const projectId = item.project_id;
//       if (!acc[projectId]) acc[projectId] = {};
//       acc[projectId][item.role] = item.analytics;
//       return acc;
//     }, {});
//     let totalTasks = 0;
//     let totalAssigned = 0;
//     rolesData.forEach((item) => {
//       if (item.analytics && !item.analytics.error) {
//         Object.entries(item.analytics).forEach(
//           ([key, value]) => {
//             if (typeof value === "number") {
//               totalTasks += value;
//               if (
//                 key.includes("assigned") ||
//                 key.includes("pending_for_me")
//               ) {
//                 totalAssigned += value;
//               }
//             }
//           }
//         );
//       }
//     });

//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${palette.gradient} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 📊
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   User Analytics Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   Your work analytics across all projects and roles
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {Object.keys(groupedData).length}
//               </div>
//               <div
//                 className={`text-sm ${currentTheme.textSecondary}`}
//               >
//                 Active Projects
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KPICard
//             title="Total Tasks"
//             value={totalTasks}
//             trend={8.5}
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//             description="All assigned"
//           />
//           <KPICard
//             title="Assigned to Me"
//             value={totalAssigned}
//             trend={12.3}
//             icon={Users}
//             color="from-green-500 to-green-600"
//             description="Current workload"
//           />
//           <KPICard
//             title="Projects"
//             value={Object.keys(groupedData).length}
//             trend={5.7}
//             icon={BarChart3}
//             color="from-purple-500 to-purple-600"
//             description="Active projects"
//           />
//           <KPICard
//             title="Efficiency"
//             value={
//               totalTasks > 0
//                 ? Math.round(
//                     (totalAssigned / totalTasks) * 100
//                   )
//                 : 0
//             }
//             trend={3.2}
//             icon={Zap}
//             color="from-orange-500 to-orange-600"
//             suffix="%"
//             description="Task completion"
//           />
//         </div>

//         {rolesData.length > 0 && (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div
//               className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//             >
//               <h3
//                 className={`text-xl font-bold ${currentTheme.text} mb-6`}
//               >
//                 Activity Timeline
//               </h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSeriesData}>
//                   <defs>
//                     <linearGradient
//                       id="colorTasksUser"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor="#8B5CF6"
//                         stopOpacity={0.3}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor="#8B5CF6"
//                         stopOpacity={0}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={
//                       isDarkMode ? "#374151" : "#E5E7EB"
//                     }
//                   />
//                   <XAxis
//                     dataKey="date"
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                   />
//                   <YAxis
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone"
//                     dataKey="tasks"
//                     stroke="#8B5CF6"
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#colorTasksUser)"
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="completed"
//                     stroke="#10B981"
//                     strokeWidth={2}
//                     fillOpacity={0.6}
//                     fill="#10B981"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {roleDistribution.length > 0 && (
//               <div
//                 className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//               >
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text} mb-6`}
//                 >
//                   My Roles
//                 </h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={roleDistribution}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={50}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {roleDistribution.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         ></div>
//                         <span
//                           className={`text-sm ${currentTheme.textSecondary}`}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${currentTheme.text}`}
//                       >
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {Object.keys(groupedData).length === 0 ? (
//           <div
//             className={`text-center py-12 ${palette.card} rounded-lg ${palette.shadow}`}
//           >
//             <div
//               className={`w-16 h-16 ${palette.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4`}
//             >
//               📈
//             </div>
//             <h3
//               className={`text-lg font-semibold ${currentTheme.text} mb-2`}
//             >
//               No Analytics Data Available
//             </h3>
//             <p className={`${currentTheme.textSecondary}`}>
//               You don't have any active role assignments yet.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {Object.entries(groupedData).map(
//               ([projectId, roles]) => (
//                 <div key={projectId} className="space-y-4">
//                   <div
//                     className={`p-4 rounded-lg ${palette.gradient} border ${palette.border}`}
//                   >
//                     <h2
//                       className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}
//                     >
//                       🏗️ Project {projectId}
//                       <span className="text-sm font-normal px-3 py-1 rounded-full bg-white bg-opacity-20 text-white">
//                         {Object.keys(roles).length} role
//                         {Object.keys(roles).length !== 1
//                           ? "s"
//                           : ""}
//                       </span>
//                     </h2>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {Object.entries(roles).map(
//                       ([role, analytics]) => {
//                         const metrics = Object.entries(
//                           analytics || {}
//                         ).map(
//                           ([key, value]) => ({
//                             label: key
//                               .replace(/_/g, " ")
//                               .replace(
//                                 /\b\w/g,
//                                 (l) => l.toUpperCase()
//                               ),
//                             value: value || 0,
//                             key,
//                           })
//                         );
//                         return (
//                           <div
//                             key={role}
//                             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} transform hover:scale-105 transition-all duration-300`}
//                           >
//                             <div className="flex items-center gap-3 mb-4">
//                               <div
//                                 className={`w-12 h-12 ${getRoleGradient(
//                                   role
//                                 )} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}
//                               >
//                                 {getRoleIcon(role)}
//                               </div>
//                               <div>
//                                 <h3
//                                   className={`text-lg font-bold ${currentTheme.text}`}
//                                 >
//                                   {role.toUpperCase()}
//                                 </h3>
//                                 <p
//                                   className={`text-sm ${currentTheme.textSecondary}`}
//                                 >
//                                   Role Analytics
//                                 </p>
//                               </div>
//                             </div>

//                             <div className="grid grid-cols-1 gap-3">
//                               {analytics &&
//                               !analytics.error ? (
//                                 metrics.map((m) => (
//                                   <div
//                                     key={m.key}
//                                     className={`p-3 rounded-lg ${currentTheme.gradient} border ${palette.border}`}
//                                   >
//                                     <div className="flex items-center justify-between">
//                                       <span
//                                         className={`text-sm ${currentTheme.textSecondary}`}
//                                       >
//                                         {m.label}
//                                       </span>
//                                       <span className="text-xl font-bold text-purple-600">
//                                         {m.value}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <span className="text-red-500 text-sm">
//                                     {analytics?.error ||
//                                       "No data available"}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // -------------- Loader --------------
//   if (loading) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center transition-colors duration-300"
//         style={{ background: palette.bg }}
//       >
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//           <p
//             className={`mt-4 text-lg font-medium ${currentTheme.text}`}
//           >
//             Loading Analytics...
//           </p>
//           <p
//             className={`${currentTheme.textSecondary} text-sm`}
//           >
//             Preparing your insights
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Enhanced color palette for snag stats
//   const snagColors = {
//     raised: {
//       gradient:
//         "from-violet-500 via-purple-500 to-fuchsia-500",
//       bg: isDarkMode
//         ? "from-violet-900/20 via-purple-900/20 to-fuchsia-900/20"
//         : "from-violet-50 via-purple-50 to-fuchsia-50",
//       text: isDarkMode ? "text-violet-400" : "text-violet-700",
//       value: isDarkMode ? "text-violet-300" : "text-violet-600",
//       icon: "🚀",
//     },
//     inspected: {
//       gradient:
//         "from-emerald-500 via-teal-500 to-cyan-500",
//       bg: isDarkMode
//         ? "from-emerald-900/20 via-teal-900/20 to-cyan-900/20"
//         : "from-emerald-50 via-teal-50 to-cyan-50",
//       text: isDarkMode ? "text-emerald-400" : "text-emerald-700",
//       value: isDarkMode ? "text-emerald-300" : "text-emerald-600",
//       icon: "✓",
//     },
//     notInspected: {
//       gradient:
//         "from-amber-500 via-orange-500 to-red-400",
//       bg: isDarkMode
//         ? "from-amber-900/20 via-orange-900/20 to-red-900/20"
//         : "from-amber-50 via-orange-50 to-red-50",
//       text: isDarkMode ? "text-amber-400" : "text-amber-700",
//       value: isDarkMode ? "text-amber-300" : "text-amber-600",
//       icon: "⏳",
//     },
//     progress: {
//       gradient:
//         "from-blue-500 via-indigo-500 to-purple-500",
//       bg: isDarkMode
//         ? "from-blue-900/20 via-indigo-900/20 to-purple-900/20"
//         : "from-blue-50 via-indigo-50 to-purple-50",
//       text: isDarkMode ? "text-blue-400" : "text-blue-700",
//       value: isDarkMode ? "text-blue-300" : "text-blue-600",
//       icon: "📊",
//     },
//   };

//   const chartColors = {
//     inspected: "#10B981",
//     notInspected: "#F59E0B",
//     pending: "#EF4444",
//     wip: "#F59E0B",
//     completed: "#10B981",
//     categories: [
//       "#8B5CF6",
//       "#06B6D4",
//       "#10B981",
//       "#F59E0B",
//       "#EF4444",
//       "#EC4899",
//       "#6366F1",
//     ],
//   };

//   // -------------- Render --------------
//   return (
//     <div
//       className="min-h-screen transition-colors duration-300"
//       style={{ background: palette.bg }}
//     >
//       {/* Header */}
//       <div
//         className={`${palette.card} border-b ${palette.border} px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}
//       >
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1
//                   className={`text-2xl font-bold ${currentTheme.text}`}
//                 >
//                   Analytics Dashboard
//                 </h1>
//                 <p
//                   className={`${currentTheme.textSecondary} text-sm`}
//                 >
//                   Real-time insights and performance metrics
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <select
//               value={selectedTimeRange}
//               onChange={(e) =>
//                 setSelectedTimeRange(e.target.value)
//               }
//               className={`px-4 py-2 rounded-lg border ${palette.border} ${palette.card} ${currentTheme.text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
//             >
//               <option value="1d">Last 24 hours</option>
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 3 months</option>
//             </select>

//             <button
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <Download className="w-5 h-5" />
//             </button>
//             <button
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <Filter className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => {
//                 fetchDashboardData();
//                 fetchSnagStats();
//               }}
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <RefreshCw className="w-5 h-5" />
//             </button>

//             <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               {isDarkMode ? "☀️" : "🌙"}
//             </button>

//             {userId && (
//               <div className="px-3 py-1 rounded-full bg-purple-100 border border-purple-200">
//                 <span className="text-sm font-medium text-purple-800">
//                   ID: {userId}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* ===== Enhanced Snag Stats Section ===== */}
//         <div className="space-y-8 mb-12">
//           {/* Header Card */}
//           <div
//             className={`${palette.card} rounded-2xl p-8 border ${palette.border} ${palette.shadow} bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-2xl transform rotate-3">
//                     <span className="text-3xl">🎯</span>
//                   </div>
//                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
//                 </div>
//                 <div>
//                   <h2
//                     className={`text-3xl font-bold ${currentTheme.text} mb-1`}
//                   >
//                     Snag Analytics Hub
//                   </h2>
//                   <p
//                     className={`${currentTheme.textSecondary} text-base flex items-center gap-2`}
//                   >
//                     <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
//                     Project {snagStats?.project_id ?? "—"} • Live
//                     Monitoring
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={fetchSnagStats}
//                 disabled={snagLoading}
//                 className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 ${
//                     snagLoading ? "animate-spin" : ""
//                   }`}
//                 />
//                 {snagLoading ? "Syncing..." : "Refresh Stats"}
//               </button>
//             </div>
//           </div>

//           {/* Enhanced KPI Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Snags Raised */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.raised.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.raised.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.raised.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.raised.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-4xl font-black ${snagColors.raised.value}`}
//                     >
//                       {snagStats?.snags_raised ?? 0}
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.raised.text} mb-1`}
//                 >
//                   Snags Raised
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Total snags identified
//                 </p>
//               </div>
//             </div>

//             {/* Inspected */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.inspected.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.inspected.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.inspected.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.inspected.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-3xl font-black ${snagColors.inspected.value}`}
//                     >
//                       {snagStats?.snags_inspected?.count ?? 0}
//                     </div>
//                     <div
//                       className={`text-sm font-bold ${snagColors.inspected.text} mt-1`}
//                     >
//                       {pct(
//                         snagStats?.snags_inspected?.percent
//                       )}
//                       %
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.inspected.text} mb-1`}
//                 >
//                   Inspected
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Mode:{" "}
//                   {snagStats?.snags_inspected?.mode ?? "—"}
//                 </p>
//               </div>
//             </div>

//             {/* Not Inspected */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.notInspected.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.notInspected.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.notInspected.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.notInspected.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-3xl font-black ${snagColors.notInspected.value}`}
//                     >
//                       {snagStats?.snags_not_inspected?.count ??
//                         0}
//                     </div>
//                     <div
//                       className={`text-sm font-bold ${snagColors.notInspected.text} mt-1`}
//                     >
//                       {pct(
//                         snagStats?.snags_not_inspected
//                           ?.percent
//                       )}
//                       %
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.notInspected.text} mb-1`}
//                 >
//                   Pending Review
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Awaiting inspection
//                 </p>
//               </div>
//             </div>

//             {/* Units Progress */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.progress.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.progress.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.progress.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.progress.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-4xl font-black ${snagColors.progress.value}`}
//                     >
//                       {snagStats?.units_progress
//                         ?.verification_completed ?? 0}
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.progress.text} mb-1`}
//                 >
//                   Units Verified
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Verification completed
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Charts: Enhanced Pie + Status */}
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//                   <Activity className="w-5 h-5 text-white" />
//                 </div>
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text}`}
//                 >
//                   Inspection Coverage
//                 </h3>
//               </div>
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie
//                     data={inspectedPieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     innerRadius={60}
//                     paddingAngle={3}
//                   >
//                     {inspectedPieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={
//                           index === 0
//                             ? chartColors.inspected
//                             : chartColors.notInspected
//                         }
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend
//                     verticalAlign="bottom"
//                     height={36}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
//                   <BarChart3 className="w-5 h-5 text-white" />
//                 </div>
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text}`}
//                 >
//                   Status Distribution
//                 </h3>
//               </div>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={statusBarData}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={
//                       isDarkMode ? "#374151" : "#E5E7EB"
//                     }
//                   />
//                   <XAxis
//                     dataKey="name"
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <YAxis
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar
//                     dataKey="count"
//                     name="Count"
//                     fill="#8B5CF6"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Category Analysis */}
//           <div
//             className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
//                   <Target className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3
//                     className={`text-xl font-bold ${currentTheme.text}`}
//                   >
//                     Category Analysis
//                   </h3>
//                   <p
//                     className={`text-sm ${currentTheme.textSecondary}`}
//                   >
//                     Snags by category breakdown
//                   </p>
//                 </div>
//               </div>
//             </div>
//             {categoryBarData.length ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={categoryBarData}>
//                   <defs>
//                     <linearGradient
//                       id="colorCategory"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor="#8B5CF6"
//                         stopOpacity={0.9}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor="#EC4899"
//                         stopOpacity={0.9}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={
//                       isDarkMode ? "#374151" : "#E5E7EB"
//                     }
//                   />
//                   <XAxis
//                     dataKey="name"
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <YAxis
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar
//                     dataKey="snags"
//                     name="Snags"
//                     fill="url(#colorCategory)"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
//                   <span className="text-2xl">📊</span>
//                 </div>
//                 <p
//                   className={`${currentTheme.textSecondary} font-medium`}
//                 >
//                   No category data available
//                 </p>
//               </div>
//             )}

//             {/* Multi-submission info cards */}
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div
//                 className={`p-5 rounded-xl border-2 ${palette.border} bg-gradient-to-br from-indigo-50 to-purple-50 ${
//                   isDarkMode
//                     ? "from-indigo-900/20 to-purple-900/20"
//                     : ""
//                 }`}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
//                     <Zap className="w-4 h-4 text-white" />
//                   </div>
//                   <div
//                     className={`text-sm font-semibold ${currentTheme.textSecondary}`}
//                   >
//                     Multi-Submission Level
//                   </div>
//                 </div>
//                 <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {snagStats?.category_multi_submissions
//                     ?.level_used ?? "—"}
//                 </div>
//               </div>
//               <div
//                 className={`p-5 rounded-xl border-2 ${palette.border} bg-gradient-to-br from-pink-50 to-rose-50 ${
//                   isDarkMode
//                     ? "from-pink-900/20 to-rose-900/20"
//                     : ""
//                 }`}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
//                     <CheckCircle className="w-4 h-4 text-white" />
//                   </div>
//                   <div
//                     className={`text-sm font-semibold ${currentTheme.textSecondary}`}
//                   >
//                     Category Totals
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   {multiTotals.length ? (
//                     multiTotals.slice(0, 3).map((t, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center justify-between"
//                       >
//                         <span
//                           className={`text-sm font-medium ${currentTheme.text}`}
//                         >
//                           Cat {t.category_id}
//                         </span>
//                         <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
//                           {t.count}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <div
//                       className={`text-sm ${currentTheme.textSecondary}`}
//                     >
//                       No data
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stage Status Grid - Enhanced */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Inspector Stage",
//                 data: inspectorStageData,
//                 gradient: "from-cyan-500 to-blue-500",
//                 icon: "🔍",
//               },
//               {
//                 title: "Maker Stage",
//                 data: makerStageData,
//                 gradient: "from-orange-500 to-red-500",
//                 icon: "🔨",
//               },
//               {
//                 title: "Supervisor Stage",
//                 data: supervisorStageData,
//                 gradient: "from-green-500 to-emerald-500",
//                 icon: "👁️",
//               },
//             ].map((blk, i) => (
//               <div
//                 key={i}
//                 className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//               >
//                 <div className="flex items-center gap-3 mb-6">
//                   <div
//                     className={`p-3 rounded-xl bg-gradient-to-br ${blk.gradient} shadow-lg`}
//                   >
//                     <span className="text-xl">
//                       {blk.icon}
//                     </span>
//                   </div>
//                   <div>
//                     <h3
//                       className={`text-lg font-bold ${currentTheme.text}`}
//                     >
//                       {blk.title}
//                     </h3>
//                     <p
//                       className={`text-xs ${currentTheme.textSecondary}`}
//                     >
//                       Unit status tracking
//                     </p>
//                   </div>
//                 </div>
//                 {blk.data.length ? (
//                   <ResponsiveContainer width="100%" height={260}>
//                     <BarChart data={blk.data}>
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         stroke={
//                           isDarkMode
//                             ? "#374151"
//                             : "#E5E7EB"
//                         }
//                       />
//                       <XAxis
//                         dataKey="stage"
//                         stroke={
//                           isDarkMode
//                             ? "#9CA3AF"
//                             : "#6B7280"
//                         }
//                         fontSize={11}
//                       />
//                       <YAxis
//                         stroke={
//                           isDarkMode
//                             ? "#9CA3AF"
//                             : "#6B7280"
//                         }
//                         fontSize={11}
//                       />
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend
//                         wrapperStyle={{ fontSize: "11px" }}
//                       />
//                       <Bar
//                         dataKey="pending"
//                         stackId="a"
//                         name="Pending"
//                         fill={chartColors.pending}
//                         radius={[4, 4, 0, 0]}
//                       />
//                       <Bar
//                         dataKey="work_in_progress"
//                         stackId="a"
//                         name="WIP"
//                         fill={chartColors.wip}
//                       />
//                       <Bar
//                         dataKey="completed"
//                         stackId="a"
//                         name="Done"
//                         fill={chartColors.completed}
//                         radius={[4, 4, 0, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2">
//                       <span className="text-xl">📈</span>
//                     </div>
//                     <p
//                       className={`text-sm ${currentTheme.textSecondary}`}
//                     >
//                       No stage data
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* KPIs Grid - Enhanced */}
//           <div
//             className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
//                 <Activity className="w-5 h-5 text-white" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {kpiEntries.length ? (
//                 kpiEntries.map((k, i) => (
//                   <div
//                     key={i}
//                     className={`p-5 rounded-xl border-2 ${palette.border} ${currentTheme.hover} transition-all duration-200 bg-gradient-to-br ${
//                       i % 4 === 0
//                         ? "from-blue-50 to-cyan-50"
//                         : i % 4 === 1
//                         ? "from-purple-50 to-pink-50"
//                         : i % 4 === 2
//                         ? "from-green-50 to-emerald-50"
//                         : "from-orange-50 to-red-50"
//                     } ${
//                       isDarkMode
//                         ? "from-slate-800/50 to-slate-700/50"
//                         : ""
//                     }`}
//                   >
//                     <div
//                       className={`text-xs font-semibold ${currentTheme.textSecondary} mb-2 uppercase tracking-wide`}
//                     >
//                       {k.label}
//                     </div>
//                     <div
//                       className={`text-2xl font-black ${currentTheme.text}`}
//                     >
//                       {k.value}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div
//                   className={`col-span-full text-center py-8 ${currentTheme.textSecondary}`}
//                 >
//                   No KPI data available
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Units Progress - Enhanced */}
//           <div
//             className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//                 <Target className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text}`}
//                 >
//                   Units Progress
//                 </h3>
//                 <p
//                   className={`text-sm ${currentTheme.textSecondary}`}
//                 >
//                   Lifecycle tracking
//                 </p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 {
//                   key: "raised_by_inspector",
//                   label: "Raised by Inspector",
//                   gradient:
//                     "from-blue-500 to-cyan-500",
//                   icon: "🔍",
//                 },
//                 {
//                   key: "verification_completed",
//                   label: "Verification Done",
//                   gradient:
//                     "from-green-500 to-emerald-500",
//                   icon: "✓",
//                 },
//                 {
//                   key: "handover_given",
//                   label: "Handover Given",
//                   gradient:
//                     "from-purple-500 to-pink-500",
//                   icon: "🎉",
//                 },
//               ].map((item, idx) => (
//                 <div
//                   key={idx}
//                   className={`p-6 rounded-xl border-2 ${palette.border} bg-gradient-to-br ${
//                     isDarkMode
//                       ? "from-slate-800/50 to-slate-700/50"
//                       : "from-white to-gray-50"
//                   } hover:shadow-lg transition-all duration-300`}
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <div
//                       className={`p-3 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg`}
//                     >
//                       <span className="text-xl">
//                         {item.icon}
//                       </span>
//                     </div>
//                     <div
//                       className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
//                     >
//                       {item.label}
//                     </div>
//                   </div>
//                   <div
//                     className={`text-4xl font-black ${currentTheme.text}`}
//                   >
//                     {snagStats?.units_progress?.[item.key] ??
//                       0}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Multi-submission Users - Enhanced */}
//           {multiItemsByUser.length > 0 && (
//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
//                   <Users className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3
//                     className={`text-xl font-bold ${currentTheme.text}`}
//                   >
//                     Multi-Submission by User
//                   </h3>
//                   <p
//                     className={`text-sm ${currentTheme.textSecondary}`}
//                   >
//                     User contribution tracking
//                   </p>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr
//                       className={`border-b-2 ${palette.border}`}
//                     >
//                       <th
//                         className={`py-3 px-4 text-left text-sm font-bold ${currentTheme.text}`}
//                       >
//                         User ID
//                       </th>
//                       <th
//                         className={`py-3 px-4 text-right text-sm font-bold ${currentTheme.text}`}
//                       >
//                         Items Count
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {multiItemsByUser.map((u, i) => (
//                       <tr
//                         key={i}
//                         className={`border-b ${palette.border} hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${
//                           isDarkMode
//                             ? "hover:from-indigo-900/20 hover:to-purple-900/20"
//                             : ""
//                         } transition-colors`}
//                       >
//                         <td
//                           className={`py-3 px-4 ${currentTheme.text} font-medium`}
//                         >
//                           User #{u.user_id}
//                         </td>
//                         <td className="py-3 px-4 text-right">
//                           <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg text-sm">
//                             {u.items_count}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ===== Role Dashboards ===== */}
//         {!dashboardData ? (
//           <div
//             className={`text-center py-12 ${palette.card} rounded-xl ${palette.shadow} mt-8`}
//           >
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3
//               className={`text-lg font-semibold ${currentTheme.text} mb-2`}
//             >
//               No Dashboard Data Available
//             </h3>
//             <p className={`${currentTheme.textSecondary}`}>
//               Unable to load dashboard information.
//             </p>
//           </div>
//         ) : (
//           <>
//             {dashboardData.role === "MANAGER" &&
//               renderManagerDashboard(dashboardData)}
//             {dashboardData.role === "SUPER_ADMIN" &&
//               renderSuperAdminDashboard(dashboardData)}
//             {dashboardData.role === "CLIENT" &&
//               renderClientDashboard(dashboardData)}
//             {dashboardData.role === "USER" &&
//               renderUserDashboard(dashboardData)}
//           </>
//         )}

//         {/* Enhanced Refresh Button */}
//         <div className="mt-12 text-center">
//           <button
//             onClick={() => {
//               fetchDashboardData();
//               fetchSnagStats();
//             }}
//             disabled={loading || snagLoading}
//             className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
//           >
//             {loading || snagLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span className="text-lg">
//                   Refreshing Dashboard...
//                 </span>
//               </>
//             ) : (
//               <>
//                 <RefreshCw className="w-5 h-5" />
//                 <span className="text-lg">Refresh All Data</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;




// // src/pages/UserDashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { showToast } from "../utils/toast";
// import {
//   getUserDashboard,
//   getSnagStats,
//   resolveActiveProjectId,
//   getQuestionHotspots, // 👈 ADDED
// } from "../api";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Activity,
//   Target,
//   Zap,
//   Download,
//   Filter,
//   RefreshCw,
//   Building,
//   Building2,
//   Factory,
// } from "lucide-react";

// const UserDashboard = () => {
//   // ---------------- Theme ----------------
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const theme = {
//     light: {
//       bg: "#f7f8fa",
//       card: "bg-white",
//       text: "text-gray-900",
//       textSecondary: "text-gray-600",
//       border: "border-gray-200",
//       hover: "hover:bg-gray-50",
//       gradient: "bg-gradient-to-br from-purple-100 to-blue-100",
//     },
//     dark: {
//       bg: "#0f172a",
//       card: "bg-slate-800",
//       text: "text-white",
//       textSecondary: "text-slate-300",
//       border: "border-slate-700",
//       hover: "hover:bg-slate-700",
//       gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
//     },
//   };
//   const currentTheme = isDarkMode ? theme.dark : theme.light;
//   const palette = {
//     bg: currentTheme.bg,
//     card: currentTheme.card,
//     text: currentTheme.text,
//     border: currentTheme.border,
//     hover: currentTheme.hover,
//     shadow: "shadow-xl",
//     gradient: currentTheme.gradient,
//     managerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
//     clientGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     adminGradient: "bg-gradient-to-r from-red-500 to-pink-500",
//     supervisorGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
//     makerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
//     checkerGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
//   };

//   // -------------- Core State --------------
//   const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // -------------- Snag Stats --------------
//   const [snagStats, setSnagStats] = useState(null);
//   const [snagLoading, setSnagLoading] = useState(false);

//   // -------------- Question Hotspot Stats --------------
//   const [questionStats, setQuestionStats] = useState(null);      // 👈 ADDED
//   const [questionLoading, setQuestionLoading] = useState(false); // 👈 ADDED

//   // -------------- Fetchers --------------
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       // NOTE: getUserDashboard ko api.js me time_range handle karne ke liye update karna hai
//       const res = await getUserDashboard(selectedTimeRange);
//       if (res?.status === 200) {
//         setDashboardData(res.data.dashboard);
//         setUserId(res.data.user_id);
//       } else {
//         showToast("Failed to fetch dashboard data", "error");
//       }
//     } catch (e) {
//       console.error(e);
//       showToast(`Error loading dashboard: ${e.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnagStats = async () => {
//     const pid = resolveActiveProjectId();
//     if (!pid) {
//       setSnagStats(null);
//       return;
//     }
//     try {
//       setSnagLoading(true);
//       // getSnagStats(project_id, extraParams) – second param object hi dena hai
//       const { data } = await getSnagStats(pid, { time_range: selectedTimeRange });
//       setSnagStats(data);
//     } catch (e) {
//       console.error("getSnagStats error:", e);
//       showToast("Failed to load snag statistics", "error");
//     } finally {
//       setSnagLoading(false);
//     }
//   };

//   // 👇 NEW: fetch question hotspots (maker/checker/supervisor counts per question)
//   const fetchQuestionStats = async () => {
//     const pid = resolveActiveProjectId();
//     if (!pid) {
//       setQuestionStats(null);
//       return;
//     }
//     try {
//       setQuestionLoading(true);
//       const { data } = await getQuestionHotspots(pid, {
//         time_range: selectedTimeRange,
//         limit: 50, // thoda zyada le lo, FE pe top 10 dikha denge
//       });
//       setQuestionStats(data);
//     } catch (e) {
//       console.error("getQuestionHotspots error:", e);
//       showToast("Failed to load question hotspot stats", "error");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     fetchSnagStats();
//     fetchQuestionStats(); // 👈 ADDED
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedTimeRange]);

//   // -------------- Reusable UI --------------
//   const KPICard = ({
//     title,
//     value,
//     trend,
//     icon: Icon,
//     color,
//     suffix = "",
//     description,
//   }) => (
//     <div
//       className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-3">
//             <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className={`font-semibold ${currentTheme.text}`}>{title}</h3>
//               {description && (
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>{description}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-end gap-3">
//             <span className={`text-3xl font-bold ${currentTheme.text}`}>
//               {typeof value === "number" ? value.toLocaleString() : value}
//               {suffix}
//             </span>
//             {typeof trend === "number" && (
//               <div
//                 className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
//                   trend > 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
//                 }`}
//               >
//                 {trend > 0 ? (
//                   <TrendingUp className="w-4 h-4" />
//                 ) : (
//                   <TrendingDown className="w-4 h-4" />
//                 )}
//                 <span className="font-medium">{Math.abs(trend)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload?.length) {
//       return (
//         <div
//           className={`${palette.card} p-4 rounded-lg shadow-lg border ${palette.border} backdrop-blur-sm`}
//         >
//           <p className={`font-medium ${currentTheme.text} mb-2`}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               <span className="font-medium">{entry.name}:</span> {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // -------------- Helpers --------------
//   const pct = (n) => (n == null ? "0.0" : Number(n).toFixed(1));

//   const generateTimeSeriesData = (data, role) => {
//     const days =
//       selectedTimeRange === "1d"
//         ? 1
//         : selectedTimeRange === "7d"
//         ? 7
//         : selectedTimeRange === "30d"
//         ? 30
//         : 90;

//     return Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));

//       let tasks = 0,
//         completed = 0,
//         pending = 0;

//       if (role === "SUPER_ADMIN") {
//         const baseChecklists = data?.total_checklists || 0;
//         tasks = Math.floor(
//           (baseChecklists * (0.7 + Math.random() * 0.4)) / days
//         );
//         completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "USER" && data?.projects_roles_analytics) {
//         data.projects_roles_analytics.forEach((item) => {
//           if (item.analytics && !item.analytics.error) {
//             Object.values(item.analytics).forEach((val) => {
//               if (typeof val === "number") {
//                 tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
//               }
//             });
//           }
//         });
//         completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "CLIENT") {
//         const baseProjects = data?.created_project_count || 0;
//         tasks = Math.floor(
//           baseProjects * 5 * (0.8 + Math.random() * 0.4)
//         );
//         completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
//         pending = Math.max(0, tasks - completed);
//       } else {
//         tasks = Math.floor(
//           ((data?.organizations_created || 1) *
//             3 *
//             (0.8 + Math.random() * 0.4))
//         );
//         completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       }

//       return {
//         date: `${date.getMonth() + 1}/${date.getDate()}`,
//         tasks: Math.max(0, tasks),
//         completed: Math.max(0, completed),
//         pending: Math.max(0, pending),
//       };
//     });
//   };

//   const generateRoleDistribution = (data, role) => {
//     if (role === "SUPER_ADMIN") {
//       const totalMakers = data?.total_makers || 0;
//       const totalCheckers = data?.total_checkers || 0;
//       const totalUsers = data?.total_users || 1;
//       const supervisors = Math.floor(totalUsers * 0.1);
//       const initializers = Math.floor(totalUsers * 0.05);
//       return [
//         { name: "Makers", value: totalMakers, color: "#8B5CF6" },
//         { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
//         { name: "Supervisors", value: supervisors, color: "#10B981" },
//         { name: "Initializers", value: initializers, color: "#F59E0B" },
//       ].filter((x) => x.value > 0);
//     } else if (role === "USER" && data?.projects_roles_analytics) {
//       const roleCounts = {};
//       data.projects_roles_analytics.forEach((item) => {
//         roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
//       });
//       const colors = [
//         "#8B5CF6",
//         "#06B6D4",
//         "#10B981",
//         "#F59E0B",
//         "#EF4444",
//         "#EC4899",
//       ];
//       return Object.entries(roleCounts).map(([r, count], i) => ({
//         name: r,
//         value: count,
//         color: colors[i % colors.length],
//       }));
//     }
//     return [];
//   };

//   const getRoleIcon = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return "👑";
//       case "CLIENT":
//         return "👤";
//       case "MANAGER":
//       case "SUPERVISOR":
//         return "👥";
//       case "MAKER":
//         return "🔧";
//       case "CHECKER":
//         return "✅";
//       default:
//         return "📋";
//     }
//   };
//   const getRoleGradient = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         return palette.adminGradient;
//       case "CLIENT":
//         return palette.clientGradient;
//       case "MANAGER":
//         return palette.managerGradient;
//       case "SUPERVISOR":
//         return palette.supervisorGradient;
//       case "MAKER":
//         return palette.makerGradient;
//       case "CHECKER":
//         return palette.checkerGradient;
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // ----------- Derived Snag Data -----------
//   const inspectedPieData = useMemo(
//     () =>
//       snagStats
//         ? [
//             {
//               name: "Inspected",
//               value: snagStats?.snags_inspected?.count || 0,
//             },
//             {
//               name: "Not Inspected",
//               value: snagStats?.snags_not_inspected?.count || 0,
//             },
//           ]
//         : [],
//     [snagStats]
//   );

//   const statusBarData = useMemo(() => {
//     if (!snagStats?.snags_status) return [];
//     return Object.entries(snagStats.snags_status).map(([k, v]) => ({
//       name: k.replace(/_/g, " "),
//       count: v?.count ?? 0,
//       percent: v?.percent ?? 0,
//     }));
//   }, [snagStats]);

//   const categoryBarData = useMemo(
//     () =>
//       snagStats?.category_wise?.map((c) => ({
//         name: `Cat ${c.category_id}`,
//         snags: c.snags || 0,
//       })) || [],
//     [snagStats]
//   );

//   const toStageStack = (list) =>
//     (list || []).map((s) => ({
//       stage: `S${s.stage_id}`,
//       pending: s.pending || 0,
//       work_in_progress: s.work_in_progress || 0,
//       completed: s.completed || 0,
//     }));

//   const inspectorStageData = useMemo(
//     () => toStageStack(snagStats?.inspector_stage_unit_status),
//     [snagStats]
//   );
//   const makerStageData = useMemo(
//     () => toStageStack(snagStats?.maker_stage_unit_status),
//     [snagStats]
//   );
//   const supervisorStageData = useMemo(
//     () => toStageStack(snagStats?.supervisor_stage_unit_status),
//     [snagStats]
//   );

//   const kpiEntries = useMemo(
//     () =>
//       snagStats
//         ? Object.entries(snagStats.kpis || {}).map(([k, v]) => ({
//             label: k
//               .replace(/_/g, " ")
//               .replace(/\b\w/g, (l) => l.toUpperCase()),
//             value: v == null ? "—" : v,
//           }))
//         : [],
//     [snagStats]
//   );

//   const multiTotals =
//     snagStats?.category_multi_submissions?.totals || [];
//   const multiItemsByUser =
//     snagStats?.multi_submission_items_by_user || [];

//   // -------- Question Hotspots aggregation (NEW) --------
//   const aggregatedQuestions = useMemo(() => {
//     if (!questionStats?.question_hotspots?.length) return [];

//     const map = new Map();

//     questionStats.question_hotspots.forEach((q) => {
//       const key = q.question || `Item ${q.item_id}`;

//       if (!map.has(key)) {
//         map.set(key, {
//           question: key,
//           checklist_names: new Set(),
//           total_submissions: 0,
//           attempts: 0,
//           maker_count: 0,
//           checker_count: 0,
//           supervisor_count: 0,
//           flats: new Set(),
//           stages: new Set(),
//         });
//       }

//       const ref = map.get(key);
//       if (q.checklist_name) ref.checklist_names.add(q.checklist_name);

//       ref.total_submissions += q.total_submissions || 0;
//       ref.attempts += q.attempts || 0;
//       ref.maker_count += q.maker_count || 0;
//       ref.checker_count += q.checker_count || 0;
//       ref.supervisor_count += q.supervisor_count || 0;

//       if (q.flat_id) ref.flats.add(q.flat_id);
//       if (q.stage_id) ref.stages.add(q.stage_id);
//     });

//     return Array.from(map.values())
//       .map((x) => ({
//         ...x,
//         checklist_names: Array.from(x.checklist_names).join(", "),
//         distinct_flats: x.flats.size,
//         distinct_stages: x.stages.size,
//       }))
//       .sort((a, b) => b.total_submissions - a.total_submissions)
//       .slice(0, 10); // top 10 questions
//   }, [questionStats]);

//   // -------------- Role Dashboards --------------
//   const renderManagerDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "MANAGER");
//     const kpis = [
//       {
//         title: "Organizations",
//         value: data?.organizations_created || 0,
//         trend: 12.5,
//         icon: Building,
//         color: "from-purple-500 to-purple-600",
//         description: "Created by you",
//       },
//       {
//         title: "Companies",
//         value: data?.companies_created || 0,
//         trend: 8.3,
//         icon: Building2,
//         color: "from-blue-500 to-blue-600",
//         description: "Under management",
//       },
//       {
//         title: "Entities",
//         value: data?.entities_created || 0,
//         trend: 15.7,
//         icon: Factory,
//         color: "from-green-500 to-green-600",
//         description: "Total entities",
//       },
//     ];
//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Manager Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   Organization management and analytics
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {(data?.organizations_created || 0) +
//                   (data?.companies_created || 0) +
//                   (data?.entities_created || 0)}
//               </div>
//               <div
//                 className={`text-sm ${currentTheme.textSecondary}`}
//               >
//                 Total Managed
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Activity Trends
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasks"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={
//                     isDarkMode ? "#374151" : "#E5E7EB"
//                   }
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <YAxis
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasks)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={0.6}
//                   fill="#10B981"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Performance Overview
//             </h3>
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-purple-600 mb-2">
//                   92.5%
//                 </div>
//                 <div
//                   className={`text-sm ${currentTheme.textSecondary} mb-3`}
//                 >
//                   Management Efficiency
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-purple-600 h-3 rounded-full"
//                     style={{ width: "92.5%" }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-green-600 mb-2">
//                   87.3%
//                 </div>
//                 <div
//                   className={`text-sm ${currentTheme.textSecondary} mb-3`}
//                 >
//                   Success Rate
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-green-600 h-3 rounded-full"
//                     style={{ width: "87.3%" }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-blue-600 mb-2">
//                   3.2h
//                 </div>
//                 <div
//                   className={`text-sm ${currentTheme.textSecondary}`}
//                 >
//                   Avg Response Time
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSuperAdminDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(
//       data,
//       "SUPER_ADMIN"
//     );
//     const roleDistribution = generateRoleDistribution(
//       data,
//       "SUPER_ADMIN"
//     );
//     const kpis = [
//       {
//         title: "Total Users",
//         value: data?.total_users || 0,
//         trend: 8.5,
//         icon: Users,
//         color: "from-blue-500 to-blue-600",
//         description: "System wide",
//       },
//       {
//         title: "Active Projects",
//         value: data?.total_projects || 0,
//         trend: 12.3,
//         icon: Target,
//         color: "from-green-500 to-green-600",
//         description: "In progress",
//       },
//       {
//         title: "Total Checklists",
//         value: data?.total_checklists || 0,
//         trend: 15.7,
//         icon: CheckCircle,
//         color: "from-purple-500 to-purple-600",
//         description: "All projects",
//       },
//       {
//         title: "Makers",
//         value: data?.total_makers || 0,
//         trend: 5.2,
//         icon: Activity,
//         color: "from-orange-500 to-orange-600",
//         description: "Active makers",
//       },
//       {
//         title: "Checkers",
//         value: data?.total_checkers || 0,
//         trend: 7.8,
//         icon: Zap,
//         color: "from-red-500 to-red-600",
//         description: "Quality control",
//       },
//       {
//         title: "Efficiency",
//         value: "94.2",
//         trend: 3.1,
//         icon: BarChart3,
//         color: "from-indigo-500 to-indigo-600",
//         suffix: "%",
//         description: "Overall system",
//       },
//     ];
//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Super Admin Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   System-wide analytics and management
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">
//                   98.5%
//                 </div>
//                 <div
//                   className={`text-xs ${currentTheme.textSecondary}`}
//                 >
//                   Uptime
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {data?.total_users || 0}
//                 </div>
//                 <div
//                   className={`text-xs ${currentTheme.textSecondary}`}
//                 >
//                   Online
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//           {kpis.map((k, i) => (
//             <KPICard key={i} {...k} />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div
//             className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h3
//                 className={`text-xl font-bold ${currentTheme.text}`}
//               >
//                 System Activity
//               </h3>
//               <div className="flex gap-2 text-sm">
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>{" "}
//                   Tasks
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>{" "}
//                   Completed
//                 </span>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasksAdmin"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#8B5CF6"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                   <linearGradient
//                     id="colorCompletedAdmin"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#10B981"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#10B981"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={
//                     isDarkMode ? "#374151" : "#E5E7EB"
//                   }
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <YAxis
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasksAdmin)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorCompletedAdmin)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Team Distribution
//             </h3>
//             {roleDistribution.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={roleDistribution}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {roleDistribution.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         ></div>
//                         <span
//                           className={`text-sm ${currentTheme.textSecondary}`}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${currentTheme.text}`}
//                       >
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <div className={`text-gray-400 text-sm`}>
//                   No team data available
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderClientDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "CLIENT");
//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${getRoleGradient(
//                   data.role
//                 )} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 {getRoleIcon(data.role)}
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   Client Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   Your projects and performance overview
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-blue-600">
//                 {data?.created_project_count || 0}
//               </div>
//               <div
//                 className={`text-sm ${currentTheme.textSecondary}`}
//               >
//                 Active Projects
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <KPICard
//             title="Projects Created"
//             value={data?.created_project_count || 0}
//             trend={15.2}
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//             description="Total projects"
//           />
//           <KPICard
//             title="Success Rate"
//             value="94.2"
//             trend={5.8}
//             icon={CheckCircle}
//             color="from-green-500 to-green-600"
//             suffix="%"
//             description="Project completion"
//           />
//           <KPICard
//             title="Avg Duration"
//             value="2.4"
//             trend={-8.3}
//             icon={Clock}
//             color="from-purple-500 to-purple-600"
//             suffix="mo"
//             description="Per project"
//           />
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Project Activity
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient
//                     id="colorTasksClient"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#06B6D4"
//                       stopOpacity={0.3}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="#06B6D4"
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={
//                     isDarkMode ? "#374151" : "#E5E7EB"
//                   }
//                 />
//                 <XAxis
//                   dataKey="date"
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <YAxis
//                   stroke={
//                     isDarkMode ? "#9CA3AF" : "#6B7280"
//                   }
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="tasks"
//                   stroke="#06B6D4"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorTasksClient)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   fillOpacity={0.6}
//                   fill="#10B981"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <h3
//               className={`text-xl font-bold ${currentTheme.text} mb-6`}
//             >
//               Recent Projects
//             </h3>
//             <div className="space-y-4">
//               {data?.created_projects?.length ? (
//                 data.created_projects.slice(0, 5).map(
//                   (project, index) => (
//                     <div
//                       key={index}
//                       className={`flex items-center gap-4 p-3 rounded-lg ${currentTheme.hover} transition-colors border ${palette.border}`}
//                     >
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
//                         🏗️
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p
//                               className={`font-medium ${currentTheme.text}`}
//                             >
//                               {project.name ||
//                                 `Project ${project.id}`}
//                             </p>
//                             <p
//                               className={`text-sm ${currentTheme.textSecondary}`}
//                             >
//                               Created by you • Active
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
//                               Active
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )
//               ) : (
//                 <div className="text-center py-8">
//                   <div className={`text-gray-400 text-sm`}>
//                     No projects created yet
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderUserDashboard = (data) => {
//     const rolesData = data?.projects_roles_analytics || [];
//     const timeSeriesData = generateTimeSeriesData(data, "USER");
//     const roleDistribution = generateRoleDistribution(
//       data,
//       "USER"
//     );

//     const groupedData = rolesData.reduce((acc, item) => {
//       const projectId = item.project_id;
//       if (!acc[projectId]) acc[projectId] = {};
//       acc[projectId][item.role] = item.analytics;
//       return acc;
//     }, {});
//     let totalTasks = 0;
//     let totalAssigned = 0;
//     rolesData.forEach((item) => {
//       if (item.analytics && !item.analytics.error) {
//         Object.entries(item.analytics).forEach(
//           ([key, value]) => {
//             if (typeof value === "number") {
//               totalTasks += value;
//               if (
//                 key.includes("assigned") ||
//                 key.includes("pending_for_me")
//               ) {
//                 totalAssigned += value;
//               }
//             }
//           }
//         );
//       }
//     });

//     return (
//       <div className="space-y-8">
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div
//                 className={`w-16 h-16 ${palette.gradient} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
//               >
//                 📊
//               </div>
//               <div>
//                 <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
//                   User Analytics Dashboard
//                 </h2>
//                 <p
//                   className={`${currentTheme.textSecondary} text-lg`}
//                 >
//                   Your work analytics across all projects and roles
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-purple-600">
//                 {Object.keys(groupedData).length}
//               </div>
//               <div
//                 className={`text-sm ${currentTheme.textSecondary}`}
//               >
//                 Active Projects
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KPICard
//             title="Total Tasks"
//             value={totalTasks}
//             trend={8.5}
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//             description="All assigned"
//           />
//           <KPICard
//             title="Assigned to Me"
//             value={totalAssigned}
//             trend={12.3}
//             icon={Users}
//             color="from-green-500 to-green-600"
//             description="Current workload"
//           />
//           <KPICard
//             title="Projects"
//             value={Object.keys(groupedData).length}
//             trend={5.7}
//             icon={BarChart3}
//             color="from-purple-500 to-purple-600"
//             description="Active projects"
//           />
//           <KPICard
//             title="Efficiency"
//             value={
//               totalTasks > 0
//                 ? Math.round(
//                     (totalAssigned / totalTasks) * 100
//                   )
//                 : 0
//             }
//             trend={3.2}
//             icon={Zap}
//             color="from-orange-500 to-orange-600"
//             suffix="%"
//             description="Task completion"
//           />
//         </div>

//         {rolesData.length > 0 && (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div
//               className={`xl:col-span-2 ${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//             >
//               <h3
//                 className={`text-xl font-bold ${currentTheme.text} mb-6`}
//               >
//                 Activity Timeline
//               </h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSeriesData}>
//                   <defs>
//                     <linearGradient
//                       id="colorTasksUser"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor="#8B5CF6"
//                         stopOpacity={0.3}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor="#8B5CF6"
//                         stopOpacity={0}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={
//                       isDarkMode ? "#374151" : "#E5E7EB"
//                     }
//                   />
//                   <XAxis
//                     dataKey="date"
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                   />
//                   <YAxis
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone"
//                     dataKey="tasks"
//                     stroke="#8B5CF6"
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#colorTasksUser)"
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="completed"
//                     stroke="#10B981"
//                     strokeWidth={2}
//                     fillOpacity={0.6}
//                     fill="#10B981"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {roleDistribution.length > 0 && (
//               <div
//                 className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//               >
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text} mb-6`}
//                 >
//                   My Roles
//                 </h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={roleDistribution}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={50}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {roleDistribution.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         ></div>
//                         <span
//                           className={`text-sm ${currentTheme.textSecondary}`}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${currentTheme.text}`}
//                       >
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {Object.keys(groupedData).length === 0 ? (
//           <div
//             className={`text-center py-12 ${palette.card} rounded-xl ${palette.shadow} mt-8`}
//           >
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3
//               className={`text-lg font-semibold ${currentTheme.text} mb-2`}
//             >
//               No Analytics Data Available
//             </h3>
//             <p className={`${currentTheme.textSecondary}`}>
//               You don't have any active role assignments yet.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//            {Object.entries(groupedData).map(([projectId, roles]) => {
//   // 👉 Hide Intializer role cards on UI
//   const visibleRoles = Object.entries(roles).filter(
//     ([role]) => role !== "Intializer"
//   );

//   return (
//     <div key={projectId} className="space-y-4">
//       <div
//         className={`p-4 rounded-lg ${palette.gradient} border ${palette.border}`}
//       >
//         <h2
//           className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}
//         >
//           🏗️ Project {projectId}
//           <span className="text-sm font-normal px-3 py-1 rounded-full bg-white bg-opacity-20 text-white">
//             {visibleRoles.length} role
//             {visibleRoles.length !== 1 ? "s" : ""}
//           </span>
//         </h2>
//       </div>

//       {visibleRoles.length === 0 ? (
//         // If user has only Intializer role, don't show any analytics cards
//         <div
//           className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow}`}
//         >
//           <p className={`${currentTheme.textSecondary} text-sm`}>
//             Analytics are not shown for the Initializer role.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRoles.map(([role, analytics]) => {
//             const metrics = Object.entries(analytics || {}).map(
//               ([key, value]) => ({
//                 label: key
//                   .replace(/_/g, " ")
//                   .replace(/\b\w/g, (l) => l.toUpperCase()),
//                 value: value || 0,
//                 key,
//               })
//             );

//             return (
//               <div
//                 key={role}
//                 className={`${palette.card} rounded-xl p-6 border ${palette.border} ${palette.shadow} transform hover:scale-105 transition-all duration-300`}
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div
//                     className={`w-12 h-12 ${getRoleGradient(
//                       role
//                     )} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}
//                   >
//                     {getRoleIcon(role)}
//                   </div>
//                   <div>
//                     <h3
//                       className={`text-lg font-bold ${currentTheme.text}`}
//                     >
//                       {role.toUpperCase()}
//                     </h3>
//                     <p
//                       className={`text-sm ${currentTheme.textSecondary}`}
//                     >
//                       Role Analytics
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-3">
//                   {analytics && !analytics.error ? (
//                     metrics.map((m) => (
//                       <div
//                         key={m.key}
//                         className={`p-3 rounded-lg ${currentTheme.gradient} border ${palette.border}`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span
//                             className={`text-sm ${currentTheme.textSecondary}`}
//                           >
//                             {m.label}
//                           </span>
//                           <span className="text-xl font-bold text-purple-600">
//                             {m.value}
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-4">
//                       <span className="text-red-500 text-sm">
//                         {analytics?.error || "No data available"}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// })}

//           </div>
//         )}
//       </div>
//     );
//   };

//   // -------------- Loader --------------
//   if (loading) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center transition-colors duration-300"
//         style={{ background: palette.bg }}
//       >
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//           <p
//             className={`mt-4 text-lg font-medium ${currentTheme.text}`}
//           >
//             Loading Analytics...
//           </p>
//           <p
//             className={`${currentTheme.textSecondary} text-sm`}
//           >
//             Preparing your insights
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Enhanced color palette for snag stats
//   const snagColors = {
//     raised: {
//       gradient:
//         "from-violet-500 via-purple-500 to-fuchsia-500",
//       bg: isDarkMode
//         ? "from-violet-900/20 via-purple-900/20 to-fuchsia-900/20"
//         : "from-violet-50 via-purple-50 to-fuchsia-50",
//       text: isDarkMode ? "text-violet-400" : "text-violet-700",
//       value: isDarkMode ? "text-violet-300" : "text-violet-600",
//       icon: "🚀",
//     },
//     inspected: {
//       gradient:
//         "from-emerald-500 via-teal-500 to-cyan-500",
//       bg: isDarkMode
//         ? "from-emerald-900/20 via-teal-900/20 to-cyan-900/20"
//         : "from-emerald-50 via-teal-50 to-cyan-50",
//       text: isDarkMode ? "text-emerald-400" : "text-emerald-700",
//       value: isDarkMode ? "text-emerald-300" : "text-emerald-600",
//       icon: "✓",
//     },
//     notInspected: {
//       gradient:
//         "from-amber-500 via-orange-500 to-red-400",
//       bg: isDarkMode
//         ? "from-amber-900/20 via-orange-900/20 to-red-900/20"
//         : "from-amber-50 via-orange-50 to-red-50",
//       text: isDarkMode ? "text-amber-400" : "text-amber-700",
//       value: isDarkMode ? "text-amber-300" : "text-amber-600",
//       icon: "⏳",
//     },
//     progress: {
//       gradient:
//         "from-blue-500 via-indigo-500 to-purple-500",
//       bg: isDarkMode
//         ? "from-blue-900/20 via-indigo-900/20 to-purple-900/20"
//         : "from-blue-50 via-indigo-50 to-purple-50",
//       text: isDarkMode ? "text-blue-400" : "text-blue-700",
//       value: isDarkMode ? "text-blue-300" : "text-blue-600",
//       icon: "📊",
//     },
//   };

//   const chartColors = {
//     inspected: "#10B981",
//     notInspected: "#F59E0B",
//     pending: "#EF4444",
//     wip: "#F59E0B",
//     completed: "#10B981",
//     categories: [
//       "#8B5CF6",
//       "#06B6D4",
//       "#10B981",
//       "#F59E0B",
//       "#EF4444",
//       "#EC4899",
//       "#6366F1",
//     ],
//   };

//   // -------------- Render --------------
//   return (
//     <div
//       className="min-h-screen transition-colors duration-300"
//       style={{ background: palette.bg }}
//     >
//       {/* Header */}
//       <div
//         className={`${palette.card} border-b ${palette.border} px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}
//       >
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1
//                   className={`text-2xl font-bold ${currentTheme.text}`}
//                 >
//                   Analytics Dashboard
//                 </h1>
//                 <p
//                   className={`${currentTheme.textSecondary} text-sm`}
//                 >
//                   Real-time insights and performance metrics
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <select
//               value={selectedTimeRange}
//               onChange={(e) =>
//                 setSelectedTimeRange(e.target.value)
//               }
//               className={`px-4 py-2 rounded-lg border ${palette.border} ${palette.card} ${currentTheme.text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
//             >
//               <option value="1d">Last 24 hours</option>
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 3 months</option>
//             </select>

//             <button
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <Download className="w-5 h-5" />
//             </button>
//             <button
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <Filter className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => {
//                 fetchDashboardData();
//                 fetchSnagStats();
//                 fetchQuestionStats(); // 👈 ADDED
//               }}
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               <RefreshCw className="w-5 h-5" />
//             </button>

//             <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
//             >
//               {isDarkMode ? "☀️" : "🌙"}
//             </button>

//             {userId && (
//               <div className="px-3 py-1 rounded-full bg-purple-100 border border-purple-200">
//                 <span className="text-sm font-medium text-purple-800">
//                   ID: {userId}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* ===== Enhanced Snag Stats Section ===== */}
//         <div className="space-y-8 mb-12">
//           {/* Header Card */}
//           <div
//             className={`${palette.card} rounded-2xl p-8 border ${palette.border} ${palette.shadow} bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-2xl transform rotate-3">
//                     <span className="text-3xl">🎯</span>
//                   </div>
//                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
//                 </div>
//                 <div>
//                   <h2
//                     className={`text-3xl font-bold ${currentTheme.text} mb-1`}
//                   >
//                     Snag Analytics Hub
//                   </h2>
//                   <p
//                     className={`${currentTheme.textSecondary} text-base flex items-center gap-2`}
//                   >
//                     <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
//                     Project {snagStats?.project_id ?? "—"} • Live
//                     Monitoring
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={fetchSnagStats}
//                 disabled={snagLoading}
//                 className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 ${
//                     snagLoading ? "animate-spin" : ""
//                   }`}
//                 />
//                 {snagLoading ? "Syncing..." : "Refresh Stats"}
//               </button>
//             </div>
//           </div>

//           {/* Enhanced KPI Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Snags Raised */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.raised.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.raised.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.raised.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.raised.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-4xl font-black ${snagColors.raised.value}`}
//                     >
//                       {snagStats?.snags_raised ?? 0}
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.raised.text} mb-1`}
//                 >
//                   Snags Raised
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Total snags identified
//                 </p>
//               </div>
//             </div>

//             {/* Inspected */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.inspected.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.inspected.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.inspected.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.inspected.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-3xl font-black ${snagColors.inspected.value}`}
//                     >
//                       {snagStats?.snags_inspected?.count ?? 0}
//                     </div>
//                     <div
//                       className={`text-sm font-bold ${snagColors.inspected.text} mt-1`}
//                     >
//                       {pct(
//                         snagStats?.snags_inspected?.percent
//                       )}
//                       %
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.inspected.text} mb-1`}
//                 >
//                   Inspected
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Mode:{" "}
//                   {snagStats?.snags_inspected?.mode ?? "—"}
//                 </p>
//               </div>
//             </div>

//             {/* Not Inspected */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.notInspected.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.notInspected.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.notInspected.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.notInspected.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-3xl font-black ${snagColors.notInspected.value}`}
//                     >
//                       {snagStats?.snags_not_inspected?.count ??
//                         0}
//                     </div>
//                     <div
//                       className={`text-sm font-bold ${snagColors.notInspected.text} mt-1`}
//                     >
//                       {pct(
//                         snagStats?.snags_not_inspected
//                           ?.percent
//                       )}
//                       %
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.notInspected.text} mb-1`}
//                 >
//                   Pending Review
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Awaiting inspection
//                 </p>
//               </div>
//             </div>

//             {/* Units Progress */}
//             <div
//               className={`${palette.card} rounded-2xl p-6 border-2 ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${snagColors.progress.bg} relative overflow-hidden group`}
//             >
//               <div
//                 className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${snagColors.progress.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
//               />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`p-4 rounded-xl bg-gradient-to-br ${snagColors.progress.gradient} shadow-xl`}
//                   >
//                     <span className="text-2xl">
//                       {snagColors.progress.icon}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div
//                       className={`text-4xl font-black ${snagColors.progress.value}`}
//                     >
//                       {snagStats?.units_progress
//                         ?.verification_completed ?? 0}
//                     </div>
//                   </div>
//                 </div>
//                 <h3
//                   className={`font-bold text-lg ${snagColors.progress.text} mb-1`}
//                 >
//                   Units Verified
//                 </h3>
//                 <p
//                   className={`text-xs ${currentTheme.textSecondary} font-medium`}
//                 >
//                   Verification completed
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Charts: Enhanced Pie + Status */}
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//                   <Activity className="w-5 h-5 text-white" />
//                 </div>
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text}`}
//                 >
//                   Inspection Coverage
//                 </h3>
//               </div>
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie
//                     data={inspectedPieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     innerRadius={60}
//                     paddingAngle={3}
//                   >
//                     {inspectedPieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={
//                           index === 0
//                             ? chartColors.inspected
//                             : chartColors.notInspected
//                         }
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend
//                     verticalAlign="bottom"
//                     height={36}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
//                   <BarChart3 className="w-5 h-5 text-white" />
//                 </div>
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text}`}
//                 >
//                   Status Distribution
//                 </h3>
//               </div>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={statusBarData}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={
//                       isDarkMode ? "#374151" : "#E5E7EB"
//                     }
//                   />
//                   <XAxis
//                     dataKey="name"
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <YAxis
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar
//                     dataKey="count"
//                     name="Count"
//                     fill="#8B5CF6"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Category Analysis */}
//           <div
//             className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
//                   <Target className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3
//                     className={`text-xl font-bold ${currentTheme.text}`}
//                   >
//                     Category Analysis
//                   </h3>
//                   <p
//                     className={`text-sm ${currentTheme.textSecondary}`}
//                   >
//                     Snags by category breakdown
//                   </p>
//                 </div>
//               </div>
//             </div>
//             {categoryBarData.length ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={categoryBarData}>
//                   <defs>
//                     <linearGradient
//                       id="colorCategory"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor="#8B5CF6"
//                         stopOpacity={0.9}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor="#EC4899"
//                         stopOpacity={0.9}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke={
//                       isDarkMode ? "#374151" : "#E5E7EB"
//                     }
//                   />
//                   <XAxis
//                     dataKey="name"
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <YAxis
//                     stroke={
//                       isDarkMode ? "#9CA3AF" : "#6B7280"
//                     }
//                     fontSize={12}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar
//                     dataKey="snags"
//                     name="Snags"
//                     fill="url(#colorCategory)"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
//                   <span className="text-2xl">📊</span>
//                 </div>
//                 <p
//                   className={`${currentTheme.textSecondary} font-medium`}
//                 >
//                   No category data available
//                 </p>
//               </div>
//             )}

//             {/* Multi-submission info cards */}
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div
//                 className={`p-5 rounded-xl border-2 ${palette.border} bg-gradient-to-br from-indigo-50 to-purple-50 ${
//                   isDarkMode
//                     ? "from-indigo-900/20 to-purple-900/20"
//                     : ""
//                 }`}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
//                     <Zap className="w-4 h-4 text-white" />
//                   </div>
//                   <div
//                     className={`text-sm font-semibold ${currentTheme.textSecondary}`}
//                   >
//                     Multi-Submission Level
//                   </div>
//                 </div>
//                 <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {snagStats?.category_multi_submissions
//                     ?.level_used ?? "—"}
//                 </div>
//               </div>
//               <div
//                 className={`p-5 rounded-xl border-2 ${palette.border} bg-gradient-to-br from-pink-50 to-rose-50 ${
//                   isDarkMode
//                     ? "from-pink-900/20 to-rose-900/20"
//                     : ""
//                 }`}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
//                     <CheckCircle className="w-4 h-4 text-white" />
//                   </div>
//                   <div
//                     className={`text-sm font-semibold ${currentTheme.textSecondary}`}
//                   >
//                     Category Totals
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   {multiTotals.length ? (
//                     multiTotals.slice(0, 3).map((t, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center justify-between"
//                       >
//                         <span
//                           className={`text-sm font-medium ${currentTheme.text}`}
//                         >
//                           Cat {t.category_id}
//                         </span>
//                         <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
//                           {t.count}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <div
//                       className={`text-sm ${currentTheme.textSecondary}`}
//                     >
//                       No data
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stage Status Grid - Enhanced */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Inspector Stage",
//                 data: inspectorStageData,
//                 gradient: "from-cyan-500 to-blue-500",
//                 icon: "🔍",
//               },
//               {
//                 title: "Maker Stage",
//                 data: makerStageData,
//                 gradient: "from-orange-500 to-red-500",
//                 icon: "🔨",
//               },
//               {
//                 title: "Supervisor Stage",
//                 data: supervisorStageData,
//                 gradient: "from-green-500 to-emerald-500",
//                 icon: "👁️",
//               },
//             ].map((blk, i) => (
//               <div
//                 key={i}
//                 className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//               >
//                 <div className="flex items-center gap-3 mb-6">
//                   <div
//                     className={`p-3 rounded-xl bg-gradient-to-br ${blk.gradient} shadow-lg`}
//                   >
//                     <span className="text-xl">
//                       {blk.icon}
//                     </span>
//                   </div>
//                   <div>
//                     <h3
//                       className={`text-lg font-bold ${currentTheme.text}`}
//                     >
//                       {blk.title}
//                     </h3>
//                     <p
//                       className={`text-xs ${currentTheme.textSecondary}`}
//                     >
//                       Unit status tracking
//                     </p>
//                   </div>
//                 </div>
//                 {blk.data.length ? (
//                   <ResponsiveContainer width="100%" height={260}>
//                     <BarChart data={blk.data}>
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         stroke={
//                           isDarkMode
//                             ? "#374151"
//                             : "#E5E7EB"
//                         }
//                       />
//                       <XAxis
//                         dataKey="stage"
//                         stroke={
//                           isDarkMode
//                             ? "#9CA3AF"
//                             : "#6B7280"
//                         }
//                         fontSize={11}
//                       />
//                       <YAxis
//                         stroke={
//                           isDarkMode
//                             ? "#9CA3AF"
//                             : "#6B7280"
//                         }
//                         fontSize={11}
//                       />
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend
//                         wrapperStyle={{ fontSize: "11px" }}
//                       />
//                       <Bar
//                         dataKey="pending"
//                         stackId="a"
//                         name="Pending"
//                         fill={chartColors.pending}
//                         radius={[4, 4, 0, 0]}
//                       />
//                       <Bar
//                         dataKey="work_in_progress"
//                         stackId="a"
//                         name="WIP"
//                         fill={chartColors.wip}
//                       />
//                       <Bar
//                         dataKey="completed"
//                         stackId="a"
//                         name="Done"
//                         fill={chartColors.completed}
//                         radius={[4, 4, 0, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2">
//                       <span className="text-xl">📈</span>
//                     </div>
//                     <p
//                       className={`text-sm ${currentTheme.textSecondary}`}
//                     >
//                       No stage data
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* KPIs Grid - Enhanced */}
//           <div
//             className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
//                 <Activity className="w-5 h-5 text-white" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {kpiEntries.length ? (
//                 kpiEntries.map((k, i) => (
//                   <div
//                     key={i}
//                     className={`p-5 rounded-xl border-2 ${palette.border} ${currentTheme.hover} transition-all duration-200 bg-gradient-to-br ${
//                       i % 4 === 0
//                         ? "from-blue-50 to-cyan-50"
//                         : i % 4 === 1
//                         ? "from-purple-50 to-pink-50"
//                         : i % 4 === 2
//                         ? "from-green-50 to-emerald-50"
//                         : "from-orange-50 to-red-50"
//                     } ${
//                       isDarkMode
//                         ? "from-slate-800/50 to-slate-700/50"
//                         : ""
//                     }`}
//                   >
//                     <div
//                       className={`text-xs font-semibold ${currentTheme.textSecondary} mb-2 uppercase tracking-wide`}
//                     >
//                       {k.label}
//                     </div>
//                     <div
//                       className={`text-2xl font-black ${currentTheme.text}`}
//                     >
//                       {k.value}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div
//                   className={`col-span-full text-center py-8 ${currentTheme.textSecondary}`}
//                 >
//                   No KPI data available
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Units Progress - Enhanced */}
//           <div
//             className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//                 <Target className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h3
//                   className={`text-xl font-bold ${currentTheme.text}`}
//                 >
//                   Units Progress
//                 </h3>
//                 <p
//                   className={`text-sm ${currentTheme.textSecondary}`}
//                 >
//                   Lifecycle tracking
//                 </p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 {
//                   key: "raised_by_inspector",
//                   label: "Raised by Inspector",
//                   gradient:
//                     "from-blue-500 to-cyan-500",
//                   icon: "🔍",
//                 },
//                 {
//                   key: "verification_completed",
//                   label: "Verification Done",
//                   gradient:
//                     "from-green-500 to-emerald-500",
//                   icon: "✓",
//                 },
//                 {
//                   key: "handover_given",
//                   label: "Handover Given",
//                   gradient:
//                     "from-purple-500 to-pink-500",
//                   icon: "🎉",
//                 },
//               ].map((item, idx) => (
//                 <div
//                   key={idx}
//                   className={`p-6 rounded-xl border-2 ${palette.border} bg-gradient-to-br ${
//                     isDarkMode
//                       ? "from-slate-800/50 to-slate-700/50"
//                       : "from-white to-gray-50"
//                   } hover:shadow-lg transition-all duration-300`}
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <div
//                       className={`p-3 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg`}
//                     >
//                       <span className="text-xl">
//                         {item.icon}
//                       </span>
//                     </div>
//                     <div
//                       className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
//                     >
//                       {item.label}
//                     </div>
//                   </div>
//                   <div
//                     className={`text-4xl font-black ${currentTheme.text}`}
//                   >
//                     {snagStats?.units_progress?.[item.key] ??
//                       0}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ===== Question Hotspots (NEW SECTION) ===== */}
//           {aggregatedQuestions.length > 0 && (
//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow} hover:shadow-2xl transition-all duration-300`}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 shadow-lg">
//                     <BarChart3 className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3
//                       className={`text-xl font-bold ${currentTheme.text}`}
//                     >
//                       Question Hotspots
//                     </h3>
//                     <p
//                       className={`text-sm ${currentTheme.textSecondary}`}
//                     >
//                       Jo questions sabse zyada repeat ho rahe hain (Maker / Checker / Supervisor focus)
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right text-xs">
//                   {questionLoading ? (
//                     <span className={currentTheme.textSecondary}>
//                       Loading…
//                     </span>
//                   ) : (
//                     <span className={currentTheme.textSecondary}>
//                       {aggregatedQuestions.length} questions • {selectedTimeRange}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className={`border-b ${palette.border}`}>
//                       <th className="py-2 px-3 text-left font-semibold">
//                         Question
//                       </th>
//                       <th className="py-2 px-3 text-left font-semibold">
//                         Checklist
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Total
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Attempts
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Maker
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Checker
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Supervisor
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Flats
//                       </th>
//                       <th className="py-2 px-3 text-right font-semibold">
//                         Stages
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {aggregatedQuestions.map((q, idx) => (
//                       <tr
//                         key={idx}
//                         className={`border-b ${palette.border} hover:${palette.hover} transition-colors`}
//                       >
//                         <td className={`py-2 px-3 ${currentTheme.text}`}>
//                           <div className="font-medium line-clamp-2">
//                             {q.question}
//                           </div>
//                         </td>
//                         <td className={`py-2 px-3 ${currentTheme.textSecondary}`}>
//                           <span className="text-xs">
//                             {q.checklist_names || "—"}
//                           </span>
//                         </td>
//                         <td className="py-2 px-3 text-right font-semibold">
//                           {q.total_submissions}
//                         </td>
//                         <td className="py-2 px-3 text-right">
//                           {q.attempts}
//                         </td>
//                         <td className="py-2 px-3 text-right text-blue-600">
//                           {q.maker_count}
//                         </td>
//                         <td className="py-2 px-3 text-right text-purple-600">
//                           {q.checker_count}
//                         </td>
//                         <td className="py-2 px-3 text-right text-emerald-600">
//                           {q.supervisor_count}
//                         </td>
//                         <td className="py-2 px-3 text-right">
//                           {q.distinct_flats}
//                         </td>
//                         <td className="py-2 px-3 text-right">
//                           {q.distinct_stages}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Multi-submission Users - Enhanced */}
//           {multiItemsByUser.length > 0 && (
//             <div
//               className={`${palette.card} rounded-2xl p-6 border ${palette.border} ${palette.shadow}`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
//                   <Users className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3
//                     className={`text-xl font-bold ${currentTheme.text}`}
//                   >
//                     Multi-Submission by User
//                   </h3>
//                   <p
//                     className={`text-sm ${currentTheme.textSecondary}`}
//                   >
//                     User contribution tracking
//                   </p>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr
//                       className={`border-b-2 ${palette.border}`}
//                     >
//                       <th
//                         className={`py-3 px-4 text-left text-sm font-bold ${currentTheme.text}`}
//                       >
//                         User ID
//                       </th>
//                       <th
//                         className={`py-3 px-4 text-right text-sm font-bold ${currentTheme.text}`}
//                       >
//                         Items Count
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {multiItemsByUser.map((u, i) => (
//                       <tr
//                         key={i}
//                         className={`border-b ${palette.border} hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${
//                           isDarkMode
//                             ? "hover:from-indigo-900/20 hover:to-purple-900/20"
//                             : ""
//                         } transition-colors`}
//                       >
//                         <td
//                           className={`py-3 px-4 ${currentTheme.text} font-medium`}
//                         >
//                           User #{u.user_id}
//                         </td>
//                         <td className="py-3 px-4 text-right">
//                           <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg text-sm">
//                             {u.items_count}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ===== Role Dashboards ===== */}
//         {!dashboardData ? (
//           <div
//             className={`text-center py-12 ${palette.card} rounded-xl ${palette.shadow} mt-8`}
//           >
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3
//               className={`text-lg font-semibold ${currentTheme.text} mb-2`}
//             >
//               No Dashboard Data Available
//             </h3>
//             <p className={`${currentTheme.textSecondary}`}>
//               Unable to load dashboard information.
//             </p>
//           </div>
//         ) : (
//           <>
//             {dashboardData.role === "MANAGER" &&
//               renderManagerDashboard(dashboardData)}
//             {dashboardData.role === "SUPER_ADMIN" &&
//               renderSuperAdminDashboard(dashboardData)}
//             {dashboardData.role === "CLIENT" &&
//               renderClientDashboard(dashboardData)}
//             {dashboardData.role === "USER" &&
//               renderUserDashboard(dashboardData)}
//           </>
//         )}

//         {/* Enhanced Refresh Button */}
//         <div className="mt-12 text-center">
//           <button
//             onClick={() => {
//               fetchDashboardData();
//               fetchSnagStats();
//               fetchQuestionStats(); // 👈 ADDED
//             }}
//             disabled={loading || snagLoading}
//             className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
//           >
//             {loading || snagLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span className="text-lg">
//                   Refreshing Dashboard...
//                 </span>
//               </>
//             ) : (
//               <>
//                 <RefreshCw className="w-5 h-5" />
//                 <span className="text-lg">Refresh All Data</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

// src/pages/UserDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { showToast } from "../utils/toast";
import {
  getUserDashboard,
  getSnagStats,
  resolveActiveProjectId,
  getQuestionHotspots,
  getProjectsByOrgOwnership, // 👈 use this or getManagerOwnedProjects
  setActiveProjectId,
} from "../api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Target,
  Zap,
  Download,
  Filter,
  RefreshCw,
  Building,
  Building2,
  Factory,
} from "lucide-react";

const UserDashboard = () => {
  // ---------------- Theme ----------------
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = {
    light: {
      bg: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      hover: "hover:bg-gray-50",
      gradient: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
    },
    dark: {
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      card: "bg-slate-800",
      text: "text-white",
      textSecondary: "text-slate-400",
      border: "border-slate-700",
      hover: "hover:bg-slate-700",
      gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
    },
  };
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const palette = {
    bg: currentTheme.bg,
    card: currentTheme.card,
    text: currentTheme.text,
    border: currentTheme.border,
    hover: currentTheme.hover,
    shadow: isDarkMode ? "shadow-2xl shadow-black/20" : "shadow-2xl shadow-gray-200/50",
    gradient: currentTheme.gradient,
    managerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
    clientGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    adminGradient: "bg-gradient-to-r from-red-500 to-pink-500",
    supervisorGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    makerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    checkerGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
  };

  // -------------- Core State --------------
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [userId, setUserId] = useState(null);

  // -------------- Snag Stats --------------
  const [snagStats, setSnagStats] = useState(null);
  const [snagLoading, setSnagLoading] = useState(false);

  // -------------- Question Hotspot Stats --------------
  const [questionStats, setQuestionStats] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  // -------------- Fetchers --------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getUserDashboard(selectedTimeRange);
      if (res?.status === 200) {
        setDashboardData(res.data.dashboard);
        setUserId(res.data.user_id);
      } else {
        showToast("Failed to fetch dashboard data", "error");
      }
    } catch (e) {
      console.error(e);
      showToast(`Error loading dashboard: ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSnagStats = async () => {
    const pid = resolveActiveProjectId();
    if (!pid) {
      setSnagStats(null);
      return;
    }
    try {
      setSnagLoading(true);
      const { data } = await getSnagStats(pid, { time_range: selectedTimeRange });
      setSnagStats(data);
    } catch (e) {
      console.error("getSnagStats error:", e);
      showToast("Failed to load snag statistics", "error");
    } finally {
      setSnagLoading(false);
    }
  };

  const fetchQuestionStats = async () => {
    const pid = resolveActiveProjectId();
    if (!pid) {
      setQuestionStats(null);
      return;
    }
    try {
      setQuestionLoading(true);
      const { data } = await getQuestionHotspots(pid, {
        time_range: selectedTimeRange,
        limit: 50,
      });
      setQuestionStats(data);
    } catch (e) {
      console.error("getQuestionHotspots error:", e);
      showToast("Failed to load question hotspot stats", "error");
    } finally {
      setQuestionLoading(false);
    }
  };
  useEffect(() => {
  // Only after dashboard data is loaded
  if (!dashboardData) return;

  // Only for MANAGER
  if (dashboardData.role !== "MANAGER") return;

  // If project already set, do nothing
  const existing = resolveActiveProjectId();
  if (existing) return;

  // Get organization_id from USER_DATA in localStorage
  const userStr = localStorage.getItem("USER_DATA");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const organizationId = user?.org || user?.organization_id || null;

  if (!organizationId) {
    console.warn("No organization_id found for manager; cannot set active project");
    return;
  }

  (async () => {
    try {
      // Option 1: using getProjectsByOrgOwnership
      const res = await getProjectsByOrgOwnership(organizationId);

      // Option 2 (if you want to use the function you added):
      // const res = await getManagerOwnedProjects(organizationId);

      const projects = res?.data || [];
      if (!projects.length) {
        console.warn("Manager has no owned projects from by_ownership");
        return;
      }

      // Pick first project as default active
      const firstProjectId = projects[0].id;

      // Save it so resolveActiveProjectId() works everywhere
      setActiveProjectId(firstProjectId);

      // Re-fetch stats now that we have an active project
      await fetchSnagStats();
      await fetchQuestionStats();
    } catch (err) {
      console.error("Error setting manager active project:", err);
    }
  })();
}, [dashboardData]); // 👈 only depends on dashboardData


  useEffect(() => {
    fetchDashboardData();
    fetchSnagStats();
    fetchQuestionStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeRange]);

  // -------------- Reusable UI --------------
  const KPICard = ({
    title,
    value,
    trend,
    icon: Icon,
    color,
    suffix = "",
    description,
  }) => (
    <div
      className={`${palette.card} rounded-2xl p-6 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group relative overflow-hidden`}
      style={{
        boxShadow: isDarkMode 
          ? "0 10px 40px rgba(0,0,0,0.3)" 
          : "0 10px 40px rgba(0,0,0,0.08)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {typeof trend === "number" && (
            <div
              className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full font-semibold ${
                trend > 0 
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" 
                  : "text-red-600 bg-red-50 dark:bg-red-900/30"
              }`}
            >
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <h3 className={`font-bold text-lg ${currentTheme.text} mb-2`}>{title}</h3>
        {description && (
          <p className={`text-sm ${currentTheme.textSecondary} mb-3`}>{description}</p>
        )}
        <div className={`text-4xl font-black ${currentTheme.text} tracking-tight`}>
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix && <span className="text-2xl ml-1">{suffix}</span>}
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div
          className={`${palette.card} p-4 rounded-xl shadow-2xl border ${palette.border} backdrop-blur-xl`}
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <p className={`font-bold ${currentTheme.text} mb-3 text-base`}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className={`text-sm font-medium ${currentTheme.text}`}>
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // -------------- Helpers --------------
  const pct = (n) => (n == null ? "0.0" : Number(n).toFixed(1));

  const generateTimeSeriesData = (data, role) => {
    const days =
      selectedTimeRange === "1d"
        ? 1
        : selectedTimeRange === "7d"
        ? 7
        : selectedTimeRange === "30d"
        ? 30
        : 90;

    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      let tasks = 0,
        completed = 0,
        pending = 0;

      if (role === "SUPER_ADMIN") {
        const baseChecklists = data?.total_checklists || 0;
        tasks = Math.floor(
          (baseChecklists * (0.7 + Math.random() * 0.4)) / days
        );
        completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
        pending = Math.max(0, tasks - completed);
      } else if (role === "USER" && data?.projects_roles_analytics) {
        data.projects_roles_analytics.forEach((item) => {
          if (item.analytics && !item.analytics.error) {
            Object.values(item.analytics).forEach((val) => {
              if (typeof val === "number") {
                tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
              }
            });
          }
        });
        completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
        pending = Math.max(0, tasks - completed);
      } else if (role === "CLIENT") {
        const baseProjects = data?.created_project_count || 0;
        tasks = Math.floor(
          baseProjects * 5 * (0.8 + Math.random() * 0.4)
        );
        completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
        pending = Math.max(0, tasks - completed);
      } else {
        tasks = Math.floor(
          ((data?.organizations_created || 1) *
            3 *
            (0.8 + Math.random() * 0.4))
        );
        completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
        pending = Math.max(0, tasks - completed);
      }

      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        tasks: Math.max(0, tasks),
        completed: Math.max(0, completed),
        pending: Math.max(0, pending),
      };
    });
  };

  const generateRoleDistribution = (data, role) => {
    if (role === "SUPER_ADMIN") {
      const totalMakers = data?.total_makers || 0;
      const totalCheckers = data?.total_checkers || 0;
      const totalUsers = data?.total_users || 1;
      const supervisors = Math.floor(totalUsers * 0.1);
      const initializers = Math.floor(totalUsers * 0.05);
      return [
        { name: "Makers", value: totalMakers, color: "#8B5CF6" },
        { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
        { name: "Supervisors", value: supervisors, color: "#10B981" },
        { name: "Initializers", value: initializers, color: "#F59E0B" },
      ].filter((x) => x.value > 0);
    } else if (role === "USER" && data?.projects_roles_analytics) {
      const roleCounts = {};
      data.projects_roles_analytics.forEach((item) => {
        roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
      });
      const colors = [
        "#8B5CF6",
        "#06B6D4",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#EC4899",
      ];
      return Object.entries(roleCounts).map(([r, count], i) => ({
        name: r,
        value: count,
        color: colors[i % colors.length],
      }));
    }
    return [];
  };

  const getRoleIcon = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN":
        return "👑";
      case "CLIENT":
        return "👤";
      case "MANAGER":
      case "SUPERVISOR":
        return "👥";
      case "MAKER":
        return "🔧";
      case "CHECKER":
        return "✅";
      default:
        return "📋";
    }
  };
  const getRoleGradient = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN":
        return palette.adminGradient;
      case "CLIENT":
        return palette.clientGradient;
      case "MANAGER":
        return palette.managerGradient;
      case "SUPERVISOR":
        return palette.supervisorGradient;
      case "MAKER":
        return palette.makerGradient;
      case "CHECKER":
        return palette.checkerGradient;
      default:
        return "bg-gray-500";
    }
  };

  // ----------- Derived Snag Data -----------
  const inspectedPieData = useMemo(
    () =>
      snagStats
        ? [
            {
              name: "Inspected",
              value: snagStats?.snags_inspected?.count || 0,
            },
            {
              name: "Not Inspected",
              value: snagStats?.snags_not_inspected?.count || 0,
            },
          ]
        : [],
    [snagStats]
  );

  const statusBarData = useMemo(() => {
    if (!snagStats?.snags_status) return [];
    return Object.entries(snagStats.snags_status).map(([k, v]) => ({
      name: k.replace(/_/g, " "),
      count: v?.count ?? 0,
      percent: v?.percent ?? 0,
    }));
  }, [snagStats]);

  const categoryBarData = useMemo(
    () =>
      snagStats?.category_wise?.map((c) => ({
        name: `Cat ${c.category_id}`,
        snags: c.snags || 0,
      })) || [],
    [snagStats]
  );

  const toStageStack = (list) =>
    (list || []).map((s) => ({
      stage: `S${s.stage_id}`,
      pending: s.pending || 0,
      work_in_progress: s.work_in_progress || 0,
      completed: s.completed || 0,
    }));

  const inspectorStageData = useMemo(
    () => toStageStack(snagStats?.inspector_stage_unit_status),
    [snagStats]
  );
  const makerStageData = useMemo(
    () => toStageStack(snagStats?.maker_stage_unit_status),
    [snagStats]
  );
  const supervisorStageData = useMemo(
    () => toStageStack(snagStats?.supervisor_stage_unit_status),
    [snagStats]
  );

  const kpiEntries = useMemo(
    () =>
      snagStats
        ? Object.entries(snagStats.kpis || {}).map(([k, v]) => ({
            label: k
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            value: v == null ? "—" : v,
          }))
        : [],
    [snagStats]
  );

  const multiTotals =
    snagStats?.category_multi_submissions?.totals || [];
  const multiItemsByUser =
    snagStats?.multi_submission_items_by_user || [];

  // -------- Question Hotspots aggregation --------
  const aggregatedQuestions = useMemo(() => {
    if (!questionStats?.question_hotspots?.length) return [];

    const map = new Map();

    questionStats.question_hotspots.forEach((q) => {
      const key = q.question || `Item ${q.item_id}`;

      if (!map.has(key)) {
        map.set(key, {
          question: key,
          checklist_names: new Set(),
          total_submissions: 0,
          attempts: 0,
          maker_count: 0,
          checker_count: 0,
          supervisor_count: 0,
          flats: new Set(),
          stages: new Set(),
        });
      }

      const ref = map.get(key);
      if (q.checklist_name) ref.checklist_names.add(q.checklist_name);

      ref.total_submissions += q.total_submissions || 0;
      ref.attempts += q.attempts || 0;
      ref.maker_count += q.maker_count || 0;
      ref.checker_count += q.checker_count || 0;
      ref.supervisor_count += q.supervisor_count || 0;

      if (q.flat_id) ref.flats.add(q.flat_id);
      if (q.stage_id) ref.stages.add(q.stage_id);
    });

    return Array.from(map.values())
      .map((x) => ({
        ...x,
        checklist_names: Array.from(x.checklist_names).join(", "),
        distinct_flats: x.flats.size,
        distinct_stages: x.stages.size,
      }))
      .sort((a, b) => b.total_submissions - a.total_submissions)
      .slice(0, 10);
  }, [questionStats]);

  // -------------- Role Dashboards --------------
  const renderManagerDashboard = (data) => {
    const timeSeriesData = generateTimeSeriesData(data, "MANAGER");
    const kpis = [
      {
        title: "Organizations",
        value: data?.organizations_created || 0,
        trend: 12.5,
        icon: Building,
        color: "from-purple-500 to-purple-600",
        description: "Created by you",
      },
      {
        title: "Companies",
        value: data?.companies_created || 0,
        trend: 8.3,
        icon: Building2,
        color: "from-blue-500 to-blue-600",
        description: "Under management",
      },
      {
        title: "Entities",
        value: data?.entities_created || 0,
        trend: 15.7,
        icon: Factory,
        color: "from-green-500 to-green-600",
        description: "Total entities",
      },
    ];
    return (
      <div className="space-y-8">
        <div
          className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm relative overflow-hidden`}
          style={{
            boxShadow: isDarkMode 
              ? "0 20px 60px rgba(0,0,0,0.4)" 
              : "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-pink-500/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 ${getRoleGradient(
                  data.role
                )} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl`}
              >
                {getRoleIcon(data.role)}
              </div>
              <div>
                <h2 className={`text-4xl font-black ${currentTheme.text} mb-2`}>
                  Manager Dashboard
                </h2>
                <p
                  className={`${currentTheme.textSecondary} text-lg`}
                >
                  Organization management and analytics
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {(data?.organizations_created || 0) +
                  (data?.companies_created || 0) +
                  (data?.entities_created || 0)}
              </div>
              <div
                className={`text-sm font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
              >
                Total Managed
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((k, i) => (
            <KPICard key={i} {...k} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className={`text-2xl font-bold ${currentTheme.text} mb-6`}
            >
              Activity Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient
                    id="colorTasks"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#8B5CF6"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#8B5CF6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    isDarkMode ? "#374151" : "#E5E7EB"
                  }
                />
                <XAxis
                  dataKey="date"
                  stroke={
                    isDarkMode ? "#9CA3AF" : "#6B7280"
                  }
                />
                <YAxis
                  stroke={
                    isDarkMode ? "#9CA3AF" : "#6B7280"
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={0.6}
                  fill="#10B981"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className={`text-2xl font-bold ${currentTheme.text} mb-6`}
            >
              Performance Overview
            </h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  92.5%
                </div>
                <div
                  className={`text-sm font-semibold ${currentTheme.textSecondary} mb-3 uppercase tracking-wide`}
                >
                  Management Efficiency
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: "92.5%" }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  87.3%
                </div>
                <div
                  className={`text-sm font-semibold ${currentTheme.textSecondary} mb-3 uppercase tracking-wide`}
                >
                  Success Rate
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: "87.3%" }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  3.2h
                </div>
                <div
                  className={`text-sm font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
                >
                  Avg Response Time
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuperAdminDashboard = (data) => {
    const timeSeriesData = generateTimeSeriesData(
      data,
      "SUPER_ADMIN"
    );
    const roleDistribution = generateRoleDistribution(
      data,
      "SUPER_ADMIN"
    );
    const kpis = [
      {
        title: "Total Users",
        value: data?.total_users || 0,
        trend: 8.5,
        icon: Users,
        color: "from-blue-500 to-blue-600",
        description: "System wide",
      },
      {
        title: "Active Projects",
        value: data?.total_projects || 0,
        trend: 12.3,
        icon: Target,
        color: "from-green-500 to-green-600",
        description: "In progress",
      },
      {
        title: "Total Checklists",
        value: data?.total_checklists || 0,
        trend: 15.7,
        icon: CheckCircle,
        color: "from-purple-500 to-purple-600",
        description: "All projects",
      },
      {
        title: "Makers",
        value: data?.total_makers || 0,
        trend: 5.2,
        icon: Activity,
        color: "from-orange-500 to-orange-600",
        description: "Active makers",
      },
      {
        title: "Checkers",
        value: data?.total_checkers || 0,
        trend: 7.8,
        icon: Zap,
        color: "from-red-500 to-red-600",
        description: "Quality control",
      },
      {
        title: "Efficiency",
        value: "94.2",
        trend: 3.1,
        icon: BarChart3,
        color: "from-indigo-500 to-indigo-600",
        suffix: "%",
        description: "Overall system",
      },
    ];
    return (
      <div className="space-y-8">
        <div
          className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm relative overflow-hidden`}
          style={{
            boxShadow: isDarkMode 
              ? "0 20px 60px rgba(0,0,0,0.4)" 
              : "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 ${getRoleGradient(
                  data.role
                )} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl`}
              >
                {getRoleIcon(data.role)}
              </div>
              <div>
                <h2 className={`text-4xl font-black ${currentTheme.text} mb-2`}>
                  Super Admin Dashboard
                </h2>
                <p
                  className={`${currentTheme.textSecondary} text-lg`}
                >
                  System-wide analytics and management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  98.5%
                </div>
                <div
                  className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
                >
                  Uptime
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                  {data?.total_users || 0}
                </div>
                <div
                  className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
                >
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {kpis.map((k, i) => (
            <KPICard key={i} {...k} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div
            className={`xl:col-span-2 ${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-2xl font-bold ${currentTheme.text}`}
              >
                System Activity
              </h3>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  Tasks
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Completed
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient
                    id="colorTasksAdmin"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#8B5CF6"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#8B5CF6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorCompletedAdmin"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#10B981"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10B981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    isDarkMode ? "#374151" : "#E5E7EB"
                  }
                />
                <XAxis
                  dataKey="date"
                  stroke={
                    isDarkMode ? "#9CA3AF" : "#6B7280"
                  }
                />
                <YAxis
                  stroke={
                    isDarkMode ? "#9CA3AF" : "#6B7280"
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTasksAdmin)"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCompletedAdmin)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className={`text-2xl font-bold ${currentTheme.text} mb-6`}
            >
              Team Distribution
            </h3>
            {roleDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-3">
                  {roleDistribution.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span
                          className={`text-sm font-medium ${currentTheme.text}`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`text-lg font-bold ${currentTheme.text}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className={`text-gray-400 text-sm`}>
                  No team data available
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderClientDashboard = (data) => {
    const timeSeriesData = generateTimeSeriesData(data, "CLIENT");
    return (
      <div className="space-y-8">
        <div
          className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm relative overflow-hidden`}
          style={{
            boxShadow: isDarkMode 
              ? "0 20px 60px rgba(0,0,0,0.4)" 
              : "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 ${getRoleGradient(
                  data.role
                )} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl`}
              >
                {getRoleIcon(data.role)}
              </div>
              <div>
                <h2 className={`text-4xl font-black ${currentTheme.text} mb-2`}>
                  Client Dashboard
                </h2>
                <p
                  className={`${currentTheme.textSecondary} text-lg`}
                >
                  Your projects and performance overview
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {data?.created_project_count || 0}
              </div>
              <div
                className={`text-sm font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
              >
                Active Projects
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Projects Created"
            value={data?.created_project_count || 0}
            trend={15.2}
            icon={Target}
            color="from-blue-500 to-blue-600"
            description="Total projects"
          />
          <KPICard
            title="Success Rate"
            value="94.2"
            trend={5.8}
            icon={CheckCircle}
            color="from-green-500 to-green-600"
            suffix="%"
            description="Project completion"
          />
          <KPICard
            title="Avg Duration"
            value="2.4"
            trend={-8.3}
            icon={Clock}
            color="from-purple-500 to-purple-600"
            suffix="mo"
            description="Per project"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className={`text-2xl font-bold ${currentTheme.text} mb-6`}
            >
              Project Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient
                    id="colorTasksClient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06B6D4"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#06B6D4"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    isDarkMode ? "#374151" : "#E5E7EB"
                  }
                />
                <XAxis
                  dataKey="date"
                  stroke={
                    isDarkMode ? "#9CA3AF" : "#6B7280"
                  }
                />
                <YAxis
                  stroke={
                    isDarkMode ? "#9CA3AF" : "#6B7280"
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTasksClient)"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={0.6}
                  fill="#10B981"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className={`text-2xl font-bold ${currentTheme.text} mb-6`}
            >
              Recent Projects
            </h3>
            <div className="space-y-3">
              {data?.created_projects?.length ? (
                data.created_projects.slice(0, 5).map(
                  (project, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${palette.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        🏗️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`font-bold ${currentTheme.text} text-base`}
                            >
                              {project.name ||
                                `Project ${project.id}`}
                            </p>
                            <p
                              className={`text-sm ${currentTheme.textSecondary} font-medium`}
                            >
                              Created by you • Active
                            </p>
                          </div>
                          <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full font-bold">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-12">
                  <div className={`text-gray-400 text-sm`}>
                    No projects created yet
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserDashboard = (data) => {
    const rolesData = data?.projects_roles_analytics || [];
    const timeSeriesData = generateTimeSeriesData(data, "USER");
    const roleDistribution = generateRoleDistribution(
      data,
      "USER"
    );

    const groupedData = rolesData.reduce((acc, item) => {
      const projectId = item.project_id;
      if (!acc[projectId]) acc[projectId] = {};
      acc[projectId][item.role] = item.analytics;
      return acc;
    }, {});
    let totalTasks = 0;
    let totalAssigned = 0;
    rolesData.forEach((item) => {
      if (item.analytics && !item.analytics.error) {
        Object.entries(item.analytics).forEach(
          ([key, value]) => {
            if (typeof value === "number") {
              totalTasks += value;
              if (
                key.includes("assigned") ||
                key.includes("pending_for_me")
              ) {
                totalAssigned += value;
              }
            }
          }
        );
      }
    });

    return (
      <div className="space-y-8">
        <div
          className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm relative overflow-hidden`}
          style={{
            boxShadow: isDarkMode 
              ? "0 20px 60px rgba(0,0,0,0.4)" 
              : "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 ${palette.gradient} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl`}
              >
                📊
              </div>
              <div>
                <h2 className={`text-4xl font-black ${currentTheme.text} mb-2`}>
                  User Analytics Dashboard
                </h2>
                <p
                  className={`${currentTheme.textSecondary} text-lg`}
                >
                  Your work analytics across all projects and roles
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {Object.keys(groupedData).length}
              </div>
              <div
                className={`text-sm font-semibold ${currentTheme.textSecondary} uppercase tracking-wide`}
              >
                Active Projects
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Tasks"
            value={totalTasks}
            trend={8.5}
            icon={Target}
            color="from-blue-500 to-blue-600"
            description="All assigned"
          />
          <KPICard
            title="Assigned to Me"
            value={totalAssigned}
            trend={12.3}
            icon={Users}
            color="from-green-500 to-green-600"
            description="Current workload"
          />
          <KPICard
            title="Projects"
            value={Object.keys(groupedData).length}
            trend={5.7}
            icon={BarChart3}
            color="from-purple-500 to-purple-600"
            description="Active projects"
          />
          <KPICard
            title="Efficiency"
            value={
              totalTasks > 0
                ? Math.round(
                    (totalAssigned / totalTasks) * 100
                  )
                : 0
            }
            trend={3.2}
            icon={Zap}
            color="from-orange-500 to-orange-600"
            suffix="%"
            description="Task completion"
          />
        </div>

        {rolesData.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div
              className={`xl:col-span-2 ${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                className={`text-2xl font-bold ${currentTheme.text} mb-6`}
              >
                Activity Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient
                      id="colorTasksUser"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#8B5CF6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      isDarkMode ? "#374151" : "#E5E7EB"
                    }
                  />
                  <XAxis
                    dataKey="date"
                    stroke={
                      isDarkMode ? "#9CA3AF" : "#6B7280"
                    }
                  />
                  <YAxis
                    stroke={
                      isDarkMode ? "#9CA3AF" : "#6B7280"
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTasksUser)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={0.6}
                    fill="#10B981"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {roleDistribution.length > 0 && (
              <div
                className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
                style={{
                  boxShadow: isDarkMode 
                    ? "0 15px 50px rgba(0,0,0,0.3)" 
                    : "0 15px 50px rgba(0,0,0,0.08)",
                }}
              >
                <h3
                  className={`text-2xl font-bold ${currentTheme.text} mb-6`}
                >
                  My Roles
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-3">
                  {roleDistribution.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span
                          className={`text-sm font-medium ${currentTheme.text}`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`text-lg font-bold ${currentTheme.text}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {Object.keys(groupedData).length === 0 ? (
          <div
            className={`text-center py-16 ${palette.card} rounded-3xl border ${palette.border} backdrop-blur-sm mt-8`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3
              className={`text-xl font-bold ${currentTheme.text} mb-2`}
            >
              No Analytics Data Available
            </h3>
            <p className={`${currentTheme.textSecondary}`}>
              You don't have any active role assignments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
           {Object.entries(groupedData).map(([projectId, roles]) => {
  const visibleRoles = Object.entries(roles).filter(
    ([role]) => role !== "Intializer"
  );

  return (
    <div key={projectId} className="space-y-6">
      <div
        className={`p-6 rounded-2xl ${palette.gradient} border ${palette.border} backdrop-blur-sm`}
        style={{
          boxShadow: isDarkMode 
            ? "0 10px 40px rgba(0,0,0,0.3)" 
            : "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          className={`text-2xl font-black ${currentTheme.text} flex items-center gap-3`}
        >
          🏗️ Project {projectId}
          <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg">
            {visibleRoles.length} role
            {visibleRoles.length !== 1 ? "s" : ""}
          </span>
        </h2>
      </div>

      {visibleRoles.length === 0 ? (
        <div
          className={`${palette.card} rounded-2xl p-8 border ${palette.border} backdrop-blur-sm`}
          style={{
            boxShadow: isDarkMode 
              ? "0 10px 40px rgba(0,0,0,0.3)" 
              : "0 10px 40px rgba(0,0,0,0.08)",
          }}
        >
          <p className={`${currentTheme.textSecondary} text-sm font-medium`}>
            Analytics are not shown for the Initializer role.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRoles.map(([role, analytics]) => {
            const metrics = Object.entries(analytics || {}).map(
              ([key, value]) => ({
                label: key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                value: value || 0,
                key,
              })
            );

            return (
              <div
                key={role}
                className={`${palette.card} rounded-2xl p-6 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden`}
                style={{
                  boxShadow: isDarkMode 
                    ? "0 10px 40px rgba(0,0,0,0.3)" 
                    : "0 10px 40px rgba(0,0,0,0.08)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`w-14 h-14 ${getRoleGradient(
                        role
                      )} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {getRoleIcon(role)}
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${currentTheme.text}`}
                      >
                        {role.toUpperCase()}
                      </h3>
                      <p
                        className={`text-sm ${currentTheme.textSecondary} font-medium`}
                      >
                        Role Analytics
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {analytics && !analytics.error ? (
                      metrics.map((m) => (
                        <div
                          key={m.key}
                          className={`p-4 rounded-xl border ${palette.border} hover:shadow-md transition-all duration-200 ${currentTheme.hover}`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${currentTheme.textSecondary}`}
                            >
                              {m.label}
                            </span>
                            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {m.value}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <span className="text-red-500 text-sm font-medium">
                          {analytics?.error || "No data available"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
})}

          </div>
        )}
      </div>
    );
  };

  // -------------- Loader --------------
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ background: palette.bg }}
      >
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <p
            className={`mt-6 text-xl font-bold ${currentTheme.text}`}
          >
            Loading Analytics...
          </p>
          <p
            className={`${currentTheme.textSecondary} text-sm mt-2`}
          >
            Preparing your insights
          </p>
        </div>
      </div>
    );
  }

  // Enhanced color palette for snag stats
  const snagColors = {
    raised: {
      gradient:
        "from-violet-500 via-purple-500 to-fuchsia-500",
      bg: isDarkMode
        ? "from-violet-900/20 via-purple-900/20 to-fuchsia-900/20"
        : "from-violet-50 via-purple-50 to-fuchsia-50",
      text: isDarkMode ? "text-violet-400" : "text-violet-700",
      value: isDarkMode ? "text-violet-300" : "text-violet-600",
      icon: "🚀",
    },
    inspected: {
      gradient:
        "from-emerald-500 via-teal-500 to-cyan-500",
      bg: isDarkMode
        ? "from-emerald-900/20 via-teal-900/20 to-cyan-900/20"
        : "from-emerald-50 via-teal-50 to-cyan-50",
      text: isDarkMode ? "text-emerald-400" : "text-emerald-700",
      value: isDarkMode ? "text-emerald-300" : "text-emerald-600",
      icon: "✓",
    },
    notInspected: {
      gradient:
        "from-amber-500 via-orange-500 to-red-400",
      bg: isDarkMode
        ? "from-amber-900/20 via-orange-900/20 to-red-900/20"
        : "from-amber-50 via-orange-50 to-red-50",
      text: isDarkMode ? "text-amber-400" : "text-amber-700",
      value: isDarkMode ? "text-amber-300" : "text-amber-600",
      icon: "⏳",
    },
    progress: {
      gradient:
        "from-blue-500 via-indigo-500 to-purple-500",
      bg: isDarkMode
        ? "from-blue-900/20 via-indigo-900/20 to-purple-900/20"
        : "from-blue-50 via-indigo-50 to-purple-50",
      text: isDarkMode ? "text-blue-400" : "text-blue-700",
      value: isDarkMode ? "text-blue-300" : "text-blue-600",
      icon: "📊",
    },
  };

  const chartColors = {
    inspected: "#10B981",
    notInspected: "#F59E0B",
    pending: "#EF4444",
    wip: "#F59E0B",
    completed: "#10B981",
    categories: [
      "#8B5CF6",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#EC4899",
      "#6366F1",
    ],
  };

  // -------------- Render --------------
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: palette.bg }}
    >
      {/* Header */}
      <div
        className={`${palette.card} border-b ${palette.border} px-8 py-6 sticky top-0 z-40 backdrop-blur-xl bg-opacity-95`}
        style={{
          boxShadow: isDarkMode 
            ? "0 10px 30px rgba(0,0,0,0.3)" 
            : "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-black ${currentTheme.text} tracking-tight`}
                >
                  Analytics Dashboard
                </h1>
                <p
                  className={`${currentTheme.textSecondary} text-sm font-medium`}
                >
                  Real-time insights and performance metrics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) =>
                setSelectedTimeRange(e.target.value)
              }
              className={`px-4 py-2.5 rounded-xl border-2 ${palette.border} ${palette.card} ${currentTheme.text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium shadow-sm hover:shadow-md`}
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
            </select>

            <button
              className={`p-3 rounded-xl ${currentTheme.hover} ${currentTheme.text} transition-all hover:shadow-lg`}
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              className={`p-3 rounded-xl ${currentTheme.hover} ${currentTheme.text} transition-all hover:shadow-lg`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                fetchDashboardData();
                fetchSnagStats();
                fetchQuestionStats();
              }}
              className={`p-3 rounded-xl ${currentTheme.hover} ${currentTheme.text} transition-all hover:shadow-lg`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl ${currentTheme.hover} ${currentTheme.text} transition-all hover:shadow-lg text-xl`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {userId && (
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">
                <span className="text-sm font-bold text-white">
                  ID: {userId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* ===== Enhanced Snag Stats Section ===== */}
        <div className="space-y-8 mb-12">
          {/* Header Card */}
          <div
            className={`${palette.card} rounded-3xl p-10 border ${palette.border} backdrop-blur-sm relative overflow-hidden`}
            style={{
              boxShadow: isDarkMode 
                ? "0 20px 60px rgba(0,0,0,0.4)" 
                : "0 20px 60px rgba(0,0,0,0.1)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <h2
                    className={`text-4xl font-black ${currentTheme.text} mb-2`}
                  >
                    Snag Analytics Hub
                  </h2>
                  <p
                    className={`${currentTheme.textSecondary} text-base flex items-center gap-2 font-medium`}
                  >
                    <span className="inline-block w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    Project {snagStats?.project_id ?? "—"} • Live
                    Monitoring
                  </p>
                </div>
              </div>
              <button
                onClick={fetchSnagStats}
                disabled={snagLoading}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    snagLoading ? "animate-spin" : ""
                  }`}
                />
                {snagLoading ? "Syncing..." : "Refresh Stats"}
              </button>
            </div>
          </div>

          {/* Enhanced KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Snags Raised */}
            <div
              className={`${palette.card} rounded-3xl p-8 border-2 ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] group relative overflow-hidden`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${snagColors.raised.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500`}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${snagColors.raised.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">
                      {snagColors.raised.icon}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-5xl font-black ${snagColors.raised.value}`}
                    >
                      {snagStats?.snags_raised ?? 0}
                    </div>
                  </div>
                </div>
                <h3
                  className={`font-bold text-xl ${snagColors.raised.text} mb-2`}
                >
                  Snags Raised
                </h3>
                <p
                  className={`text-sm ${currentTheme.textSecondary} font-semibold`}
                >
                  Total snags identified
                </p>
              </div>
            </div>

            {/* Inspected */}
            <div
              className={`${palette.card} rounded-3xl p-8 border-2 ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] group relative overflow-hidden`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${snagColors.inspected.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500`}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${snagColors.inspected.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">
                      {snagColors.inspected.icon}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-4xl font-black ${snagColors.inspected.value}`}
                    >
                      {snagStats?.snags_inspected?.count ?? 0}
                    </div>
                    <div
                      className={`text-sm font-bold ${snagColors.inspected.text} mt-1`}
                    >
                      {pct(
                        snagStats?.snags_inspected?.percent
                      )}
                      %
                    </div>
                  </div>
                </div>
                <h3
                  className={`font-bold text-xl ${snagColors.inspected.text} mb-2`}
                >
                  Inspected
                </h3>
                <p
                  className={`text-sm ${currentTheme.textSecondary} font-semibold`}
                >
                  Mode:{" "}
                  {snagStats?.snags_inspected?.mode ?? "—"}
                </p>
              </div>
            </div>

            {/* Not Inspected */}
            <div
              className={`${palette.card} rounded-3xl p-8 border-2 ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] group relative overflow-hidden`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${snagColors.notInspected.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500`}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${snagColors.notInspected.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">
                      {snagColors.notInspected.icon}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-4xl font-black ${snagColors.notInspected.value}`}
                    >
                      {snagStats?.snags_not_inspected?.count ??
                        0}
                    </div>
                    <div
                      className={`text-sm font-bold ${snagColors.notInspected.text} mt-1`}
                    >
                      {pct(
                        snagStats?.snags_not_inspected
                          ?.percent
                      )}
                      %
                    </div>
                  </div>
                </div>
                <h3
                  className={`font-bold text-xl ${snagColors.notInspected.text} mb-2`}
                >
                  Pending Review
                </h3>
                <p
                  className={`text-sm ${currentTheme.textSecondary} font-semibold`}
                >
                  Awaiting inspection
                </p>
              </div>
            </div>

            {/* Units Progress */}
            <div
              className={`${palette.card} rounded-3xl p-8 border-2 ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] group relative overflow-hidden`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${snagColors.progress.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500`}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${snagColors.progress.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">
                      {snagColors.progress.icon}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-5xl font-black ${snagColors.progress.value}`}
                    >
                      {snagStats?.units_progress
                        ?.verification_completed ?? 0}
                    </div>
                  </div>
                </div>
                <h3
                  className={`font-bold text-xl ${snagColors.progress.text} mb-2`}
                >
                  Units Verified
                </h3>
                <p
                  className={`text-sm ${currentTheme.textSecondary} font-semibold`}
                >
                  Verification completed
                </p>
              </div>
            </div>
          </div>

          {/* Charts: Enhanced Pie + Status */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div
              className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${currentTheme.text}`}
                >
                  Inspection Coverage
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={inspectedPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={3}
                  >
                    {inspectedPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? chartColors.inspected
                            : chartColors.notInspected
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${currentTheme.text}`}
                >
                  Status Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusBarData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      isDarkMode ? "#374151" : "#E5E7EB"
                    }
                  />
                  <XAxis
                    dataKey="name"
                    stroke={
                      isDarkMode ? "#9CA3AF" : "#6B7280"
                    }
                    fontSize={12}
                  />
                  <YAxis
                    stroke={
                      isDarkMode ? "#9CA3AF" : "#6B7280"
                    }
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Count"
                    fill="#8B5CF6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Analysis */}
          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold ${currentTheme.text}`}
                  >
                    Category Analysis
                  </h3>
                  <p
                    className={`text-sm ${currentTheme.textSecondary} font-medium`}
                  >
                    Snags by category breakdown
                  </p>
                </div>
              </div>
            </div>
            {categoryBarData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryBarData}>
                  <defs>
                    <linearGradient
                      id="colorCategory"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="95%"
                        stopColor="#EC4899"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      isDarkMode ? "#374151" : "#E5E7EB"
                    }
                  />
                  <XAxis
                    dataKey="name"
                    stroke={
                      isDarkMode ? "#9CA3AF" : "#6B7280"
                    }
                    fontSize={12}
                  />
                  <YAxis
                    stroke={
                      isDarkMode ? "#9CA3AF" : "#6B7280"
                    }
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="snags"
                    name="Snags"
                    fill="url(#colorCategory)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <p
                  className={`${currentTheme.textSecondary} font-bold text-lg`}
                >
                  No category data available
                </p>
              </div>
            )}

            {/* Multi-submission info cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-2xl border-2 ${palette.border} bg-gradient-to-br from-indigo-50 to-purple-50 ${
                  isDarkMode
                    ? "from-indigo-900/20 to-purple-900/20"
                    : ""
                } hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`text-sm font-bold ${currentTheme.textSecondary} uppercase tracking-wide`}
                  >
                    Multi-Submission Level
                  </div>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {snagStats?.category_multi_submissions
                    ?.level_used ?? "—"}
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border-2 ${palette.border} bg-gradient-to-br from-pink-50 to-rose-50 ${
                  isDarkMode
                    ? "from-pink-900/20 to-rose-900/20"
                    : ""
                } hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`text-sm font-bold ${currentTheme.textSecondary} uppercase tracking-wide`}
                  >
                    Category Totals
                  </div>
                </div>
                <div className="space-y-3">
                  {multiTotals.length ? (
                    multiTotals.slice(0, 3).map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <span
                          className={`text-sm font-bold ${currentTheme.text}`}
                        >
                          Cat {t.category_id}
                        </span>
                        <span className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                          {t.count}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div
                      className={`text-sm ${currentTheme.textSecondary} font-medium`}
                    >
                      No data
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stage Status Grid - Enhanced */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {[
              {
                title: "Inspector Stage",
                data: inspectorStageData,
                gradient: "from-cyan-500 to-blue-500",
                icon: "🔍",
              },
              {
                title: "Maker Stage",
                data: makerStageData,
                gradient: "from-orange-500 to-red-500",
                icon: "🔨",
              },
              {
                title: "Supervisor Stage",
                data: supervisorStageData,
                gradient: "from-green-500 to-emerald-500",
                icon: "👁️",
              },
            ].map((blk, i) => (
              <div
                key={i}
                className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500`}
                style={{
                  boxShadow: isDarkMode 
                    ? "0 15px 50px rgba(0,0,0,0.3)" 
                    : "0 15px 50px rgba(0,0,0,0.08)",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${blk.gradient} shadow-xl`}
                  >
                    <span className="text-2xl">
                      {blk.icon}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${currentTheme.text}`}
                    >
                      {blk.title}
                    </h3>
                    <p
                      className={`text-xs ${currentTheme.textSecondary} font-medium`}
                    >
                      Unit status tracking
                    </p>
                  </div>
                </div>
                {blk.data.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={blk.data}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          isDarkMode
                            ? "#374151"
                            : "#E5E7EB"
                        }
                      />
                      <XAxis
                        dataKey="stage"
                        stroke={
                          isDarkMode
                            ? "#9CA3AF"
                            : "#6B7280"
                        }
                        fontSize={11}
                      />
                      <YAxis
                        stroke={
                          isDarkMode
                            ? "#9CA3AF"
                            : "#6B7280"
                        }
                        fontSize={11}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                      />
                      <Bar
                        dataKey="pending"
                        stackId="a"
                        name="Pending"
                        fill={chartColors.pending}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="work_in_progress"
                        stackId="a"
                        name="WIP"
                        fill={chartColors.wip}
                      />
                      <Bar
                        dataKey="completed"
                        stackId="a"
                        name="Done"
                        fill={chartColors.completed}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📈</span>
                    </div>
                    <p
                      className={`text-sm font-medium ${currentTheme.textSecondary}`}
                    >
                      No stage data
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* KPIs Grid - Enhanced */}
          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${currentTheme.text}`}>
                Key Performance Indicators
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {kpiEntries.length ? (
                kpiEntries.map((k, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border-2 ${palette.border} hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${
                      i % 4 === 0
                        ? "from-blue-50 to-cyan-50"
                        : i % 4 === 1
                        ? "from-purple-50 to-pink-50"
                        : i % 4 === 2
                        ? "from-green-50 to-emerald-50"
                        : "from-orange-50 to-red-50"
                    } ${
                      isDarkMode
                        ? "from-slate-800/50 to-slate-700/50"
                        : ""
                    } hover:scale-105 transform`}
                  >
                    <div
                      className={`text-xs font-bold ${currentTheme.textSecondary} mb-3 uppercase tracking-wider`}
                    >
                      {k.label}
                    </div>
                    <div
                      className={`text-3xl font-black ${currentTheme.text}`}
                    >
                      {k.value}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`col-span-full text-center py-8 ${currentTheme.textSecondary} font-medium`}
                >
                  No KPI data available
                </div>
              )}
            </div>
          </div>

          {/* Units Progress - Enhanced */}
          <div
            className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`text-2xl font-bold ${currentTheme.text}`}
                >
                  Units Progress
                </h3>
                <p
                  className={`text-sm ${currentTheme.textSecondary} font-medium`}
                >
                  Lifecycle tracking
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  key: "raised_by_inspector",
                  label: "Raised by Inspector",
                  gradient:
                    "from-blue-500 to-cyan-500",
                  icon: "🔍",
                },
                {
                  key: "verification_completed",
                  label: "Verification Done",
                  gradient:
                    "from-green-500 to-emerald-500",
                  icon: "✓",
                },
                {
                  key: "handover_given",
                  label: "Handover Given",
                  gradient:
                    "from-purple-500 to-pink-500",
                  icon: "🎉",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border-2 ${palette.border} bg-gradient-to-br ${
                    isDarkMode
                      ? "from-slate-800/50 to-slate-700/50"
                      : "from-white to-gray-50"
                  } hover:shadow-xl transition-all duration-300 hover:scale-105 transform`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                    >
                      <span className="text-2xl">
                        {item.icon}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-bold ${currentTheme.textSecondary} uppercase tracking-wider`}
                    >
                      {item.label}
                    </div>
                  </div>
                  <div
                    className={`text-5xl font-black ${currentTheme.text}`}
                  >
                    {snagStats?.units_progress?.[item.key] ??
                      0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Question Hotspots (NEW SECTION) ===== */}
          {aggregatedQuestions.length > 0 && (
            <div
              className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm hover:shadow-2xl transition-all duration-500`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 shadow-xl">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold ${currentTheme.text}`}
                    >
                      Question Hotspots
                    </h3>
                    <p
                      className={`text-sm ${currentTheme.textSecondary} font-medium`}
                    >
                      Most frequently encountered questions (Maker / Checker / Supervisor)
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  {questionLoading ? (
                    <span className={`${currentTheme.textSecondary} font-medium`}>
                      Loading…
                    </span>
                  ) : (
                    <span className={`${currentTheme.textSecondary} font-medium`}>
                      {aggregatedQuestions.length} questions • {selectedTimeRange}
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={`border-b-2 ${palette.border}`}>
                      <th className="py-3 px-4 text-left font-bold">
                        Question
                      </th>
                      <th className="py-3 px-4 text-left font-bold">
                        Checklist
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Total
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Attempts
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Maker
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Checker
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Supervisor
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Flats
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Stages
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedQuestions.map((q, idx) => (
                      <tr
                        key={idx}
                        className={`border-b ${palette.border} hover:${palette.hover} hover:shadow-md transition-all`}
                      >
                        <td className={`py-3 px-4 ${currentTheme.text}`}>
                          <div className="font-bold line-clamp-2">
                            {q.question}
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${currentTheme.textSecondary}`}>
                          <span className="text-xs font-medium">
                            {q.checklist_names || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-lg">
                          {q.total_submissions}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {q.attempts}
                        </td>
                        <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-bold">
                          {q.maker_count}
                        </td>
                        <td className="py-3 px-4 text-right text-purple-600 dark:text-purple-400 font-bold">
                          {q.checker_count}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                          {q.supervisor_count}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {q.distinct_flats}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {q.distinct_stages}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Multi-submission Users - Enhanced */}
          {multiItemsByUser.length > 0 && (
            <div
              className={`${palette.card} rounded-3xl p-8 border ${palette.border} backdrop-blur-sm`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 15px 50px rgba(0,0,0,0.3)" 
                  : "0 15px 50px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold ${currentTheme.text}`}
                  >
                    Multi-Submission by User
                  </h3>
                  <p
                    className={`text-sm ${currentTheme.textSecondary} font-medium`}
                  >
                    User contribution tracking
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr
                      className={`border-b-2 ${palette.border}`}
                    >
                      <th
                        className={`py-4 px-4 text-left text-sm font-black ${currentTheme.text}`}
                      >
                        User ID
                      </th>
                      <th
                        className={`py-4 px-4 text-right text-sm font-black ${currentTheme.text}`}
                      >
                        Items Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiItemsByUser.map((u, i) => (
                      <tr
                        key={i}
                        className={`border-b ${palette.border} hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${
                          isDarkMode
                            ? "hover:from-indigo-900/20 hover:to-purple-900/20"
                            : ""
                        } transition-all hover:shadow-md`}
                      >
                        <td
                          className={`py-4 px-4 ${currentTheme.text} font-bold`}
                        >
                          User #{u.user_id}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black rounded-xl text-sm shadow-lg">
                            {u.items_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ===== Role Dashboards ===== */}
        {!dashboardData ? (
          <div
            className={`text-center py-20 ${palette.card} rounded-3xl border ${palette.border} backdrop-blur-sm mt-8`}
            style={{
              boxShadow: isDarkMode 
                ? "0 15px 50px rgba(0,0,0,0.3)" 
                : "0 15px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3
              className={`text-xl font-bold ${currentTheme.text} mb-2`}
            >
              No Dashboard Data Available
            </h3>
            <p className={`${currentTheme.textSecondary} font-medium`}>
              Unable to load dashboard information.
            </p>
          </div>
        ) : (
          <>
            {dashboardData.role === "MANAGER" &&
              renderManagerDashboard(dashboardData)}
            {dashboardData.role === "SUPER_ADMIN" &&
              renderSuperAdminDashboard(dashboardData)}
            {dashboardData.role === "CLIENT" &&
              renderClientDashboard(dashboardData)}
            {dashboardData.role === "USER" &&
              renderUserDashboard(dashboardData)}
          </>
        )}

        {/* Enhanced Refresh Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => {
              fetchDashboardData();
              fetchSnagStats();
              fetchQuestionStats();
            }}
            disabled={loading || snagLoading}
            className="px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-3xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            {loading || snagLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>
                  Refreshing Dashboard...
                </span>
              </>
            ) : (
              <>
                <RefreshCw className="w-6 h-6" />
                <span>Refresh All Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

// // Enhanced UserDashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { showToast } from "../utils/toast";
// import { getUserDashboard, getSnagStats } from "../api";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Activity,
//   Target,
//   Zap,
//   Download,
//   Filter,
//   RefreshCw,
//   Building,
//   Building2,
//   Factory,
// } from "lucide-react";

// function getActiveProjectId() {
//   try {
//     const urlParams = new URLSearchParams(window.location.search);
//     const q = urlParams.get("project_id");
//     if (q) return Number(q);
//   } catch {}
//   const ls = localStorage.getItem("ACTIVE_PROJECT_ID") || localStorage.getItem("PROJECT_ID");
//   return ls ? Number(ls) : null;
// }

// const UserDashboard = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [snagStats, setSnagStats] = useState(null);
//   const [snagLoading, setSnagLoading] = useState(false);

//   // Enhanced theme with gradients and animations
//   const theme = {
//     light: {
//       bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       bgSecondary: "#f8f9fa",
//       card: "#ffffff",
//       text: "#1a202c",
//       textSecondary: "#718096",
//       border: "#e2e8f0",
//       accent: "#667eea",
//       accentHover: "#5a67d8",
//     },
//     dark: {
//       bg: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
//       bgSecondary: "#0f1419",
//       card: "#1a202c",
//       text: "#f7fafc",
//       textSecondary: "#a0aec0",
//       border: "#2d3748",
//       accent: "#667eea",
//       accentHover: "#5a67d8",
//     },
//   };

//   const currentTheme = isDarkMode ? theme.dark : theme.light;
//   const chartColors = {
//     primary: "#667eea",
//     secondary: "#764ba2",
//     success: "#48bb78",
//     warning: "#ed8936",
//     danger: "#f56565",
//     info: "#4299e1",
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const res = await getUserDashboard();
//       if (res?.status === 200) {
//         setDashboardData(res.data.dashboard);
//         setUserId(res.data.user_id);
//       } else {
//         showToast("Failed to fetch dashboard data", "error");
//       }
//     } catch (e) {
//       console.error(e);
//       showToast(`Error loading dashboard: ${e.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnagStats = async () => {
//     const pid = getActiveProjectId();
//     if (!pid) {
//       setSnagStats(null);
//       return;
//     }
//     try {
//       setSnagLoading(true);
//       const { data } = await getSnagStats(pid);
//       setSnagStats(data);
//     } catch (e) {
//       console.error("getSnagStats error:", e);
//       showToast("Failed to load snag statistics", "error");
//     } finally {
//       setSnagLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     fetchSnagStats();
//   }, [selectedTimeRange]);

//   const KPICard = ({ title, value, trend, icon: Icon, gradient, suffix = "", description }) => (
//     <div
//       className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
//       style={{
//         background: isDarkMode ? currentTheme.card : "#ffffff",
//         border: `1px solid ${currentTheme.border}`,
//       }}
//     >
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//         style={{ background: gradient, opacity: 0.05 }}
//       />
      
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-4">
//           <div
//             className="p-3 rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform duration-500"
//             style={{ background: gradient }}
//           >
//             <Icon className="w-6 h-6 text-white" />
//           </div>
//           {typeof trend === "number" && (
//             <div
//               className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
//                 trend > 0 
//                   ? "bg-green-100 text-green-700" 
//                   : "bg-red-100 text-red-700"
//               }`}
//             >
//               {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//               {Math.abs(trend)}%
//             </div>
//           )}
//         </div>
        
//         <h3 className="text-sm font-medium mb-1" style={{ color: currentTheme.textSecondary }}>
//           {title}
//         </h3>
        
//         <div className="flex items-baseline gap-2">
//           <span className="text-3xl font-bold" style={{ color: currentTheme.text }}>
//             {typeof value === "number" ? value.toLocaleString() : value}
//             {suffix}
//           </span>
//         </div>
        
//         {description && (
//           <p className="text-xs mt-2" style={{ color: currentTheme.textSecondary }}>
//             {description}
//           </p>
//         )}
//       </div>
      
//       <div className="absolute bottom-0 left-0 right-0 h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
//         style={{ background: gradient }}
//       />
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload?.length) {
//       return (
//         <div
//           className="rounded-xl p-4 shadow-2xl backdrop-blur-md"
//           style={{
//             background: isDarkMode ? "rgba(26, 32, 44, 0.95)" : "rgba(255, 255, 255, 0.95)",
//             border: `1px solid ${currentTheme.border}`,
//           }}
//         >
//           <p className="font-semibold mb-2" style={{ color: currentTheme.text }}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm flex items-center gap-2">
//               <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
//               <span style={{ color: currentTheme.textSecondary }}>{entry.name}:</span>
//               <span className="font-semibold" style={{ color: entry.color }}>{entry.value}</span>
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const generateTimeSeriesData = (data, role) => {
//     const days = selectedTimeRange === "1d" ? 1 : selectedTimeRange === "7d" ? 7 : selectedTimeRange === "30d" ? 30 : 90;
//     return Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));

//       let tasks = 0, completed = 0, pending = 0;

//       if (role === "SUPER_ADMIN") {
//         const baseChecklists = data?.total_checklists || 0;
//         tasks = Math.floor((baseChecklists * (0.7 + Math.random() * 0.4)) / days);
//         completed = Math.floor(tasks * (0.75 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "USER" && data?.projects_roles_analytics) {
//         data.projects_roles_analytics.forEach((item) => {
//           if (item.analytics && !item.analytics.error) {
//             Object.values(item.analytics).forEach((val) => {
//               if (typeof val === "number") {
//                 tasks += Math.floor(val * (0.1 + Math.random() * 0.2));
//               }
//             });
//           }
//         });
//         completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
//         pending = Math.max(0, tasks - completed);
//       } else if (role === "CLIENT") {
//         const baseProjects = data?.created_project_count || 0;
//         tasks = Math.floor(baseProjects * 5 * (0.8 + Math.random() * 0.4));
//         completed = Math.floor(tasks * (0.85 + Math.random() * 0.1));
//         pending = Math.max(0, tasks - completed);
//       } else {
//         tasks = Math.floor(((data?.organizations_created || 1) * 3 * (0.8 + Math.random() * 0.4)));
//         completed = Math.floor(tasks * (0.7 + Math.random() * 0.2));
//         pending = Math.max(0, tasks - completed);
//       }

//       return {
//         date: `${date.getMonth() + 1}/${date.getDate()}`,
//         tasks: Math.max(0, tasks),
//         completed: Math.max(0, completed),
//         pending: Math.max(0, pending),
//       };
//     });
//   };

//   const generateRoleDistribution = (data, role) => {
//     if (role === "SUPER_ADMIN") {
//       const totalMakers = data?.total_makers || 0;
//       const totalCheckers = data?.total_checkers || 0;
//       const totalUsers = data?.total_users || 1;
//       const supervisors = Math.floor(totalUsers * 0.1);
//       const initializers = Math.floor(totalUsers * 0.05);
//       return [
//         { name: "Makers", value: totalMakers, color: "#8B5CF6" },
//         { name: "Checkers", value: totalCheckers, color: "#06B6D4" },
//         { name: "Supervisors", value: supervisors, color: "#10B981" },
//         { name: "Initializers", value: initializers, color: "#F59E0B" },
//       ].filter((x) => x.value > 0);
//     } else if (role === "USER" && data?.projects_roles_analytics) {
//       const roleCounts = {};
//       data.projects_roles_analytics.forEach((item) => {
//         roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
//       });
//       const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
//       return Object.entries(roleCounts).map(([r, count], i) => ({
//         name: r,
//         value: count,
//         color: colors[i % colors.length],
//       }));
//     }
//     return [];
//   };

//   const getRoleIcon = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN": return "👑";
//       case "CLIENT": return "👤";
//       case "MANAGER":
//       case "SUPERVISOR": return "👥";
//       case "MAKER": return "🔧";
//       case "CHECKER": return "✅";
//       default: return "📋";
//     }
//   };

//   const getRoleGradient = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN": return "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)";
//       case "CLIENT": return "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)";
//       case "MANAGER": return "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)";
//       case "SUPERVISOR": return "linear-gradient(135deg, #48bb78 0%, #38a169 100%)";
//       case "MAKER": return "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)";
//       case "CHECKER": return "linear-gradient(135deg, #9f7aea 0%, #d53f8c 100%)";
//       default: return "linear-gradient(135deg, #718096 0%, #4a5568 100%)";
//     }
//   };

//   const pct = (n) => (n == null ? "0.0" : Number(n).toFixed(1));

//   const inspectedPieData = useMemo(
//     () =>
//       snagStats
//         ? [
//             { name: "Inspected", value: snagStats?.snags_inspected?.count || 0, color: chartColors.success },
//             { name: "Not Inspected", value: snagStats?.snags_not_inspected?.count || 0, color: chartColors.warning },
//           ]
//         : [],
//     [snagStats]
//   );

//   const statusBarData = useMemo(() => {
//     if (!snagStats?.snags_status) return [];
//     return Object.entries(snagStats.snags_status).map(([k, v]) => ({
//       name: k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
//       count: v?.count ?? 0,
//       percent: v?.percent ?? 0,
//     }));
//   }, [snagStats]);

//   const categoryBarData = useMemo(
//     () =>
//       snagStats?.category_wise?.map((c) => ({
//         name: `Category ${c.category_id}`,
//         snags: c.snags || 0,
//       })) || [],
//     [snagStats]
//   );

//   const toStageStack = (list) =>
//     (list || []).map((s) => ({
//       stage: `Stage ${s.stage_id}`,
//       pending: s.pending || 0,
//       work_in_progress: s.work_in_progress || 0,
//       completed: s.completed || 0,
//     }));

//   const inspectorStageData = useMemo(
//     () => toStageStack(snagStats?.inspector_stage_unit_status),
//     [snagStats]
//   );
//   const makerStageData = useMemo(
//     () => toStageStack(snagStats?.maker_stage_unit_status),
//     [snagStats]
//   );
//   const supervisorStageData = useMemo(
//     () => toStageStack(snagStats?.supervisor_stage_unit_status),
//     [snagStats]
//   );

//   // Role-specific renderers
//   const renderManagerDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "MANAGER");
//     const kpis = [
//       { title: "Organizations", value: data?.organizations_created || 0, trend: 12.5, icon: Building, gradient: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)", description: "Created by you" },
//       { title: "Companies", value: data?.companies_created || 0, trend: 8.3, icon: Building2, gradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)", description: "Under management" },
//       { title: "Entities", value: data?.entities_created || 0, trend: 15.7, icon: Factory, gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)", description: "Total entities" },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((k, i) => <KPICard key={i} {...k} />)}
//         </div>
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div className="rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>Activity Trends</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                 <XAxis dataKey="date" stroke={currentTheme.textSecondary} />
//                 <YAxis stroke={currentTheme.textSecondary} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke={chartColors.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
//                 <Area type="monotone" dataKey="completed" stroke={chartColors.success} strokeWidth={2} fillOpacity={0.6} fill={chartColors.success} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>Performance Overview</h3>
//             <div className="space-y-6">
//               {[
//                 { label: "Management Efficiency", value: 92.5, color: chartColors.primary },
//                 { label: "Success Rate", value: 87.3, color: chartColors.success },
//               ].map((item, i) => (
//                 <div key={i}>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>{item.label}</span>
//                     <span className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</span>
//                   </div>
//                   <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: currentTheme.border }}>
//                     <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, background: item.color }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSuperAdminDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "SUPER_ADMIN");
//     const roleDistribution = generateRoleDistribution(data, "SUPER_ADMIN");
//     const kpis = [
//       { title: "Total Users", value: data?.total_users || 0, trend: 8.5, icon: Users, gradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)", description: "System wide" },
//       { title: "Active Projects", value: data?.total_projects || 0, trend: 12.3, icon: Target, gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)", description: "In progress" },
//       { title: "Total Checklists", value: data?.total_checklists || 0, trend: 15.7, icon: CheckCircle, gradient: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)", description: "All projects" },
//       { title: "Makers", value: data?.total_makers || 0, trend: 5.2, icon: Activity, gradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)", description: "Active makers" },
//       { title: "Checkers", value: data?.total_checkers || 0, trend: 7.8, icon: Zap, gradient: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)", description: "Quality control" },
//       { title: "Efficiency", value: "94.2", trend: 3.1, icon: BarChart3, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", suffix: "%", description: "Overall system" },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//           {kpis.map((k, i) => <KPICard key={i} {...k} />)}
//         </div>
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div className="xl:col-span-2 rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>System Activity</h3>
//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasksAdmin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorCompletedAdmin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={chartColors.success} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                 <XAxis dataKey="date" stroke={currentTheme.textSecondary} />
//                 <YAxis stroke={currentTheme.textSecondary} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke={chartColors.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorTasksAdmin)" />
//                 <Area type="monotone" dataKey="completed" stroke={chartColors.success} strokeWidth={2} fillOpacity={1} fill="url(#colorCompletedAdmin)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>Team Distribution</h3>
//             {roleDistribution.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
//                       {roleDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                         <span className="text-sm" style={{ color: currentTheme.textSecondary }}>{item.name}</span>
//                       </div>
//                       <span className="text-sm font-medium" style={{ color: currentTheme.text }}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8" style={{ color: currentTheme.textSecondary }}>No team data</div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderClientDashboard = (data) => {
//     const timeSeriesData = generateTimeSeriesData(data, "CLIENT");
//     const kpis = [
//       { title: "Projects Created", value: data?.created_project_count || 0, trend: 15.2, icon: Target, gradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)", description: "Total projects" },
//       { title: "Success Rate", value: "94.2", trend: 5.8, icon: CheckCircle, gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)", suffix: "%", description: "Project completion" },
//       { title: "Avg Duration", value: "2.4", trend: -8.3, icon: Clock, gradient: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)", suffix: "mo", description: "Per project" },
//     ];
//     return (
//       <div className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {kpis.map((k, i) => <KPICard key={i} {...k} />)}
//         </div>
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <div className="rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>Project Activity</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeSeriesData}>
//                 <defs>
//                   <linearGradient id="colorTasksClient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={chartColors.info} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={chartColors.info} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                 <XAxis dataKey="date" stroke={currentTheme.textSecondary} />
//                 <YAxis stroke={currentTheme.textSecondary} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="tasks" stroke={chartColors.info} strokeWidth={2} fillOpacity={1} fill="url(#colorTasksClient)" />
//                 <Area type="monotone" dataKey="completed" stroke={chartColors.success} strokeWidth={2} fillOpacity={0.6} fill={chartColors.success} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>Recent Projects</h3>
//             <div className="space-y-4">
//               {data?.created_projects?.length ? (
//                 data.created_projects.slice(0, 5).map((project, index) => (
//                   <div key={index} className="flex items-center gap-4 p-3 rounded-lg transition-colors" style={{ border: `1px solid ${currentTheme.border}` }}>
//                     <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)" }}>🏗️</div>
//                     <div className="flex-1">
//                       <p className="font-medium" style={{ color: currentTheme.text }}>{project.name || `Project ${project.id}`}</p>
//                       <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Created by you • Active</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8" style={{ color: currentTheme.textSecondary }}>No projects created yet</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderUserDashboard = (data) => {
//     const rolesData = data?.projects_roles_analytics || [];
//     const timeSeriesData = generateTimeSeriesData(data, "USER");
//     const roleDistribution = generateRoleDistribution(data, "USER");
//     const groupedData = rolesData.reduce((acc, item) => {
//       const projectId = item.project_id;
//       if (!acc[projectId]) acc[projectId] = {};
//       acc[projectId][item.role] = item.analytics;
//       return acc;
//     }, {});
//     let totalTasks = 0, totalAssigned = 0;
//     rolesData.forEach((item) => {
//       if (item.analytics && !item.analytics.error) {
//         Object.entries(item.analytics).forEach(([key, value]) => {
//           if (typeof value === "number") {
//             totalTasks += value;
//             if (key.includes("assigned") || key.includes("pending_for_me")) {
//               totalAssigned += value;
//             }
//           }
//         });
//       }
//     });

//     const kpis = [
//       { title: "Total Tasks", value: totalTasks, trend: 8.5, icon: Target, gradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)", description: "All assigned" },
//       { title: "Assigned to Me", value: totalAssigned, trend: 12.3, icon: Users, gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)", description: "Current workload" },
//       { title: "Projects", value: Object.keys(groupedData).length, trend: 5.7, icon: BarChart3, gradient: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)", description: "Active projects" },
//       { title: "Efficiency", value: totalTasks > 0 ? Math.round((totalAssigned / totalTasks) * 100) : 0, trend: 3.2, icon: Zap, gradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)", suffix: "%", description: "Task completion" },
//     ];

//     return (
//       <div className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {kpis.map((k, i) => <KPICard key={i} {...k} />)}
//         </div>
//         {rolesData.length > 0 && (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div className="xl:col-span-2 rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//               <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>Activity Timeline</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSeriesData}>
//                   <defs>
//                     <linearGradient id="colorTasksUser" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
//                       <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                   <XAxis dataKey="date" stroke={currentTheme.textSecondary} />
//                   <YAxis stroke={currentTheme.textSecondary} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area type="monotone" dataKey="tasks" stroke={chartColors.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorTasksUser)" />
//                   <Area type="monotone" dataKey="completed" stroke={chartColors.success} strokeWidth={2} fillOpacity={0.6} fill={chartColors.success} />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//             {roleDistribution.length > 0 && (
//               <div className="rounded-2xl p-6 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//                 <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>My Roles</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={5} dataKey="value">
//                       {roleDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {roleDistribution.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                         <span className="text-sm" style={{ color: currentTheme.textSecondary }}>{item.name}</span>
//                       </div>
//                       <span className="text-sm font-medium" style={{ color: currentTheme.text }}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//         {Object.keys(groupedData).length === 0 ? (
//           <div className="text-center py-12 rounded-2xl shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>📈</div>
//             <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.text }}>No Analytics Data Available</h3>
//             <p style={{ color: currentTheme.textSecondary }}>You don't have any active role assignments yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {Object.entries(groupedData).map(([projectId, roles]) => (
//               <div key={projectId} className="space-y-4">
//                 <div className="p-4 rounded-lg" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: `1px solid ${currentTheme.border}` }}>
//                   <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                     🏗️ Project {projectId}
//                     <span className="text-sm font-normal px-3 py-1 rounded-full bg-white bg-opacity-20 text-white">
//                       {Object.keys(roles).length} role{Object.keys(roles).length !== 1 ? "s" : ""}
//                     </span>
//                   </h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {Object.entries(roles).map(([role, analytics]) => {
//                     const metrics = Object.entries(analytics || {}).map(([key, value]) => ({
//                       label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
//                       value: value || 0,
//                       key,
//                     }));
//                     return (
//                       <div key={role} className="rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ background: getRoleGradient(role) }}>
//                             {getRoleIcon(role)}
//                           </div>
//                           <div>
//                             <h3 className="text-lg font-bold" style={{ color: currentTheme.text }}>{role.toUpperCase()}</h3>
//                             <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Role Analytics</p>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-1 gap-3">
//                           {analytics && !analytics.error ? (
//                             metrics.map((m) => (
//                               <div key={m.key} className="p-3 rounded-lg" style={{ border: `1px solid ${currentTheme.border}` }}>
//                                 <div className="flex items-center justify-between">
//                                   <span className="text-sm" style={{ color: currentTheme.textSecondary }}>{m.label}</span>
//                                   <span className="text-xl font-bold" style={{ color: chartColors.primary }}>{m.value}</span>
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="text-center py-4">
//                               <span className="text-red-500 text-sm">{analytics?.error || "No data available"}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: currentTheme.bg }}>
//         <div className="absolute inset-0" style={{ background: isDarkMode ? "radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)" : "radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)" }} />
//         <div className="text-center relative z-10">
//           <div className="relative w-24 h-24 mx-auto mb-6">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${chartColors.primary} transparent transparent transparent` }} />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="w-10 h-10" style={{ color: chartColors.primary }} />
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.text }}>Loading Analytics</h2>
//           <p style={{ color: currentTheme.textSecondary }}>Preparing your insights dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ background: currentTheme.bgSecondary }}>
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes pulse-glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//         .animate-pulse-glow {
//           animation: pulse-glow 2s ease-in-out infinite;
//         }
//       `}</style>

//       {/* Enhanced Header */}
//       <div className="relative overflow-hidden" style={{ background: currentTheme.bg, borderBottom: `1px solid ${currentTheme.border}` }}>
//         <div className="absolute inset-0 opacity-20">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
//         </div>
//         <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-6">
//               <div className="relative">
//                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-bold animate-pulse-glow" style={{ background: "rgba(255, 255, 255, 0.2)" }}>📊</div>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
//                 <p className="text-white text-opacity-90">Real-time insights and performance metrics</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} className="px-4 py-2 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
//                 <option value="1d">24 hours</option>
//                 <option value="7d">7 days</option>
//                 <option value="30d">30 days</option>
//                 <option value="90d">3 months</option>
//               </select>
//               <button className="p-3 rounded-xl bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all">
//                 <Download className="w-5 h-5" />
//               </button>
//               <button className="p-3 rounded-xl bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all">
//                 <Filter className="w-5 h-5" />
//               </button>
//               <button onClick={() => { fetchDashboardData(); fetchSnagStats(); }} className="p-3 rounded-xl bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all">
//                 <RefreshCw className="w-5 h-5" />
//               </button>
//               <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-xl bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all text-xl">
//                 {isDarkMode ? "☀️" : "🌙"}
//               </button>
//             </div>
//           </div>
//           {userId && (
//             <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white bg-opacity-20 text-white backdrop-blur-sm">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//               <span className="text-sm font-semibold">User ID: {userId}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//         {/* Role-based Dashboard */}
//         {dashboardData && (
//           <>
//             {dashboardData.role === "MANAGER" && renderManagerDashboard(dashboardData)}
//             {dashboardData.role === "SUPER_ADMIN" && renderSuperAdminDashboard(dashboardData)}
//             {dashboardData.role === "CLIENT" && renderClientDashboard(dashboardData)}
//             {dashboardData.role === "USER" && renderUserDashboard(dashboardData)}
//           </>
//         )}

//         {/* Snag Statistics Section */}
//         {snagStats && (
//           <div className="rounded-2xl p-8 shadow-xl" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg" style={{ background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)" }}>🧩</div>
//                 <div>
//                   <h2 className="text-2xl font-bold" style={{ color: currentTheme.text }}>Snag Statistics</h2>
//                   <p style={{ color: currentTheme.textSecondary }}>Project {snagStats?.project_id ?? "—"} Overview</p>
//                 </div>
//               </div>
//               <button onClick={fetchSnagStats} className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#ffffff" }}>
//                 {snagLoading ? "Refreshing..." : "Refresh Snags"}
//               </button>
//             </div>

//             {/* Snag KPIs */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <KPICard title="Snags Raised" value={snagStats?.snags_raised ?? 0} icon={BarChart3} gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)" description="Total raised" />
//               <KPICard title="Inspected" value={`${snagStats?.snags_inspected?.count ?? 0} (${pct(snagStats?.snags_inspected?.percent)}%)`} icon={CheckCircle} gradient="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)" description={`Mode: ${snagStats?.snags_inspected?.mode ?? "—"}`} />
//               <KPICard title="Not Inspected" value={`${snagStats?.snags_not_inspected?.count ?? 0} (${pct(snagStats?.snags_not_inspected?.percent)}%)`} icon={Clock} gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)" description="Pending inspection" />
//               <KPICard title="Verification Completed" value={snagStats?.units_progress?.verification_completed ?? 0} icon={Activity} gradient="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)" description="Units verified" />
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//               <div className="rounded-xl p-6" style={{ background: isDarkMode ? "rgba(45, 55, 72, 0.5)" : "rgba(247, 250, 252, 0.5)", border: `1px solid ${currentTheme.border}` }}>
//                 <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Inspection Coverage</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <PieChart>
//                     <Pie data={inspectedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} strokeWidth={2}>
//                       {inspectedPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="rounded-xl p-6" style={{ background: isDarkMode ? "rgba(45, 55, 72, 0.5)" : "rgba(247, 250, 252, 0.5)", border: `1px solid ${currentTheme.border}` }}>
//                 <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Snags Status Distribution</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={statusBarData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                     <XAxis dataKey="name" stroke={currentTheme.textSecondary} />
//                     <YAxis stroke={currentTheme.textSecondary} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="count" name="Count" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Category-wise */}
//             {categoryBarData.length > 0 && (
//               <div className="rounded-xl p-6 mt-8" style={{ background: isDarkMode ? "rgba(45, 55, 72, 0.5)" : "rgba(247, 250, 252, 0.5)", border: `1px solid ${currentTheme.border}` }}>
//                 <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Category-wise Snags</h3>
//                 <ResponsiveContainer width="100%" height={280}>
//                   <BarChart data={categoryBarData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                     <XAxis dataKey="name" stroke={currentTheme.textSecondary} />
//                     <YAxis stroke={currentTheme.textSecondary} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="snags" name="Snags" fill={chartColors.info} radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             )}

//             {/* Stage Status Cards */}
//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
//               {[
//                 { title: "Inspector Stage Status", data: inspectorStageData, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
//                 { title: "Maker Stage Status", data: makerStageData, gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)" },
//                 { title: "Supervisor Stage Status", data: supervisorStageData, gradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)" },
//               ].map((block, i) => (
//                 <div key={i} className="rounded-xl p-6 shadow-lg" style={{ background: isDarkMode ? currentTheme.card : "#ffffff", border: `1px solid ${currentTheme.border}` }}>
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: block.gradient }}>{i + 1}</div>
//                     <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>{block.title}</h3>
//                   </div>
//                   {block.data.length ? (
//                     <ResponsiveContainer width="100%" height={240}>
//                       <BarChart data={block.data}>
//                         <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
//                         <XAxis dataKey="stage" stroke={currentTheme.textSecondary} />
//                         <YAxis stroke={currentTheme.textSecondary} />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="pending" stackId="a" fill={chartColors.danger} radius={[4, 4, 0, 0]} />
//                         <Bar dataKey="work_in_progress" stackId="a" fill={chartColors.warning} />
//                         <Bar dataKey="completed" stackId="a" fill={chartColors.success} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="text-center py-12" style={{ color: currentTheme.textSecondary }}>No stage data available</div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Floating Action Button */}
//       <button onClick={() => { fetchDashboardData(); fetchSnagStats(); }} disabled={loading || snagLoading} className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed animate-float" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
//         {loading || snagLoading ? (
//           <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
//         ) : (
//           <RefreshCw className="w-6 h-6" />
//         )}
//       </button>
//     </div>
//   );
// };

// export default UserDashboard;