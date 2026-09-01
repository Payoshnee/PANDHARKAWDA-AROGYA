import { apiGet, ContentRecord } from "../lib/api";

export async function ContentList({ title, endpoint, detailBase }: { title: string; endpoint: string; detailBase: string }) {
  const records = await apiGet<{ data: ContentRecord[] }>(endpoint);
  return <div><h1>{title}</h1><div className="grid two">{records.data.length ? records.data.map((r) => <article className="card" key={r.id}><h2>{r.title_en}</h2><p>{r.summary_en}</p><p className="muted">{r.source} · reviewed {r.review_date}</p><a className="button" href={`${detailBase}/${r.slug}`}>Details</a></article>) : <p>No verified results found.</p>}</div></div>;
}

export async function ContentDetail({ title, endpoint }: { title: string; endpoint: string }) {
  const record = await apiGet<{ data: ContentRecord }>(endpoint);
  return <div><h1>{record.data.title_en}</h1><p className="panel">{record.data.summary_en}</p><p className="muted">{title} · {record.data.source} · reviewed {record.data.review_date}</p><a className="button" href="/report-incorrect">Report incorrect information</a></div>;
}
