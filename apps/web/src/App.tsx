import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PublicLayout } from "@/components/shared/public-layout"
import { NotFoundState } from "@/components/shared/states"
import { HomePage } from "@/pages/home"
import { DoctorsDirectoryPage } from "@/pages/doctors-directory"
import { DoctorDetailPage } from "@/pages/doctor-detail"
import { VisitingSpecialistsPage } from "@/pages/visiting-specialists"
import { OpenNowPage } from "@/pages/open-now"
import { FacilitiesDirectoryPage } from "@/pages/facilities-directory"
import { FacilityDetailPage } from "@/pages/facility-detail"
import { SchemesDirectoryPage, SchemeDetailPage } from "@/pages/schemes"
import { TestsDirectoryPage, TestDetailPage, ProcedureDetailPage, MedicalExplainerPage } from "@/pages/tests-procedures"
import { HealthAlertsPage, HealthAlertDetailPage } from "@/pages/health-alerts"
import { EmergencyPage } from "@/pages/emergency"
import { AskArogyaPage } from "@/pages/ask-arogya"
import { SavedItemsPage } from "@/pages/saved"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboardPage } from "@/pages/admin/dashboard"
import {
  AdminDoctorsPage, AdminSpecialtiesPage, AdminFacilitiesPage,
  AdminSchedulesPage, AdminVisitingSessionsPage,
  AdminVerificationPage, AdminReportsPage, AdminFreshnessPage,
  AdminAuditPage, AdminUsersPage, AdminSettingsPage,
  AdminInfoPage, AdminLoginPage,
} from "@/pages/admin/admin-pages"
import { LanguageProvider } from "@/lib/language-context"

function NotFound() {
  return (
    <PublicLayout>
      <NotFoundState />
    </PublicLayout>
  )
}

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/doctors" element={<AdminLayout><AdminDoctorsPage /></AdminLayout>} />
          <Route path="/admin/specialties" element={<AdminLayout><AdminSpecialtiesPage /></AdminLayout>} />
          <Route path="/admin/facilities" element={<AdminLayout><AdminFacilitiesPage /></AdminLayout>} />
          <Route path="/admin/schedules" element={<AdminLayout><AdminSchedulesPage /></AdminLayout>} />
          <Route path="/admin/visiting-sessions" element={<AdminLayout><AdminVisitingSessionsPage /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout><AdminInfoPage title="Services" type="schemes" /></AdminLayout>} />
          <Route path="/admin/schemes" element={<AdminLayout><AdminInfoPage title="Schemes" type="schemes" /></AdminLayout>} />
          <Route path="/admin/tests" element={<AdminLayout><AdminInfoPage title="Lab Tests" type="tests" /></AdminLayout>} />
          <Route path="/admin/procedures" element={<AdminLayout><AdminInfoPage title="Procedures" type="procedures" /></AdminLayout>} />
          <Route path="/admin/knowledge" element={<AdminLayout><AdminInfoPage title="Knowledge" type="schemes" /></AdminLayout>} />
          <Route path="/admin/health-alerts" element={<AdminLayout><AdminInfoPage title="Health Alerts" type="health-alerts" /></AdminLayout>} />
          <Route path="/admin/verification" element={<AdminLayout><AdminVerificationPage /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
          <Route path="/admin/freshness" element={<AdminLayout><AdminFreshnessPage /></AdminLayout>} />
          <Route path="/admin/audit" element={<AdminLayout><AdminAuditPage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />

          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/doctors" element={<PublicLayout><DoctorsDirectoryPage /></PublicLayout>} />
          <Route path="/doctors/visiting" element={<PublicLayout><VisitingSpecialistsPage /></PublicLayout>} />
          <Route path="/doctors/:slug" element={<PublicLayout><DoctorDetailPage /></PublicLayout>} />
          <Route path="/facilities" element={<PublicLayout><FacilitiesDirectoryPage /></PublicLayout>} />
          <Route path="/facilities/:slug" element={<PublicLayout><FacilityDetailPage /></PublicLayout>} />
          <Route path="/open-now" element={<PublicLayout><OpenNowPage /></PublicLayout>} />
          <Route path="/schemes" element={<PublicLayout><SchemesDirectoryPage /></PublicLayout>} />
          <Route path="/schemes/:slug" element={<PublicLayout><SchemeDetailPage /></PublicLayout>} />
          <Route path="/tests" element={<PublicLayout><TestsDirectoryPage /></PublicLayout>} />
          <Route path="/tests/:slug" element={<PublicLayout><TestDetailPage /></PublicLayout>} />
          <Route path="/procedures/:slug" element={<PublicLayout><ProcedureDetailPage /></PublicLayout>} />
          <Route path="/medical-explainer" element={<PublicLayout><MedicalExplainerPage /></PublicLayout>} />
          <Route path="/health-alerts" element={<PublicLayout><HealthAlertsPage /></PublicLayout>} />
          <Route path="/health-alerts/:slug" element={<PublicLayout><HealthAlertDetailPage /></PublicLayout>} />
          <Route path="/emergency" element={<PublicLayout><EmergencyPage /></PublicLayout>} />
          <Route path="/ask-arogya" element={<PublicLayout fullWidth><AskArogyaPage /></PublicLayout>} />
          <Route path="/saved" element={<PublicLayout><SavedItemsPage /></PublicLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
