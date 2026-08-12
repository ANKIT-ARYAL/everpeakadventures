"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";

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
  breakdown: {
    M: number;
    F: number;
    CM: number;
    CF: number;
  };
  total: number;
  pp: number;
  status: string;
  notes: string;
  adminNotes: string;
};

type ManagerProps = {
  rows: Row[];
  counts: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    today: number;
    value: number;
  };
  todayIso: string;
  last7: string;
  firstOfMonth: string;
  tripOptions: string[];
  fixedTripTitles: string[];
  params: {
    s: string;
    status: string;
    tripFilter: string;
    dateFrom: string;
    dateTo: string;
  };
  totalCount: number;
};

const STATUSES = [
  { value: "new", label: "New" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUSES.map((s) => [s.value, s.label])
);

function formatUsd(n: number): string {
  return "US$ " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateLong(ms: number): string {
  return (
    new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    new Date(ms).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
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
  const [form, setForm] = useState({
    status: "",
    adminNotes: "",
  });

  const { isSuperAdmin, permissions } = useAdminPerms();

  const canEditBooking =
    isSuperAdmin || hasPerm(permissions, "bookings", "edit");

  const canDeleteBooking =
    isSuperAdmin || hasPerm(permissions, "bookings", "delete");

  /*
   * ============================================================
   * CLIENT-SIDE FILTERS
   * ============================================================
   */

  const [filters, setFilters] = useState({
    s: params.s || "",
    status: params.status || "",
    tripFilter: params.tripFilter || "",
    dateFrom: params.dateFrom || "",
    dateTo: params.dateTo || "",
  });

  const setFilter = (
    key: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /*
   * ============================================================
   * FILTERED BOOKINGS
   * ============================================================
   *
   * Everything here is client-side.
   * Typing in the search box immediately recalculates visibleRows.
   */

  const visibleRows = useMemo(() => {
    const search = filters.s.trim().toLowerCase();
    const tripFilter = filters.tripFilter.trim().toLowerCase();

    return rows.filter((row) => {
      /*
       * Status filter
       */
      if (
        filters.status &&
        row.status !== filters.status
      ) {
        return false;
      }

      /*
       * Trip filter
       */
      if (tripFilter) {
        if (tripFilter === "__fixed__") {
          if (!row.fixedDate) {
            return false;
          }
        } else {
          if (
            row.tripTitle.toLowerCase() !== tripFilter
          ) {
            return false;
          }
        }
      }

      /*
       * Search
       *
       * Search across all useful booking information.
       */
      if (search) {
        const searchableText = [
          row.fullName,
          row.email,
          row.phone,
          row.country,
          row.tripTitle,
          row.groupSize,
          row.status,
          row.travelDate,
          row.fixedDate,
          row.notes,
          row.adminNotes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(search)) {
          return false;
        }
      }

      /*
       * Date from
       */
      if (
        filters.dateFrom &&
        row.travelDate < filters.dateFrom
      ) {
        return false;
      }

      /*
       * Date to
       */
      if (
        filters.dateTo &&
        row.travelDate > filters.dateTo
      ) {
        return false;
      }

      return true;
    });
  }, [rows, filters]);

  /*
   * ============================================================
   * CLEAR FILTERS
   * ============================================================
   */

  const clearFilters = () => {
    setFilters({
      s: "",
      status: "",
      tripFilter: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  /*
   * ============================================================
   * MODAL BODY LOCK
   * ============================================================
   */

  useEffect(() => {
    document.body.classList.toggle(
      "ftb-modal-open",
      !!openId
    );

    return () => {
      document.body.classList.remove("ftb-modal-open");
    };
  }, [openId]);

  /*
   * ============================================================
   * SYNC MODAL FORM
   * ============================================================
   */

  useEffect(() => {
    if (!openId) {
      return;
    }

    const row = rows.find((r) => r.id === openId);

    if (row) {
      setForm({
        status: row.status,
        adminNotes: row.adminNotes,
      });
    }
  }, [openId, rows]);

  /*
   * ============================================================
   * ESCAPE KEY
   * ============================================================
   */

  useEffect(() => {
    if (!openId) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenId(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [openId]);

  /*
   * ============================================================
   * OPEN ROW
   * ============================================================
   */

  const openRow =
    rows.find((r) => r.id === openId) || null;

  /*
   * ============================================================
   * SAVE BOOKING
   * ============================================================
   */

  async function saveChanges() {
    if (!openRow) {
      return;
    }

    setBusy(true);
    setNotice("");

    try {
      const res = await fetch(
        `/api/admin/bookings/${openRow.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: form.status,
            adminNotes: form.adminNotes,
          }),
        }
      );

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          data.error ||
            "Failed to update booking"
        );
      }

      setNotice(
        "Booking updated successfully."
      );

      router.refresh();
    } catch (err) {
      setNotice(
        String(
          err instanceof Error
            ? err.message
            : err
        )
      );
    } finally {
      setBusy(false);
    }
  }

  /*
   * ============================================================
   * DELETE BOOKING
   * ============================================================
   */

  async function removeBooking() {
    if (!openRow) {
      return;
    }

    if (
      !window.confirm(
        "Delete this booking?"
      )
    ) {
      return;
    }

    setBusy(true);
    setNotice("");

    try {
      const res = await fetch(
        `/api/admin/bookings/${openRow.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          data.error ||
            "Failed to delete booking"
        );
      }

      setOpenId(null);

      router.refresh();
    } catch (err) {
      setNotice(
        String(
          err instanceof Error
            ? err.message
            : err
        )
      );
    } finally {
      setBusy(false);
    }
  }

  /*
   * ============================================================
   * STAT CARDS
   * ============================================================
   */

  const statCard = (
    action: (() => void) | null,
    label: string,
    value: string | number,
    extra = ""
  ) => {
    const cls =
      `ftb-quick-card ${extra}`.trim();

    if (!action) {
      return (
        <div
          key={label}
          className={cls}
        >
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      );
    }

    return (
      <button
        key={label}
        type="button"
        onClick={action}
        className={cls}
      >
        <span>{label}</span>
        <strong>{value}</strong>
      </button>
    );
  };

  /*
   * ============================================================
   * ACTIVE FILTERS
   * ============================================================
   */

  const hasActiveFilters =
    Boolean(filters.s) ||
    Boolean(filters.status) ||
    Boolean(filters.tripFilter) ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo);

  /*
   * ============================================================
   * TABLE ROWS
   * ============================================================
   */

  const tableRows = visibleRows.map(
    (row, index) => [
      <span key="id">
        <strong className="booking-id">
          #{String(index + 1).padStart(2, "0")}
        </strong>

        <br />

        <small>
          {formatDate(row.createdAt)}
        </small>
      </span>,

      <span key="customer">
        <strong>{row.fullName}</strong>

        <br />

        <small>{row.email}</small>

        <br />

        <small>{row.phone}</small>
      </span>,

      <span key="trip">
        <strong>{row.tripTitle}</strong>

        <br />

        <small>{row.country}</small>
      </span>,

      <span key="travel">
        {row.travelDate}

        {row.fixedDate && (
          <>
            <br />

            <small className="ftb-table-departure">
              Guaranteed - {row.fixedDate}
            </small>
          </>
        )}

        <br />

        <small>
          {row.travellers} traveller(s)
        </small>

        <br />

        <small>
          Adult M: {row.breakdown.M}

          {row.breakdown.F
            ? `, F: ${row.breakdown.F}`
            : ""}

          {row.breakdown.CM
            ? ` · Child M: ${row.breakdown.CM}`
            : ""}

          {row.breakdown.CF
            ? `, F: ${row.breakdown.CF}`
            : ""}
        </small>
      </span>,

      <span key="price">
        <strong>{row.groupSize}</strong>

        <br />

        <small>
          {formatUsd(row.pp)} PP · Total{" "}
          {formatUsd(row.total)}
        </small>
      </span>,

      <span key="status">
        <span
          className={`ftb-status ftb-status-${row.status}`}
        >
          {STATUS_LABEL[row.status] ||
            row.status}
        </span>
      </span>,

      <span key="action">
        <button
          type="button"
          className="button ftb-view-booking"
          onClick={() =>
            setOpenId(row.id)
          }
        >
          View
        </button>
      </span>,
    ]
  );

  return (
    <div className="wrap ftb-admin-wrap ftb-booking-list-page">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="ftb-list-header">
        <div>
          <span className="ftb-kicker-dark">
            FlyUp Trekking Booking
          </span>

          <h1>Booking Requests</h1>

          <p>
            Review bookings, open full details,
            update status, and manage customer
            requests from one clean list.
          </p>
        </div>

        <a
          className="ftb-admin-btn ghost"
          href="/admin/site-settings"
        >
          Settings
        </a>
      </div>

      {/* ========================================================
          QUICK CARDS
      ======================================================== */}

      <div className="ftb-quick-cards">

        {statCard(
          () => clearFilters(),
          "Total",
          counts.total
        )}

        {statCard(
          () => {
            setFilter("status", "pending");
            setFilter("dateFrom", "");
            setFilter("dateTo", "");
          },
          "Pending",
          counts.pending,
          "warn"
        )}

        {statCard(
          () => {
            setFilter("status", "confirmed");
            setFilter("dateFrom", "");
            setFilter("dateTo", "");
          },
          "Confirmed",
          counts.confirmed,
          "good"
        )}

        {statCard(
          () => {
            setFilter("status", "completed");
            setFilter("dateFrom", "");
            setFilter("dateTo", "");
          },
          "Completed",
          counts.completed,
          "done"
        )}

        {statCard(
          () => {
            setFilter("status", "");
            setFilter(
              "dateFrom",
              todayIso
            );
            setFilter(
              "dateTo",
              todayIso
            );
          },
          "Today",
          counts.today,
          "today"
        )}

        {statCard(
          null,
          "Booking Value",
          formatUsd(counts.value),
          "value"
        )}

      </div>

      {/* ========================================================
          QUICK FILTERS
      ======================================================== */}

      <div className="ftb-tool-row">

        <button
          type="button"
          className={`ftb-tool-pill${
            filters.dateFrom === todayIso &&
            filters.dateTo === todayIso
              ? " active"
              : ""
          }`}
          onClick={() => {
            setFilter(
              "dateFrom",
              todayIso
            );
            setFilter(
              "dateTo",
              todayIso
            );
          }}
        >
          Today
        </button>

        <button
          type="button"
          className={`ftb-tool-pill${
            filters.dateFrom === last7 &&
            filters.dateTo === todayIso
              ? " active"
              : ""
          }`}
          onClick={() => {
            setFilter(
              "dateFrom",
              last7
            );
            setFilter(
              "dateTo",
              todayIso
            );
          }}
        >
          Last 7 Days
        </button>

        <button
          type="button"
          className={`ftb-tool-pill${
            filters.dateFrom === firstOfMonth &&
            filters.dateTo === todayIso
              ? " active"
              : ""
          }`}
          onClick={() => {
            setFilter(
              "dateFrom",
              firstOfMonth
            );
            setFilter(
              "dateTo",
              todayIso
            );
          }}
        >
          This Month
        </button>

        <button
          type="button"
          className={`ftb-tool-pill${
            filters.tripFilter ===
            "__fixed__"
              ? " active"
              : ""
          }`}
          onClick={() =>
            setFilter(
              "tripFilter",
              filters.tripFilter ===
                "__fixed__"
                ? ""
                : "__fixed__"
            )
          }
        >
          Fixed Departures
        </button>

        <button
          type="button"
          className={`ftb-tool-pill${
            filters.status ===
            "cancelled"
              ? " active"
              : ""
          }`}
          onClick={() =>
            setFilter(
              "status",
              filters.status ===
                "cancelled"
                ? ""
                : "cancelled"
            )
          }
        >
          Cancelled
        </button>

        <button
          type="button"
          className="ftb-tool-pill"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>

      {/* ========================================================
          SEARCH / FILTER BAR
      ======================================================== */}

      <div className="ftb-filter-bar advanced">

        <input
          type="search"
          placeholder="Search name, email, phone, country, trip..."
          value={filters.s}
          onChange={(e) =>
            setFilter(
              "s",
              e.target.value
            )
          }
          aria-label="Search bookings"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilter(
              "status",
              e.target.value
            )
          }
          aria-label="Filter by status"
        >
          <option value="">
            All Status
          </option>

          {STATUSES.map((status) => (
            <option
              key={status.value}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={filters.tripFilter}
          onChange={(e) =>
            setFilter(
              "tripFilter",
              e.target.value
            )
          }
          aria-label="Filter by trip"
        >
          <option value="">
            All Trips / Tours
          </option>

          <option value="__fixed__">
            Fixed Departures Only
          </option>

          <optgroup label="Trips / Tours">
            {tripOptions.map((trip) => (
              <option
                key={trip}
                value={trip}
              >
                {trip}
              </option>
            ))}
          </optgroup>

          <optgroup label="Fixed Departure Dates">
            {tripOptions
              .filter((trip) =>
                fixedTripTitles.includes(
                  trip.toLowerCase()
                )
              )
              .map((trip) => (
                <option
                  key={`fixed-${trip}`}
                  value={trip}
                >
                  {trip} — Fixed
                </option>
              ))}
          </optgroup>
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) =>
            setFilter(
              "dateFrom",
              e.target.value
            )
          }
          aria-label="Date from"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) =>
            setFilter(
              "dateTo",
              e.target.value
            )
          }
          aria-label="Date to"
        />

        <button
          type="button"
          className="button button-primary"
          onClick={clearFilters}
        >
          Reset
        </button>

      </div>

      {/* ========================================================
          BOOKING LIST
      ======================================================== */}

      <div className="ftb-admin-panel list-panel">

        <div className="ftb-panel-head slim">

          <h2>Booking List</h2>

          <span>
            {visibleRows.length} item(s) shown
            {hasActiveFilters
              ? ` of ${totalCount}`
              : ""}
          </span>

        </div>

        <ResponsiveTable
          headers={[
            "ID",
            "Customer",
            "Trip / Tour",
            "Travel",
            "Group / Price",
            "Status",
            "Action",
          ]}
          rows={tableRows}
          data={visibleRows}
          emptyText="No booking requests found."
          tableClassName="ftb-booking-table"
          columnClassNames={[
            "col-id",
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "col-action",
          ]}
          mobileCards={(
            _row,
            data,
            index
          ) => {
            const row = data as Row;

            return (
              <>
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0 flex-1">

                    <span className="block font-bold text-[#112233] truncate">
                      {row.fullName}
                    </span>

                    <span className="block text-[#24a0ed] text-sm truncate">
                      {row.email}
                    </span>

                    <span className="block text-gray-500 mt-0.5 text-[11px] truncate">
                      #{index + 1} ·{" "}
                      {row.phone}
                    </span>

                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status ===
                      "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : row.status ===
                          "pending"
                        ? "bg-amber-50 text-amber-700"
                        : row.status ===
                          "completed"
                        ? "bg-blue-50 text-blue-700"
                        : row.status ===
                          "cancelled"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABEL[
                      row.status
                    ] || row.status}
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Trip / Tour
                    </span>

                    <span className="font-semibold text-gray-700 truncate block">
                      {row.tripTitle}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Country
                    </span>

                    <span className="text-gray-600">
                      {row.country}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Travel Date
                    </span>

                    <span className="text-gray-600 font-medium">
                      {row.travelDate}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Travellers
                    </span>

                    <span className="text-gray-600">
                      {row.travellers}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Group / Type
                    </span>

                    <span className="text-gray-600 truncate block">
                      {row.groupSize}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Price
                    </span>

                    <span className="font-bold text-gray-700">
                      {formatUsd(row.pp)} PP · Total{" "}
                      {formatUsd(row.total)}
                    </span>
                  </div>

                  <div className="min-w-0 col-span-2">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Created
                    </span>

                    <span className="text-gray-500 font-medium">
                      {formatDateLong(
                        row.createdAt
                      )}
                    </span>
                  </div>

                </div>

                <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">

                  <button
                    type="button"
                    className="button ftb-view-booking"
                    onClick={() =>
                      setOpenId(row.id)
                    }
                  >
                    View Details
                  </button>

                </div>
              </>
            );
          }}
        />

      </div>

      {/* ========================================================
          BOOKING MODAL
      ======================================================== */}

      {openRow && (
        <div
          className="ftb-modal is-open"
          aria-hidden="false"
        >

          <div
            className="ftb-modal-backdrop"
            onClick={() =>
              setOpenId(null)
            }
          />

          <div
            className="ftb-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ftb-booking-title"
          >

            <button
              type="button"
              className="ftb-modal-close"
              onClick={() =>
                setOpenId(null)
              }
              aria-label="Close"
            >
              ×
            </button>

            <div className="ftb-modal-head">

              <div>

                <span>
                  Booking Request
                </span>

                <h2 id="ftb-booking-title">
                  {openRow.tripTitle}
                </h2>

              </div>

              <span
                className={`ftb-status ftb-status-${openRow.status}`}
              >
                {STATUS_LABEL[
                  openRow.status
                ] || openRow.status}
              </span>

            </div>

            <div className="ftb-modal-body">

              <div className="ftb-detail-grid">

                <div className="ftb-detail-item">
                  <span>Customer</span>
                  <strong>
                    {openRow.fullName}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Email</span>

                  <strong>
                    <a
                      href={`mailto:${openRow.email}`}
                    >
                      {openRow.email}
                    </a>
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Phone</span>
                  <strong>
                    {openRow.phone}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Country</span>
                  <strong>
                    {openRow.country}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Travel Date</span>
                  <strong>
                    {openRow.travelDate}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Fixed Departure</span>
                  <strong>
                    {openRow.fixedDate ||
                      "—"}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Travellers</span>
                  <strong>
                    {openRow.travellers}{" "}
                    traveller(s)
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>
                    Traveller Breakdown
                  </span>

                  <strong>
                    Adult M:{" "}
                    {openRow.breakdown.M}{" "}
                    F:{" "}
                    {openRow.breakdown.F} ·
                    Child M:{" "}
                    {openRow.breakdown.CM}{" "}
                    F:{" "}
                    {openRow.breakdown.CF}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>
                    Group / Type
                  </span>

                  <strong>
                    {openRow.groupSize}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>
                    Price / Person
                  </span>

                  <strong>
                    {formatUsd(
                      openRow.pp
                    )}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>
                    Estimated Total
                  </span>

                  <strong>
                    {formatUsd(
                      openRow.total
                    )}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>Created</span>

                  <strong>
                    {formatDateLong(
                      openRow.createdAt
                    )}
                  </strong>
                </div>

                <div className="ftb-detail-item">
                  <span>
                    Tour Details Page
                  </span>

                  {openRow.detailUrl ? (
                    <strong>
                      <a
                        href={
                          openRow.detailUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View details page
                      </a>
                    </strong>
                  ) : (
                    <strong>
                      —
                    </strong>
                  )}
                </div>

              </div>

              <div className="ftb-modal-note-grid">

                <div className="ftb-note-box">

                  <h3>
                    Customer Message
                  </h3>

                  <p>
                    {openRow.notes ||
                      "No message provided."}
                  </p>

                </div>

                <div className="ftb-note-box soft">

                  <h3>
                    Internal Notes
                  </h3>

                  <p>
                    {form.adminNotes ||
                      "No internal notes yet."}
                  </p>

                </div>

              </div>

              {notice && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontWeight: 700,
                    color: notice.startsWith(
                      "Booking updated"
                    )
                      ? "#166534"
                      : "#b42318",
                  }}
                >
                  {notice}
                </p>
              )}

              <div className="ftb-modal-update-form">

                {canEditBooking ? (
                  <>

                    <div>

                      <label htmlFor="modal-status">
                        Status
                      </label>

                      <select
                        id="modal-status"
                        value={form.status}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            status:
                              e.target.value,
                          })
                        }
                      >
                        {STATUSES.map(
                          (status) => (
                            <option
                              key={
                                status.value
                              }
                              value={
                                status.value
                              }
                            >
                              {status.label}
                            </option>
                          )
                        )}
                      </select>

                    </div>

                    <div>

                      <label htmlFor="modal-notes">
                        Internal Notes
                      </label>

                      <textarea
                        id="modal-notes"
                        rows={3}
                        placeholder="Add admin/private notes"
                        value={
                          form.adminNotes
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            adminNotes:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <button
                      className="button"
                      onClick={
                        saveChanges
                      }
                      disabled={busy}
                    >
                      {busy
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </>
                ) : (
                  <p
                    style={{
                      margin:
                        "10px 0 0",
                      fontWeight: 600,
                      color: "#6b7280",
                    }}
                  >
                    Read-only — your role
                    cannot edit booking
                    details.
                  </p>
                )}

              </div>

              {canDeleteBooking && (
                <div className="ftb-modal-delete-form">

                  <button
                    className="button-link-delete"
                    onClick={
                      removeBooking
                    }
                    disabled={busy}
                  >
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