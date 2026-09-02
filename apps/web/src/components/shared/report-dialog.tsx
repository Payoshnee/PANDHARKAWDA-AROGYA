import { useState } from "react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { apiPost } from "@/lib/api"

const REASONS = [
  { value: "wrongPhone", key: "report.wrongPhone" },
  { value: "wrongSchedule", key: "report.wrongSchedule" },
  { value: "wrongAddress", key: "report.wrongAddress" },
  { value: "doctorMoved", key: "report.doctorMoved" },
  { value: "facilityClosed", key: "report.facilityClosed" },
  { value: "duplicate", key: "report.duplicate" },
  { value: "other", key: "report.other" },
]

export function ReportDialog({ open, onOpenChange, entityName }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityType?: string
  entityId?: string
  entityName: string
}) {
  const { lang } = useLang()
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

  const handleSubmit = async () => {
    try {
      await apiPost("/api/v1/reports/incorrect-info", {
        target_type: "unknown",
        target_id: entityName,
        reason,
        details: details || null,
      })
      toast.success(t("report.success", lang))
      setReason("")
      setDetails("")
      onOpenChange(false)
    } catch {
      toast.error(lang === "mr" ? "अहवाल पाठवता आला नाही" : "Could not submit report")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("report.title", lang)}</DialogTitle>
          <DialogDescription>
            {entityName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("report.reason", lang)}</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {REASONS.map(r => (
                <div key={r.value} className="flex items-center gap-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="text-sm font-normal cursor-pointer">
                    {t(r.key, lang)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">{t("report.details", lang)}</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.back", lang)}
          </Button>
          <Button onClick={handleSubmit} disabled={!reason}>
            {t("report.submit", lang)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ReportLink({ entityName }: {
  entityType?: string
  entityName: string
}) {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
      >
        {t("action.reportIncorrect", lang)}
      </button>
      <ReportDialog
        open={open}
        onOpenChange={setOpen}
        entityName={entityName}
      />
    </>
  )
}
