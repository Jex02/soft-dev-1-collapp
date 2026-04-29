'use client';

import { useEffect, useRef, useState } from 'react';
import './landingpage.css';

export default function LandingPage() {
  const [showPanel, setShowPanel] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'student' | 'schoolRep'>('student');
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showPanel) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showPanel]);

  return (
    <main className="landing-page">
      ...
      {showPanel && (
        <section className="login-panel" ref={panelRef}>
          ...
        </section>
      )}
    </main>
  );
}