'use client';

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select').then(mod => mod.default), {
  ssr: false,
  loading: () => <select className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl bg-gray-50" disabled><option>Loading...</option></select>,
});

export default Select;