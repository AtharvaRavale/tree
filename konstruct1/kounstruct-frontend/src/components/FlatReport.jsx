// src/pages/FlatReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../ThemeContext";

const API_BASE = "https://konstruct.world";

const authHeaders = () => ({
  Authorization: `Bearer ${
    localStorage.getItem("ACCESS_TOKEN") ||
    localStorage.getItem("TOKEN") ||
    localStorage.getItem("token") ||
    ""
  }`,
});

function safeNumber(n, fallback = 0) {
  if (typeof n === "number" && !Number.isNaN(n)) return n;
  const parsed = Number(n);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function fmtInt(n) {
  return safeNumber(n).toLocaleString("en-IN");
}

const FlatReport = () => {
  const { id: projectId, flatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [roomStats, setRoomStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const projectFromState = location.state?.project || null;
  const flatMeta = location.state?.flatMeta || null;
  const filtersFromOverview = location.state?.filters || {};

  const textColor = theme === "dark" ? "#f1f5f9" : "#0f172a";
  const secondaryTextColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const cardBg =
    theme === "dark" ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)";
  const borderColor = theme === "dark" ? "#475569" : "#cbd5e1";

  // 👉 API call: /checklists/stats/flat-room/
  useEffect(() => {
    const fetchStats = async () => {
      if (!projectId || !flatId) return;
      setLoading(true);
      setError("");

      try {
        const params = {
          project_id: projectId,
          flat_id: flatId,
        };

        // overview se aaye filters
        if (filtersFromOverview.stageId) {
          params.stage_id = filtersFromOverview.stageId;
        }
        if (filtersFromOverview.buildingId) {
          params.building_id = filtersFromOverview.buildingId;
        }

        const res = await axios.get(
          `${API_BASE}/checklists/stats/flat-room/`,
          {
            params,
            headers: authHeaders(),
          }
        );

        setRoomStats(res.data || null);
      } catch (err) {
        console.error("Failed to load flat room stats", err);
        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load room-wise stats for this flat.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [projectId, flatId, filtersFromOverview]);

  const rooms = useMemo(
    () => (roomStats?.rooms && Array.isArray(roomStats.rooms) ? roomStats.rooms : []),
    [roomStats]
  );

  const totalItems = useMemo(
    () => rooms.reduce((sum, r) => sum + safeNumber(r.total), 0),
    [rooms]
  );
  const totalOpen = useMemo(
    () => rooms.reduce((sum, r) => sum + safeNumber(r.open), 0),
    [rooms]
  );
  const totalClosed = useMemo(
    () => rooms.reduce((sum, r) => sum + safeNumber(r.closed), 0),
    [rooms]
  );

  const flatLabel = flatMeta
    ? `Flat ${flatMeta.number || flatId}${
        flatMeta.typeName ? ` • ${flatMeta.typeName}` : ""
      }`
    : `Flat #${flatId}`;

  const levelLabel = flatMeta?.levelName || "";
  const projectName =
    projectFromState?.name || projectFromState?.project_name || `Project #${projectId}`;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #020617 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-8">
        {/* Header */}
        <div
          className="rounded-3xl mb-6 border backdrop-blur-xl px-6 py-5 flex items-start justify-between gap-4"
          style={{ background: cardBg, borderColor }}
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-1 inline-flex items-center justify-center w-10 h-10 rounded-2xl border text-lg font-bold"
              style={{ borderColor, color: textColor }}
            >
              ←
            </button>
            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-wide mb-1"
                style={{ color: secondaryTextColor }}
              >
                Flat Report • {projectName}
              </div>
              <h1
                className="text-2xl md:text-3xl font-black tracking-tight"
                style={{ color: textColor }}
              >
                {flatLabel}
              </h1>
              {levelLabel && (
                <div
                  className="mt-1 text-sm font-semibold"
                  style={{ color: secondaryTextColor }}
                >
                  {levelLabel}
                </div>
              )}
              {filtersFromOverview.stageId && (
                <div
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(30,64,175,0.35)"
                        : "rgba(219,234,254,0.9)",
                    color: secondaryTextColor,
                  }}
                >
                  <span>Filters from overview:</span>
                  <span className="font-bold">
                    Stage #{filtersFromOverview.stageId}
                  </span>
                  {filtersFromOverview.buildingId && (
                    <span className="font-bold">
                      • Building #{filtersFromOverview.buildingId}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-right text-xs font-semibold" style={{ color: secondaryTextColor }}>
            <div>Project ID: {projectId}</div>
            <div>Flat ID: {flatId}</div>
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center">
            <div className="mb-4 inline-block">
              <div
                className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                style={{
                  borderColor: theme === "dark" ? "#475569" : "#cbd5e1",
                  borderTopColor: "transparent",
                }}
              />
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: secondaryTextColor }}
            >
              Loading room-wise stats for this flat...
            </div>
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-3xl border px-6 py-5 backdrop-blur-xl mb-6"
            style={{
              background:
                theme === "dark"
                  ? "rgba(127,29,29,0.5)"
                  : "rgba(254,226,226,0.9)",
              borderColor: "#ef4444",
            }}
          >
            <div
              className="text-sm font-semibold mb-1"
              style={{ color: "#b91c1c" }}
            >
              {error}
            </div>
            <div
              className="text-xs"
              style={{ color: secondaryTextColor }}
            >
              Please check if checklist items exist for this flat and try again.
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div
                className="rounded-3xl border px-5 py-4"
                style={{ background: cardBg, borderColor }}
              >
                <div
                  className="text-[11px] font-semibold mb-1 uppercase tracking-wide"
                  style={{ color: secondaryTextColor }}
                >
                  Total Checks
                </div>
                <div
                  className="text-3xl font-black"
                  style={{ color: textColor }}
                >
                  {fmtInt(totalItems)}
                </div>
                <div
                  className="text-[11px] mt-1"
                  style={{ color: secondaryTextColor }}
                >
                  Across all rooms
                </div>
              </div>

              <div
                className="rounded-3xl border px-5 py-4"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #064e3b, #047857)"
                      : "linear-gradient(135deg, #bbf7d0, #4ade80)",
                  borderColor: theme === "dark" ? "#22c55e" : "#16a34a",
                }}
              >
                <div className="text-[11px] font-semibold mb-1 uppercase tracking-wide text-emerald-50">
                  Closed
                </div>
                <div className="text-3xl font-black text-emerald-50">
                  {fmtInt(totalClosed)}
                </div>
                <div className="text-[11px] mt-1 text-emerald-100">
                  {totalItems > 0
                    ? `${Math.round((totalClosed / totalItems) * 100)}% complete`
                    : "No items"}
                </div>
              </div>

              <div
                className="rounded-3xl border px-5 py-4"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #7c2d12, #b45309)"
                      : "linear-gradient(135deg, #fed7aa, #fb923c)",
                  borderColor: theme === "dark" ? "#f97316" : "#ea580c",
                }}
              >
                <div className="text-[11px] font-semibold mb-1 uppercase tracking-wide text-orange-50">
                  Open / Pending
                </div>
                <div className="text-3xl font-black text-orange-50">
                  {fmtInt(totalOpen)}
                </div>
                <div className="text-[11px] mt-1 text-orange-100">
                  {totalItems > 0
                    ? `${Math.round((totalOpen / totalItems) * 100)}% of total`
                    : "No items"}
                </div>
              </div>
            </div>

            {/* Room-wise table */}
            <div
              className="rounded-3xl border overflow-hidden backdrop-blur-xl"
              style={{ borderColor, background: cardBg }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{
                  borderColor,
                  background:
                    theme === "dark" ? "rgba(15,23,42,0.9)" : "#f9fafb",
                }}
              >
                <div
                  className="text-lg font-black"
                  style={{ color: textColor }}
                >
                  Room-wise Snag Summary
                </div>
                <div
                  className="text-[11px] font-semibold mt-1"
                  style={{ color: secondaryTextColor }}
                >
                  Each row = ek room, with total / open / closed checks +
                  category-wise breakup.
                </div>
              </div>

              <div className="max-h-[480px] overflow-auto">
                <table className="min-w-full text-sm">
                  <thead
                    className="sticky top-0 z-10"
                    style={{
                      background:
                        theme === "dark" ? "#020617" : "#e5e7eb",
                    }}
                  >
                    <tr>
                      <th
                        className="text-left px-6 py-3 text-xs font-bold"
                        style={{ color: textColor }}
                      >
                        Room
                      </th>
                      <th
                        className="text-right px-4 py-3 text-xs font-bold"
                        style={{ color: textColor }}
                      >
                        Total
                      </th>
                      <th
                        className="text-right px-4 py-3 text-xs font-bold"
                        style={{ color: textColor }}
                      >
                        Open
                      </th>
                      <th
                        className="text-right px-4 py-3 text-xs font-bold"
                        style={{ color: textColor }}
                      >
                        Closed
                      </th>
                      <th
                        className="text-left px-6 py-3 text-xs font-bold"
                        style={{ color: textColor }}
                      >
                        By Category
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm font-semibold"
                          style={{ color: secondaryTextColor }}
                        >
                          No checklist items found for this flat (with current
                          filters).
                        </td>
                      </tr>
                    )}

                    {rooms.map((room) => {
                      const roomLabel =
                        room.room_name ||
                        room.room_label ||
                        room.room_title ||
                        `Room #${room.room_id}`;

                      const byCat = Array.isArray(room.by_category)
                        ? room.by_category
                        : [];

                      return (
                        <tr
                          key={room.room_id}
                          className="border-t"
                          style={{
                            borderColor:
                              theme === "dark" ? "#020617" : "#e5e7eb",
                          }}
                        >
                          <td className="px-6 py-3 align-top">
                            <div
                              className="font-semibold"
                              style={{ color: textColor }}
                            >
                              {roomLabel}
                            </div>
                          </td>
                          <td
                            className="px-4 py-3 text-right align-top"
                            style={{ color: textColor }}
                          >
                            {fmtInt(room.total)}
                          </td>
                          <td
                            className="px-4 py-3 text-right align-top"
                            style={{ color: "#f97316" }}
                          >
                            {fmtInt(room.open)}
                          </td>
                          <td
                            className="px-4 py-3 text-right align-top"
                            style={{ color: "#10b981" }}
                          >
                            {fmtInt(room.closed)}
                          </td>
                          <td className="px-6 py-3 align-top">
                            <div className="flex flex-wrap gap-2">
                              {byCat.length === 0 && (
                                <span
                                  className="text-[11px]"
                                  style={{ color: secondaryTextColor }}
                                >
                                  No category breakdown
                                </span>
                              )}
                              {byCat.map((cat, idx) => {
                                const label =
                                  cat.category_name ||
                                  cat.category_label ||
                                  cat.category_title ||
                                  (cat.category_id
                                    ? `Category #${cat.category_id}`
                                    : "Category");
                                return (
                                  <span
                                    key={`${room.room_id}-${idx}`}
                                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                                    style={{
                                      background:
                                        theme === "dark"
                                          ? "rgba(30,64,175,0.35)"
                                          : "rgba(219,234,254,0.9)",
                                      color: textColor,
                                    }}
                                  >
                                    {label} • {fmtInt(cat.count || 0)}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlatReport;
