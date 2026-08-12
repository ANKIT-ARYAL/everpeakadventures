import Link from "next/link";
import AddNewButton from "./AddNewButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import ViewButton from "./ViewButton";
import ToggleShow from "./ToggleShow";
import { RichTextInline } from "./RichTextInline";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";

interface CategoryItem {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  order?: number;
  published: boolean;
}

interface AssignedChild {
  id: string;
  label: string;
  href: string;
  published?: boolean;
}

interface Props {
  title: string;
  description: string;
  addLabel: string;
  addHref: string;
  emptyLabel: string;
  model: string;
  resource: string;
  items: CategoryItem[];
  viewPrefix?: string;
  childrenLabel?: string;
  childrenByItem?: Record<string, AssignedChild[]>;
}

export default function CategoryList({
  title,
  description,
  addLabel,
  addHref,
  emptyLabel,
  model,
  resource,
  items,
  viewPrefix,
  childrenLabel,
  childrenByItem,
}: Props) {
  const hasChildren = !!childrenByItem;

  /*
   * Desktop table columns.
   *
   * Name gets enough room for the action buttons:
   * [Show] [Edit] [View] [Delete]
   *
   * The table itself remains responsive through ResponsiveTable.
   */
  const tableHeaders = hasChildren
    ? ["#", "Name", "Slug", "Description", childrenLabel ?? "Assigned"]
    : ["#", "Name", "Slug", "Description"];

  const tableColumnClassNames = hasChildren
    ? [
        "w-12 text-center whitespace-nowrap",
        "w-[260px]",
        "w-[180px]",
        "w-[280px]",
        "w-[280px]",
      ]
    : [
        "w-12 text-center whitespace-nowrap",
        "w-[280px]",
        "w-[220px]",
        "w-[320px]",
      ];

  /*
   * Desktop table rows.
   */
  const tableRows = items.map((item, index) => [
    /*
     * Index
     */
    <span
      key="n"
      className="text-gray-400 font-medium whitespace-nowrap"
    >
      {index + 1}
    </span>,

    /*
     * Name + Actions
     */
    <div
      key="name"
      className="min-w-0"
    >
      <span
        className="font-bold text-[#112233] block break-words"
        title={item.name}
      >
        {item.name}
      </span>

      {/* Desktop Actions */}
      <div className="mt-2 flex items-center gap-1.5 whitespace-nowrap">
        <ToggleShow
          model={model}
          resource={resource}
          id={item.id}
          published={item.published}
        />

        <EditButton
          href={`/admin/${resource}/${item.id}/edit`}
        />

        {viewPrefix && item.slug && (
          <ViewButton
            href={`${viewPrefix}/${item.slug}`}
          />
        )}

        <DeleteButton
          id={item.id}
          model={model}
          title={item.name}
        />
      </div>
    </div>,

    /*
     * Slug
     */
    <span
      key="slug"
      className="text-gray-500 text-xs break-words"
      title={item.slug || undefined}
    >
      {item.slug || "—"}
    </span>,

    /*
     * Description
     */
    <span
      key="desc"
      className="text-gray-600 line-clamp-2 block max-w-[320px] break-words"
    >
      <RichTextInline html={item.description || ""} />
    </span>,

    /*
     * Assigned Items
     */
    ...(hasChildren
      ? [
          <AssignedList
            key="assigned"
            items={childrenByItem?.[item.id]}
          />,
        ]
      : []),
  ]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 space-y-4 sm:space-y-6 pb-10 text-xs min-w-0 overflow-x-hidden">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-[#112233] uppercase tracking-wide leading-tight break-words">
            {title}
          </h1>

          <p className="text-gray-500 mt-1 leading-relaxed break-words">
            {description}
          </p>
        </div>

        <div className="w-full lg:w-auto shrink-0">
          <AddNewButton
            href={addHref}
            label={addLabel}
          />
        </div>
      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}
      <ResponsiveTable
        tableClassName="table-fixed w-full"
        headers={tableHeaders}
        rows={tableRows}
        data={items}
        emptyText={emptyLabel}
        columnClassNames={tableColumnClassNames}
        mobileCards={(_row, data, index) => {
          const item = data as CategoryItem;

          return (
            <div className="min-w-0">

              {/* =================================================
                  CATEGORY INFO
              ================================================= */}
              <div className="min-w-0">

                <div
                  className="font-bold text-[#112233] break-words leading-tight"
                  title={item.name}
                >
                  {item.name}
                </div>

                <span
                  className="block text-[10px] text-gray-400 truncate mt-1"
                  title={item.slug || undefined}
                >
                  #{index + 1} · {item.slug || "no slug"}
                </span>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}
              {item.description && (
                <div className="mt-3 text-[11px] text-gray-600 line-clamp-2 break-words">
                  <RichTextInline html={item.description} />
                </div>
              )}

              {/* =================================================
                  ASSIGNED ITEMS
              ================================================= */}
              {hasChildren && (
                <div className="mt-3 min-w-0">

                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {childrenLabel ?? "Assigned"}
                  </span>

                  <AssignedList
                    items={childrenByItem?.[item.id]}
                  />

                </div>
              )}

              {/* =================================================
                  MOBILE ACTIONS
              ================================================= */}
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">

                <ToggleShow
                  model={model}
                  resource={resource}
                  id={item.id}
                  published={item.published}
                />

                <EditButton
                  href={`/admin/${resource}/${item.id}/edit`}
                />

                {viewPrefix && item.slug && (
                  <ViewButton
                    href={`${viewPrefix}/${item.slug}`}
                  />
                )}

                <DeleteButton
                  id={item.id}
                  model={model}
                  title={item.name}
                />

              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

/* =============================================================
   ASSIGNED ITEMS
============================================================= */

function AssignedList({
  items,
}: {
  items?: AssignedChild[];
}) {
  if (!items || items.length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">
        No items assigned
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      {items.map((child) => (
        <Link
          key={child.id}
          href={child.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24a0ed] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-md px-2 py-1 w-fit max-w-full min-w-0"
          title={child.label}
        >
          <span className="truncate min-w-0">
            {child.label}
          </span>

          {child.published === false && (
            <span className="shrink-0 text-[9px] uppercase tracking-wide font-bold text-orange-500 border border-orange-200 rounded px-1">
              Hidden
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}