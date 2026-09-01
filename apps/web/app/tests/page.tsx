import { ContentList } from "../../components/ContentPages";

export default function Tests() {
  return <ContentList title="Lab Tests" endpoint="/api/v1/lab-tests" detailBase="/tests" />;
}
