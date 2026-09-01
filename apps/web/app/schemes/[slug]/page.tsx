import { ContentDetail } from "../../../components/ContentPages";

export default async function SchemeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail title="Scheme" endpoint={`/api/v1/schemes/${slug}`} />;
}
