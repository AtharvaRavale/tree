// src/components/MIRInboxPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getMyAssignedMIRs,
  acceptMIR,
  rejectMIR,
  forwardMIR,
} from "../api";
import { useTheme } from "../ThemeContext";

// Theme constants
const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";

export default function MIRInboxPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [statusFilter, setStatusFilter] = useState("");
  const [projectIdFilter, setProjectIdFilter] = useState("");

  // action loading
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // 🔹 project id -> name map (from localStorage ACCESSES / USER_DATA)
  const [projectNameMap, setProjectNameMap] = useState({});
  // 🔹 dropdown options for filter
  const [projectOptions, setProjectOptions] = useState([]);

  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardBg = theme === "dark" ? "#23232c" : "#ffffff";

  // 🔹 1) Load project name map + options from localStorage once
  useEffect(() => {
    try {
      let accesses = [];

      // Prefer ACCESSES key if present
      const accessesRaw = localStorage.getItem("ACCESSES");
      if (accessesRaw) {
        accesses = JSON.parse(accessesRaw);
      } else {
        // Fallback: USER_DATA.accesses
        const userRaw = localStorage.getItem("USER_DATA");
        if (userRaw) {
          const user = JSON.parse(userRaw);
          if (Array.isArray(user?.accesses)) {
            accesses = user.accesses;
          }
        }
      }

      if (Array.isArray(accesses) && accesses.length) {
        const map = {};
        const optsMap = new Map(); // to keep unique projects

        accesses.forEach((acc) => {
          if (acc.project_id && acc.project_name) {
            const key = String(acc.project_id);
            if (!map[key]) map[key] = acc.project_name;
            if (!optsMap.has(key)) {
              optsMap.set(key, acc.project_name);
            }
          }
        });

        setProjectNameMap(map);
        setProjectOptions(
          Array.from(optsMap, ([id, name]) => ({ id, name }))
        );
      }
    } catch (e) {
      console.error("Error reading ACCESSES / USER_DATA from localStorage", e);
    }
  }, []);

  // 🔹 2) Load MIR list
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchList = async (extraParams = {}) => {
    try {
      setLoading(true);
      const res = await getMyAssignedMIRs(extraParams);
      const data = res?.data || [];
      const rows = Array.isArray(data) ? data : data.results || [];
      setRows(rows);
    } catch (err) {
      console.error("Failed to load MIR inbox", err);
      toast.error("MIR inbox load nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    if (!id) return;
    navigate(`/mir/${id}`);
  };

  const handleApplyFilters = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (projectIdFilter) params.project_id = projectIdFilter; // string id bhi chalega
    fetchList(params);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setProjectIdFilter("");
    fetchList();
  };

  const handleAccept = async (row) => {
    if (!row?.id) return;
    if (!window.confirm(`Accept MIR #${row.mir_number || row.id}?`)) return;

    setActionLoadingId(row.id);
    try {
      await acceptMIR(row.id, {
        comment: "Accepted via inbox.",
      });
      toast.success("MIR accept ho gaya.");
      await fetchList();
    } catch (err) {
      console.error("Accept MIR error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Accept karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (row) => {
    if (!row?.id) return;
    const reason = window.prompt("Reject reason (optional):", "");
    if (reason === null) return; // cancelled

    setActionLoadingId(row.id);
    try {
      await rejectMIR(row.id, {
        comment: reason || "Rejected via inbox.",
      });
      toast.success("MIR reject ho gaya.");
      await fetchList();
    } catch (err) {
      console.error("Reject MIR error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Reject karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleForward = (row) => {
    if (!row?.id) return;
    navigate(`/mir/${row.id}?mode=forward`);
  };

  // Helper function for status badges
  const getStatusStyle = (status) => {
    const baseStyle = {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    };

    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACCEPTED":
        return { ...baseStyle, background: "#d1fae5", color: "#065f46" };
      case "REJECTED":
        return { ...baseStyle, background: "#fee2e2", color: "#991b1b" };
      case "PENDING":
        return { ...baseStyle, background: "#fef9c3", color: "#854d0e" };
      case "UNDER_REVIEW":
        return { ...baseStyle, background: "#e0f2fe", color: "#075985" };
      case "DRAFT":
        return { ...baseStyle, background: "#f3f4f6", color: "#374151" };
      case "CLOSED":
        return { ...baseStyle, background: "#e5e7eb", color: "#1f2937" };
      default:
        return { ...baseStyle, background: "#f3f4f6", color: "#6b7280" };
    }
  };

  // Stats calculation
  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "PENDING").length,
    approved: rows.filter(
      (r) => r.status === "APPROVED" || r.status === "ACCEPTED"
    ).length,
    rejected: rows.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div style={{ ...styles.container, background: bgColor }}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}> Material Inspection Requests</h1>
          <p style={styles.subtitle}>Manage and review all assigned MIRs</p>
        </div>
        <button
          onClick={() => navigate("/mir/create")}
          style={styles.createButton}
        >
          + Create New MIR
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div
          style={{
            ...styles.statCard,
            background: cardBg,
            borderLeft: `4px solid ${ORANGE}`,
          }}
        >
          <div style={styles.statLabel}>Total MIRs</div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>
        <div
          style={{
            ...styles.statCard,
            background: cardBg,
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <div style={styles.statLabel}>Pending Review</div>
          <div style={styles.statValue}>{stats.pending}</div>
        </div>
        <div
          style={{
            ...styles.statCard,
            background: cardBg,
            borderLeft: "4px solid #10b981",
          }}
        >
          <div style={styles.statLabel}>Approved</div>
          <div style={styles.statValue}>{stats.approved}</div>
        </div>
        <div
          style={{
            ...styles.statCard,
            background: cardBg,
            borderLeft: "4px solid #ef4444",
          }}
        >
          <div style={styles.statLabel}>Rejected</div>
          <div style={styles.statValue}>{stats.rejected}</div>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ ...styles.filtersCard, background: cardBg }}>
        <div style={styles.filtersHeader}>
          <h3 style={styles.filtersTitle}> Filters</h3>
          {(statusFilter || projectIdFilter) && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={styles.clearButton}
            >
              ✕ Clear All
            </button>
          )}
        </div>

        <div style={styles.filtersGrid}>
          {/* Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* 🔹 Project Filter - dropdown with all project names */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Project</label>
            <select
              value={projectIdFilter}
              onChange={(e) => setProjectIdFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Projects</option>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>&nbsp;</label>
            <button
              type="button"
              onClick={handleApplyFilters}
              style={styles.applyButton}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ ...styles.tableCard, background: cardBg }}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading MIRs...</p>
          </div>
        ) : rows.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No MIRs Found</h3>
            <p style={styles.emptyText}>
              {statusFilter || projectIdFilter
                ? "Try adjusting your filters"
                : "No MIRs are currently assigned to you"}
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>MIR Number</th>
                  <th style={styles.th}>Project</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created By</th>
                  <th style={styles.th}>Created Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const projName =
                    projectNameMap[String(row.project_id)] || null;

                  return (
                    <tr
                      key={row.id}
                      style={{
                        ...styles.tableRow,
                        background:
                          index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      }}
                    >
                      {/* MIR Number */}
                      <td style={styles.td}>
                        <div style={styles.mirNumber}>
                          #{row.mir_number || row.id}
                        </div>
                      </td>

                      {/* Project */}
                      <td style={styles.td}>
                        <div style={styles.projectBadge}>
                          {projName
                            ? projName
                            : row.project_id
                            ? `Project ${row.project_id}`
                            : "—"}
                        </div>
                      </td>

                      {/* Location */}
                      <td style={styles.td}>
                        <div style={styles.location}>
                          {row.location || "—"}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={styles.td}>
                        <span style={getStatusStyle(row.status)}>
                          {row.status || "N/A"}
                        </span>
                      </td>

                      {/* Created By */}
                      <td style={styles.td}>
                        <div style={styles.createdBy}>
                          {row.created_by_name || "—"}
                        </div>
                      </td>

                      {/* Created Date */}
                      <td style={styles.td}>
                        <div style={styles.date}>
                          {row.created_at
                            ? new Date(row.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </div>
                        <div style={styles.time}>
                          {row.created_at
                            ? new Date(row.created_at).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={styles.td}>
                        <div style={styles.actionsContainer}>
                          <button
                            type="button"
                            onClick={() => handleView(row.id)}
                            style={styles.viewButton}
                            title="View Details"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAccept(row)}
                            disabled={actionLoadingId === row.id}
                            style={styles.acceptButton}
                            title="Accept MIR"
                          >
                            {actionLoadingId === row.id ? "..." : "✓ Accept"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(row)}
                            disabled={actionLoadingId === row.id}
                            style={styles.rejectButton}
                            title="Reject MIR"
                          >
                            {actionLoadingId === row.id ? "..." : "✕ Reject"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleForward(row)}
                            style={styles.forwardButton}
                            title="Forward to Another User"
                          >
                             Forward
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!loading && rows.length > 0 && (
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Showing <strong>{rows.length}</strong> MIR
            {rows.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

// STYLES OBJECT
const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    marginBottom: "4px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },

  createButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #ffbe63 0%, #ff9f1c 100%)",
    color: "black",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(248, 180, 80, 0.5)",
    transition: "all 0.2s ease",
  },

  // Stats Cards
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "500",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
  },

  // Filters
  filtersCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "24px",
  },

  filtersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  filtersTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },

  clearButton: {
    padding: "6px 12px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
  },

  filterLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px",
  },

  filterSelect: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1e293b",
    background: "white",
    cursor: "pointer",
    transition: "border-color 0.2s ease",
  },

  filterInput: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1e293b",
    background: "white",
    transition: "border-color 0.2s ease",
  },

  applyButton: {
    padding: "10px 20px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Table
  tableCard: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  tableHeaderRow: {
    background: "linear-gradient(to right, #f8fafc, #f1f5f9)",
    borderBottom: "2px solid #e2e8f0",
  },

  th: {
    textAlign: "left",
    padding: "16px 12px",
    fontWeight: "600",
    color: "#475569",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },

  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.2s ease",
  },

  td: {
    padding: "16px 12px",
    verticalAlign: "middle",
  },

  mirNumber: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1e293b",
  },

  projectBadge: {
    display: "inline-block",
    padding: "4px 10px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },

  location: {
    fontSize: "14px",
    color: "#64748b",
  },

  createdBy: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  },

  date: {
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "500",
  },

  time: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "2px",
  },

  actionsContainer: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  viewButton: {
    padding: "6px 12px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  acceptButton: {
    padding: "6px 12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  rejectButton: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  forwardButton: {
    padding: "6px 12px",
    background: ORANGE,
    color: "#111827",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  // Loading State
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f1f5f9",
    borderTop: `4px solid ${ORANGE}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },

  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "8px",
  },

  emptyText: {
    fontSize: "14px",
    color: "#64748b",
  },

  // Footer
  footer: {
    marginTop: "20px",
    textAlign: "center",
  },

  footerText: {
    fontSize: "13px",
    color: "#64748b",
  },
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(
      `@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }`,
      styleSheet.cssRules.length
    );
  } catch (e) {
    // Animation already exists or error
  }
}
