'use client';

import { useEffect, useState } from 'react';

export default function Greeting() {
  const [greeting, setGreeting] = useState('Good Day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <h1 className="text-xl font-black text-[#112233] oswald uppercase tracking-wide">
      {greeting}, Ever Peak Adventures
    </h1>
  );
}