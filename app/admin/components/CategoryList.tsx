import Link from 'next/link';
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
  image?: string | null;
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
  /** Optional: show an extra column listing records assigned to each category (e.g. treks per category). */
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

  const tableHeaders = hasChildren
    ? ['#', 'Image', 'Name', 'Slug', 'Description', childrenLabel ?? 'Assigned', 'Order', 'Actions']
    : ['#', 'Image', 'Name', 'Slug', 'Description', 'Order', 'Actions'];
  const tableColumnClassNames = hasChildren
    ? ['w-12 text-center', 'w-16', undefined, undefined, undefined, undefined, 'text-center', 'text-right']
    : ['w-12 text-center', 'w-16', undefined, undefined, undefined, 'text-center', 'text-right'];

  const tableRows = items.map((item, index) => [
    <span key="n" className="text-gray-400 font-medium">{index + 1}</span>,
    item.image ? (
      <img key="img" src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm" />
    ) : (
      <span key="img" className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-sm font-black">—</span>
    ),
    <span key="name" className="font-bold text-[#112233]">{item.name}</span>,
    <span key="slug" className="text-gray-500 text-xs">{item.slug || '—'}</span>,
    <span key="desc" className="text-gray-600 line-clamp-2 block max-w-[240px]">
      <RichTextInline html={item.description || ''} />
    </span>,
    ...(hasChildren ? [<AssignedList key="assigned" items={childrenByItem![item.id]} />] : []),
    <span key="order" className="font-bold text-gray-700">{item.order ?? 0}</span>,
    <div key="actions" className="flex items-center justify-end gap-2">
      <ToggleShow model={model} resource={resource} id={item.id} published={item.published} />
      <EditButton href={`/admin/${resource}/${item.id}/edit`} />
      {viewPrefix && item.slug && <ViewButton href={`${viewPrefix}/${item.slug}`} />}
      <DeleteButton id={item.id} model={model} title={item.name} />
    </div>,
  ]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto text-sm">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide">{title}</h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
        <AddNewButton href={addHref} label={addLabel} />
      </div>

      <ResponsiveTable
        headers={tableHeaders}
        rows={tableRows}
        data={items}
        emptyText={emptyLabel}
        columnClassNames={tableColumnClassNames}
        mobileCards={(_row, data, index) => {
          const item = data as CategoryItem;
          return (
            <>
              <div className="flex items-start gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0" />
                ) : (
                  <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 shrink-0">—</span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#112233] truncate">{item.name}</div>
                  <span className="block text-xs text-gray-400 truncate">#{index + 1} · {item.slug || 'no slug'}</span>
                </div>
              </div>
              {hasChildren && (
                <div className="mt-3">
                  <AssignedList items={childrenByItem![item.id]} />
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model={model} resource={resource} id={item.id} published={item.published} />
                <EditButton href={`/admin/${resource}/${item.id}/edit`} />
                {viewPrefix && item.slug && <ViewButton href={`${viewPrefix}/${item.slug}`} />}
                <DeleteButton id={item.id} model={model} title={item.name} />
              </div>
            </>
          );
        }}
      />
    </div>
  );
}

function AssignedList({ items }: { items?: AssignedChild[] }) {
  if (!items || items.length === 0) {
    return <span className="text-xs text-gray-400 italic">No items assigned</span>;
  }
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((c) => (
        <Link
          key={c.id}
          href={c.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24a0ed] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-md px-2 py-1 w-fit max-w-full"
        >
          <span className="truncate">{c.label}</span>
          {c.published === false && (
            <span className="shrink-0 text-[9px] uppercase tracking-wide font-bold text-orange-500 border border-orange-200 rounded px-1">Hidden</span>
          )}
        </Link>
      ))}
    </div>
  );
}