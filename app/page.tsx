import { fetchIntervenants } from "./lib/data";
import React from 'react';

export default async function Home() {

  const intervenants = await fetchIntervenants();

  console.log(intervenants);
  return (
    <div>

    </div>
  );
}
