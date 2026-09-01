import { ContentList } from "../../components/ContentPages";

export default function HealthAlerts() {
  return <ContentList title="Health Alerts" endpoint="/api/v1/health-alerts" detailBase="/health-alerts" />;
}
