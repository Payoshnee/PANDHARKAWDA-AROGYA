import { ContentList } from "../../components/ContentPages";

export default function Procedures() {
  return <ContentList title="Procedures" endpoint="/api/v1/procedures" detailBase="/procedures" />;
}
