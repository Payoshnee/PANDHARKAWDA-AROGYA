import { ContentList } from "../../components/ContentPages";

export default function Schemes() {
  return <ContentList title="Government Schemes" endpoint="/api/v1/schemes" detailBase="/schemes" />;
}
