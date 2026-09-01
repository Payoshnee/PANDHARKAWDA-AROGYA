import { ContentDetail } from "../../../components/ContentPages";

export default async function ProcedureDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail title="Procedure" endpoint={`/api/v1/procedures/${slug}`} />;
}
