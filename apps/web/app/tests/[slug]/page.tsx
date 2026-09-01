import { ContentDetail } from "../../../components/ContentPages";

export default async function TestDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail title="Lab test" endpoint={`/api/v1/lab-tests/${slug}`} />;
}
