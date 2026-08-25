import { useEffect, useState } from "react";

export default function IntroScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 4300);

    const finishTimer = window.setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`aurevis-intro ${leaving ? "leaving" : ""}`}
      role="status"
      aria-label="AUREVIS կայքը բեռնվում է"
    >
      <div className="aurevis-intro-glow" />
      <div className="aurevis-intro-ring ring-one" />
      <div className="aurevis-intro-ring ring-two" />

      <div className="aurevis-intro-content">
        <div className="aurevis-intro-logo-wrap">
          <img
            src="/assets/logo.png"
            alt="AUREVIS"
            className="aurevis-intro-logo"
          />
        </div>

        <p>PREMIUM HORECA PLATFORM</p>
        <h1>AUREVIS</h1>
        <span>Համից՝ մինչև յուրահատուկ ըմպելիք</span>

        <div className="aurevis-intro-loader">
          <i />
        </div>
      </div>
    </div>
  );
}
