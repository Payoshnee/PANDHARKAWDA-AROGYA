"use client";

import { useState } from "react";
import { apiPost } from "../../lib/api";

export default function ReportIncorrect() {
  const [done, setDone] = useState(false);
  async function submit(formData: FormData) {
    await apiPost("/api/v1/reports/incorrect-info", Object.fromEntries(formData));
    setDone(true);
  }
  return <div><h1>Report incorrect information</h1>{done ? <p className="panel">Thank you. This report was added to the verification queue.</p> : <form className="form" action={submit}><label className="field"><span>Target type</span><select name="target_type" required><option>doctor</option><option>facility</option></select></label><label className="field"><span>Target id or slug</span><input name="target_id" required /></label><label className="field"><span>Reason</span><select name="reason" required><option>Wrong number</option><option>Clinic moved</option><option>Doctor no longer practices here</option><option>Schedule incorrect</option><option>Duplicate listing</option><option>Other</option></select></label><label className="field"><span>Details</span><textarea name="details" /></label><label className="field"><span>Optional contact</span><input name="contact" /></label><button className="primary" type="submit">Submit report</button></form>}</div>;
}
