export default function Emergency() {
  return <div><h1>Emergency Help</h1><p className="dangerText">If this may be an emergency, call 108 now.</p><div className="grid"><a className="button danger" href="tel:108">Call 108 Ambulance</a><a className="button" href="tel:102">Call 102 referral transport</a><a className="button" href="tel:104">Call 104 health advice</a></div><p className="muted">Offline-safe emergency numbers are static and should be periodically officially verified.</p></div>;
}
