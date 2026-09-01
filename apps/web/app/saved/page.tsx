"use client";

import { useState } from "react";

export default function Saved() {
  const [items, setItems] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("saved") ?? "[]") as string[];
  });
  return <div><h1>Saved</h1><p className="muted">Saved items are stored only in this browser.</p>{items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="panel">No saved doctors or facilities yet.</p>}<button onClick={() => { localStorage.removeItem("saved"); setItems([]); }}>Clear saved items</button></div>;
}
