"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";

type Row = {
  id: string;
  createdAt: number;
  tripTitle: string;
  country: string;
  detailUrl: string;
  groupSize: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  fixedDate: string;
  travellers: number;
  breakdown: { M: number; F: number; CM: number; CF: number };
  total: number;
  pp: number;
  status: string;
  notes: string;
  adminNotes: string;
};

type ManagerProps = {
  rows: Row[];
  counts: { total: number; pending: number; confirmed: number; completed: number; today: number; value: number };
  todayIso: string;
  last7: string;
  firstOfMonth: string;
  tripOptions: string[];
  fixedTripTitles: string[];
  params: { s: string; status: string; tripFilter: string; dateFrom: string; dateTo: string };
  totalCount: number;
};

const STATUSES = [
  { value: "new", label: "New" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

function formatUsd(n: number): string {
  return "US$ " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateLong(ms: number): string {
  return (
    new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

export default function BookingsManager({
  rows,
  counts,
  todayIso,
  last7,
  firstOfMonth,
  tripOptions,
  fixedTripTitles,
  params,
  totalCount,
}: ManagerProps) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ status: "", adminNotes: "" });

  const { isSuperAdmin, permissions } = useAdminPerms();
  const canEditBooking = isSuperAdmin || hasPerm(permissions, "bookings", "edit");
  const canDeleteBooking = isSuperAdmin || hasPerm(permissions, "bookings", "delete");

  // ---- Client-side instant filters (no reload) ----
  const [filters, setFilters] = useState({
    s: params.s || "",
    status: params.status || "",
    tripFilter: params.tripFilter || "",
    dateFrom: params.dateFrom || "",
    dateTo: params.dateTo || "",
  });
  const setFilter = (key: keyof typeof filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const visibleRows = useMemo(() => {
    const s = filters.s.trim().toLowerCase();
    const tf = filters.tripFilter.trim();
    return rows.filter((r) => {
      if (filters.status && r.status !== filters.status) return false;
      if (tf) {
        if (tf === "__fixed__") {
          if (!r.fixedDate) return false;
        } else if (r.tripTitle.toLowerCase() !== tf.toLowerCase()) return false;
      }
      if (s) {
        const hay = [r.fullName, r.email, r.phone, r.country, r.tripTitle].join(" ").toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (filters.dateFrom && r.travelDate < filters.dateFrom) return false;
      if (filters.dateTo && r.travelDate > filters.dateTo) return false;
      return true;
    });
  }, [rows, filters]);

  const clearFilters = () =>
    setFilters({ s: "", status: "", tripFilter: "", dateFrom: "", dateTo: "" });

  useEffect(() => {
    document.body.classList.toggle("ftb-modal-open", !!openId);
    return () => document.body.classList.remove("ftb-modal-open");
  }, [openId]);

  // Keep modal status/notes in sync with the opened row
  useEffect(() => {
    if (openId) {
      const row = rows.find((r) => r.id === openId);
      if (row) setForm({ status: row.status, adminNotes: row.adminNotes });
    }
  }, [openId, rows]);

  const escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpenId(null);
  };
  useEffect(() => {
    if (openId) {
      window.addEventListener("keydown", escHandler);
      return () => window.removeEventListener("keydown", escHandler);
    }
  }, [openId, escHandler]);

  const openRow = rows.find((r) => r.id === openId) || null;

  async function saveChanges() {
    if (!openRow) return;
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch(`/api/admin/bookings/${openRow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status, adminNotes: form.adminNotes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update booking");
      }
      setNotice("Booking updated successfully.");
      router.refresh();
    } catch (err) {
      setNotice(String(err instanceof Error ? err.message : err));
    } finally {
      setBusy(false);
    }
  }

  async function removeBooking() {
    if (!openRow) return;
    if (!window.confirm("Delete this booking?")) return;
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch(`/api/admin/bookings/${openRow.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete booking");
      }
      setOpenId(null);
      router.refresh();
    } catch (err) {
      setNotice(String(err instanceof Error ? err.message : err));
    } finally {
      setBusy(false);
    }
  }

  const statCard = (action: (() => void) | null, label: string, value: string | number, extra = "") => {
    const cls = `ftb-quick-card ${extra}`.trim();
    if (!action) {
      return (
        <div key={label} className={cls}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      );
    }
    return (
      <button key={label} type="button" onClick={action} className={cls}>
        <span>{label}</span>
        <strong>{value}</strong>
      </button>
    );
  };

  const hasActiveFilters =
    Boolean(filters.s) ||
    Boolean(filters.status) ||
    Boolean(filters.tripFilter) ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo);

  return (
    <div className="wrap ftb-admin-wrap ftb-booking-list-page">
      <div className="ftb-list-header">
        <div>
          <span className="ftb-kicker-dark">FlyUp Trekking Booking</span>
          <h1>Booking Requests</h1>
          <p>Review bookings, open full details, update status, and manage customer requests from one clean list.</p>
        </div>
        <a className="ftb-admin-btn ghost" href="/admin/site-settings">
          Settings
        </a>
      </div>

      <div className="ftb-quick-cards">
        {statCard(() => clearFilters(), "Total", counts.total)}
        {statCard(() => {
          setFilter("status", "pending");
          setFilter("dateFrom", "");
          setFilter("dateTo", "");
        }, "Pending", counts.pending, "warn")}
        {statCard(() => {
          setFilter("status", "confirmed");
          setFilter("dateFrom", "");
          setFilter("dateTo", "");
        }, "Confirmed", counts.confirmed, "good")}
        {statCard(() => {
          setFilter("status", "completed");
          setFilter("dateFrom", "");
          setFilter("dateTo", "");
        }, "Completed", counts.completed, "done")}
        {statCard(() => {
          setFilter("status", "");
          setFilter("dateFrom", todayIso);
          setFilter("dateTo", todayIso);
        }, "Today", counts.today, "today")}
        {statCard(null, "Booking Value", formatUsd(counts.value), "value")}
      </div>

      <div className="ftb-tool-row">
        <button
          type="button"
          className={`ftb-tool-pill${filters.dateFrom === todayIso && filters.dateTo === todayIso ? " active" : ""}`}
          onClick={() => {
            setFilter("dateFrom", todayIso);
            setFilter("dateTo", todayIso);
          }}
        >
          Today
        </button>
        <button
          type="button"
          className={`ftb-tool-pill${filters.dateFrom === last7 && filters.dateTo === todayIso ? " active" : ""}`}
          onClick={() => {
            setFilter("dateFrom", last7);
            setFilter("dateTo", todayIso);
          }}
        >
          Last 7 Days
        </button>
        <button
          type="button"
          className={`ftb-tool-pill${filters.dateFrom === firstOfMonth && filters.dateTo === todayIso ? " active" : ""}`}
          onClick={() => {
            setFilter("dateFrom", firstOfMonth);
            setFilter("dateTo", todayIso);
          }}
        >
          This Month
        </button>
        <button
          type="button"
          className={`ftb-tool-pill${filters.tripFilter === "__fixed__" ? " active" : ""}`}
          onClick={() => setFilter("tripFilter", filters.tripFilter === "__fixed__" ? "" : "__fixed__")}
        >
          Fixed Departures
        </button>
        <button
          type="button"
          className={`ftb-tool-pill${filters.status === "cancelled" ? " active" : ""}`}
          onClick={() => setFilter("status", filters.status === "cancelled" ? "" : "cancelled")}
        >
          Cancelled
        </button>
        <button type="button" className="ftb-tool-pill" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="ftb-filter-bar advanced">
        <input
          type="search"
          placeholder="Search name, email, phone, country, trip..."
          value={filters.s}
          onChange={(e) => setFilter("s", e.target.value)}
          aria-label="Search bookings"
        />
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)} aria-label="Filter by status">
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select value={filters.tripFilter} onChange={(e) => setFilter("tripFilter", e.target.value)} aria-label="Filter by trip">
          <option value="">All Trips / Tours</option>
          <option value="__fixed__">Fixed Departures Only</option>
          <optgroup label="Trips / Tours">
            {tripOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </optgroup>
          <optgroup label="Fixed Departure Dates">
            {tripOptions
              .filter((t) => fixedTripTitles.includes(t.toLowerCase()))
              .map((t) => (
                <option key={`fixed-${t}`} value={t}>
                  {t} — Fixed
                </option>
              ))}
          </optgroup>
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilter("dateFrom", e.target.value)}
          aria-label="Date from"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilter("dateTo", e.target.value)}
          aria-label="Date to"
        />
        <button type="button" className="button button-primary" onClick={clearFilters}>
          Reset
        </button>
      </div>

      <div className="ftb-admin-panel list-panel">
        <div className="ftb-panel-head slim">
          <h2>Booking List</h2>
          <span>
            {visibleRows.length} item(s) shown
            {hasActiveFilters ? ` of ${totalCount}` : ""}
          </span>
        </div>
        <div className="ftb-table-wrap">
          <table className="widefat ftb-booking-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th>Customer</th>
                <th>Trip / Tour</th>
                <th>Travel</th>
                <th>Group / Price</th>
                <th>Status</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "34px 16px" }}>
                    No booking requests found.
                  </td>
                </tr>
              ) : (
                visibleRows.map((r) => (
                  <tr key={r.id}>
                    <td className="col-id">
                      <strong className="booking-id">#{String(visibleRows.indexOf(r) + 1).padStart(2, "0")}</strong>
                      <br />
                      <small>{formatDate(r.createdAt)}</small>
                    </td>
                    <td>
                      <strong>{r.fullName}</strong>
                      <br />
                      <small>{r.email}</small>
                      <br />
                      <small>{r.phone}</small>
                    </td>
                    <td>
                      <strong>{r.tripTitle}</strong>
                      <br />
                      <small>{r.country}</small>
                    </td>
                    <td>
                      {r.travelDate}
                      {r.fixedDate && (
                        <>
                          <br />
                          <small className="ftb-table-departure">Guaranteed - {r.fixedDate}</small>
                        </>
                      )}
                      <br />
                      <small>{r.travellers} traveller(s)</small>
                      <br />
                      <small>
                        Adult M: {r.breakdown.M}
                        {r.breakdown.F ? `, F: ${r.breakdown.F}` : ""}
                        {r.breakdown.CM ? ` · Child M: ${r.breakdown.CM}` : ""}
                        {r.breakdown.CF ? `, F: ${r.breakdown.CF}` : ""}
                      </small>
                    </td>
                    <td>
                      <strong>{r.groupSize}</strong>
                      <br />
                      <small>
                        {formatUsd(r.pp)} PP · Total {formatUsd(r.total)}
                      </small>
                    </td>
                    <td>
                      <span className={`ftb-status ftb-status-${r.status}`}>{STATUS_LABEL[r.status] || r.status}</span>
                    </td>
                    <td className="col-action">
                      <button type="button" className="button ftb-view-booking" onClick={() => setOpenId(r.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openRow && (
        <div className="ftb-modal is-open" aria-hidden="false">
          <div className="ftb-modal-backdrop" onClick={() => setOpenId(null)} />
          <div className="ftb-modal-card" role="dialog" aria-modal="true" aria-labelledby="ftb-booking-title">
            <button type="button" className="ftb-modal-close" onClick={() => setOpenId(null)} aria-label="Close">
              ×
            </button>
            <div className="ftb-modal-head">
              <div>
                <span>Booking Request</span>
                <h2 id="ftb-booking-title">{openRow.tripTitle}</h2>
              </div>
              <span className={`ftb-status ftb-status-${openRow.status}`}>{STATUS_LABEL[openRow.status] || openRow.status}</span>
            </div>
            <div className="ftb-modal-body">
              <div className="ftb-detail-grid">
                <div className="ftb-detail-item">
                  <span>Customer</span>
                  <strong>{openRow.fullName}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Email</span>
                  <strong>
                    <a href={`mailto:${openRow.email}`}>{openRow.email}</a>
                  </strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Phone</span>
                  <strong>{openRow.phone}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Country</span>
                  <strong>{openRow.country}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Travel Date</span>
                  <strong>{openRow.travelDate}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Fixed Departure</span>
                  <strong>{openRow.fixedDate || "—"}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Travellers</span>
                  <strong>{openRow.travellers} traveller(s)</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Traveller Breakdown</span>
                  <strong>
                    Adult M: {openRow.breakdown.M} F: {openRow.breakdown.F} · Child M: {openRow.breakdown.CM} F:{" "}
                    {openRow.breakdown.CF}
                  </strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Group / Type</span>
                  <strong>{openRow.groupSize}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Price / Person</span>
                  <strong>{formatUsd(openRow.pp)}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Estimated Total</span>
                  <strong>{formatUsd(openRow.total)}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Created</span>
                  <strong>{formatDateLong(openRow.createdAt)}</strong>
                </div>
                <div className="ftb-detail-item">
                  <span>Tour Details Page</span>
                  {openRow.detailUrl ? (
                    <strong>
                      <a href={openRow.detailUrl} target="_blank" rel="noopener noreferrer">
                        View details page
                      </a>
                    </strong>
                  ) : (
                    <strong>—</strong>
                  )}
                </div>
              </div>

              <div className="ftb-modal-note-grid">
                <div className="ftb-note-box">
                  <h3>Customer Message</h3>
                  <p>{openRow.notes || "No message provided."}</p>
                </div>
                <div className="ftb-note-box soft">
                  <h3>Internal Notes</h3>
                  <p>{form.adminNotes || "No internal notes yet."}</p>
                </div>
              </div>

              {notice && (
                <p style={{ margin: "10px 0 0", fontWeight: 700, color: notice.startsWith("Booking updated") ? "#166534" : "#b42318" }}>
                  {notice}
                </p>
              )}

              <div className="ftb-modal-update-form">
                {canEditBooking ? (
                  <>
                    <div>
                      <label htmlFor="modal-status">Status</label>
                      <select id="modal-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="modal-notes">Internal Notes</label>
                      <textarea
                        id="modal-notes"
                        rows={3}
                        placeholder="Add admin/private notes"
                        value={form.adminNotes}
                        onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
                      />
                    </div>
                    <button className="button" onClick={saveChanges} disabled={busy}>
                      {busy ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <p style={{ margin: "10px 0 0", fontWeight: 600, color: "#6b7280" }}>
                    Read-only — your role cannot edit booking details.
                  </p>
                )}
              </div>

              {canDeleteBooking && (
                <div className="ftb-modal-delete-form">
                  <button className="button-link-delete" onClick={removeBooking} disabled={busy}>
                    Delete Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}