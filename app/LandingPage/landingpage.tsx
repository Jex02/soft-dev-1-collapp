'use client';

import { useEffect, useRef, useState } from 'react';
import './landingpage.css';
import StudentLogin from './Register/StudentLogin';
import SchoolRepLogin from './Register/SchoolRepLogin';
import SignUp from './Register/SignUp';

export default function LandingPage() {
  const [panelType, setPanelType] = useState<'studentLogin' | 'schoolRepLogin' | 'signup' | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const showPanel = Boolean(panelType);

  useEffect(() => {
    if (panelType) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [panelType]);

  const openPanel = (type: 'studentLogin' | 'schoolRepLogin' | 'signup') => {
    setPanelType(type);
  };

  return (
    <main className="landing-page">
      <section className={`hero ${showPanel ? 'hero--compact' : ''}`}>
        <div className="hero__content">
          <p className="hero__eyebrow">COLLAPP</p>
          <h1 className="hero__heading">
            Streamline your college journey from application to acceptance.
          </h1>
          <p className="hero__subtext">
            Build a polished application workflow for students and school representatives, from
            program search to submission review.
          </p>

          <div className="hero__actions">
            <button
              type="button"
              className={`button ${panelType === 'studentLogin' ? 'button--primary' : 'button--secondary'}`}
              onClick={() => openPanel('studentLogin')}
            >
              Student Login
            </button>
            <button
              type="button"
              className={`button ${panelType === 'schoolRepLogin' ? 'button--primary' : 'button--secondary'}`}
              onClick={() => openPanel('schoolRepLogin')}
            >
              School Rep Login
            </button>
            <button
              type="button"
              className={`button ${panelType === 'signup' ? 'button--primary' : 'button--secondary'}`}
              onClick={() => openPanel('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {showPanel && (
        <div ref={panelRef}>
          {panelType === 'studentLogin' ? (
            <StudentLogin onSwitchToSignUp={() => openPanel('signup')} />
          ) : panelType === 'schoolRepLogin' ? (
            <SchoolRepLogin onSwitchToSignUp={() => openPanel('signup')} />
          ) : (
            <SignUp onSwitchToLogin={() => openPanel('studentLogin')} />
          )}
        </div>
      )}

      <section className="feature-section">
        <div className="feature-left-card">
          <div className="feature-heading">
            <h2>Simplify Your College Journey</h2>
          </div>
          <div className="feature-card-block">
            <p className="feature-card-title">For Students</p>
            <p className="feature-card-description">
              Track all your applications, deadlines, and requirements in one organized dashboard.
              Never miss another deadline or lose important documents.
            </p>
          </div>
          <div className="feature-card-block">
            <p className="feature-card-title">For School Representatives</p>
            <p className="feature-card-description">
              Streamline your admissions process with digital document review, application
              management, and seamless communication with prospective students.
            </p>
          </div>
          <div className="feature-actions feature-actions--left">
            <button type="button" className="button button--dark" onClick={() => openPanel('signup')}>
              Get Started
            </button>
            <button type="button" className="button button--secondary" onClick={() => openPanel('studentLogin')}>
              Learn More
            </button>
          </div>
        </div>
        <div className="feature-section__image" aria-hidden="true">
          <img
            className="feature-image"
            src="/landingpict.jpeg"
            alt="Landing page college experience image"
          />
        </div>
      </section>

      <section className="colleges-section">
        <div className="section-heading-row">
          <p className="section-eyebrow">COLLEGES REGISTERED</p>
          <h2 className="section-heading">Trusted institutions using COLLAPP</h2>
        </div>
        <div className="college-grid">
          <article className="college-card">
            <div className="college-logo-wrap">
              <img className="college-logo" src="/CitLogo.png" alt="Cebu Institute of Technology logo" />
            </div>
            <h3>Cebu Institute of Technology - University</h3>
            <p>
              Engineering & Technology Excellence. One of the Philippines' leading technological
              universities, CIT-U offers comprehensive programs in engineering, computer science, and
              applied sciences.
            </p>
          </article>
          <article className="college-card">
            <div className="college-logo-wrap">
              <img className="college-logo" src="/usclogo.png" alt="University of San Carlos logo" />
            </div>
            <h3>University of San Carlos</h3>
            <p>
              Centuries of Academic Tradition. USC combines rich heritage with modern innovation across
              multiple disciplines, from liberal arts to medicine.
            </p>
          </article>
          <article className="college-card">
            <div className="college-logo-wrap">
              <img className="college-logo" src="/Uplogo.png" alt="University of the Philippines logo" />
            </div>
            <h3>University of the Philippines</h3>
            <p>
              The Nation's Premier University. UP is a hub for national leaders and innovators, with
              rigorous academic programs and research opportunities.
            </p>
          </article>
          <article className="college-card">
            <div className="college-logo-wrap">
              <img className="college-logo" src="/usl.png" alt="University of Saint Louis logo" />
            </div>
            <h3>University of Saint Louis</h3>
            <p>
              Excellence in Northern Luzon. A premier Catholic educational institution focused on
              quality programs and student success through COLLLAPP's simplified application system.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}