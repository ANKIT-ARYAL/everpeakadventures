import React from 'react';

interface Props {
  headers: string[];
  rows: React.ReactNode[][];
  /** Original data aligned with `rows`, passed through to `mobileCards`. */
  data?: unknown[];
  mobileCards?: (row: React.ReactNode[], data: unknown, index: number) => React.ReactNode;
  emptyText?: string;
  /** Optional class applied to both the `th` and matching `td` of each column. */
  columnClassNames?: (string | undefined)[];
  tableClassName?: string;
}

export default function ResponsiveTable({
  headers,
  rows,
  data,
  mobileCards,
  emptyText = 'No items found.',
  columnClassNames,
  tableClassName,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="py-12 text-center text-gray-400 font-medium">{emptyText}</div>
      </div>
    );
  }
  return (
    <>
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-left border-collapse ${tableClassName ?? ''}`}>
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                {headers.map((h, i) => (
                  <th key={i} className={`py-3 px-4 ${columnClassNames?.[i] ?? ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-[#fcfcfc] transition-colors">
                  {r.map((c, j) => (
                    <td key={j} className={`py-3 px-4 align-middle ${columnClassNames?.[j] ?? ''}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {mobileCards && (
        <div className="md:hidden space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {mobileCards(r, data?.[i], i)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
