import React, { useEffect, useMemo, useState } from 'react';
import {
  aiChecks,
  business,
  jobOptions,
  listingsPublishers,
  locations,
  pageHighlights,
  postLaunchTasks,
} from './lib/prototypeData';
import appleLogo from './assets/apple-logo.png';
import facebookLogo from './assets/facebook-logo.png';
import googleLogo from './assets/google-logo.png';
import scoutImage from './assets/scout.png';

const stepRoutes = {
  'location profile': '/',
  account: '/onboarding/account',
  handoff: '/onboarding/handoff',
  job: '/onboarding/job',
  brand: '/onboarding/brand',
  listings: '/onboarding/listings',
  pages: '/onboarding/pages',
  checkout: '/onboarding/checkout',
  launch: '/launch',
  home: '/app/home',
};

const routeSteps = Object.fromEntries(
  Object.entries(stepRoutes).map(([step, route]) => [route, step])
);

const flowSteps = Object.keys(stepRoutes);

function StepRail({ currentStep }) {
  const visibleSteps = [
    { id: 'account', label: 'Create your account' },
    { id: 'job', label: 'Set your goal' },
    { id: 'brand', label: 'Validate your brand' },
    { id: 'listings', label: 'Review your listings' },
    { id: 'pages', label: 'Review your pages' },
    { id: 'checkout', label: 'Pay + publish' },
  ];

  const currentIndex = visibleSteps.findIndex((step) => step.id === currentStep);

  return (
    <div className="step-rail">
      {visibleSteps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'upcoming';

        return (
          <div className={`step-chip step-chip--${state}`} key={step.id}>
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
          </div>
        );
      })}
    </div>
  );
}

function SectionIntro({ eyebrow, title, body, aside }) {
  return (
    <div className="section-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{body}</p>
      </div>
      {aside ? <div className="intro-aside">{aside}</div> : null}
    </div>
  );
}

function App() {
  const publisherLogos = {
    'Google Business Profile': googleLogo,
    Facebook: facebookLogo,
    'Apple Business Connect': appleLogo,
  };

  const getStepFromPath = () => routeSteps[window.location.pathname] ?? 'location profile';

  const [step, setStep] = useState(getStepFromPath);
  const [accountMode, setAccountMode] = useState('create');
  const [companySize, setCompanySize] = useState('1-20');
  const [job, setJob] = useState('visibility');
  const [selectedAccent, setSelectedAccent] = useState(business.brand.secondary);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [wantsHostedDomain, setWantsHostedDomain] = useState(true);
  const [selectedPublisherName, setSelectedPublisherName] = useState('Google Business Profile');
  const [hasGeneratedFaqs, setHasGeneratedFaqs] = useState(false);
  const [productSelections, setProductSelections] = useState({
    listings: null,
    pages: null,
  });
  const [selectedListingIds, setSelectedListingIds] = useState(() =>
    locations.slice(0, 5).map((location) => location.id)
  );

  useEffect(() => {
    const syncStepFromLocation = () => {
      setStep(getStepFromPath());
    };

    window.addEventListener('popstate', syncStepFromLocation);
    syncStepFromLocation();

    return () => window.removeEventListener('popstate', syncStepFromLocation);
  }, []);

  const navigateToStep = (nextStep, { replace = false } = {}) => {
    const nextPath = stepRoutes[nextStep] ?? stepRoutes['location profile'];
    const method = replace ? 'replaceState' : 'pushState';

    window.history[method]({}, '', nextPath);
    setStep(nextStep);
  };

  const activeJob = useMemo(
    () => jobOptions.find((option) => option.id === job) ?? jobOptions[0],
    [job]
  );

  const pageLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocation) ?? locations[0],
    [selectedLocation]
  );

  const selectedOnboardingLocations = useMemo(
    () => locations.filter((location) => selectedListingIds.includes(location.id)),
    [selectedListingIds]
  );

  const remainingLocations = useMemo(
    () => locations.filter((location) => !selectedListingIds.includes(location.id)),
    [selectedListingIds]
  );

  const selectedPublisher = useMemo(
    () =>
      listingsPublishers.find((publisher) => publisher.name === selectedPublisherName) ??
      listingsPublishers[0],
    [selectedPublisherName]
  );

  const liveProducts = useMemo(
    () =>
      Object.entries(productSelections)
        .filter(([, decision]) => decision === 'live')
        .map(([product]) => product),
    [productSelections]
  );

  const draftProducts = useMemo(
    () =>
      Object.entries(productSelections)
        .filter(([, decision]) => decision === 'draft')
        .map(([product]) => product),
    [productSelections]
  );

  const displayedAiChecks = useMemo(
    () =>
      aiChecks.map((check) =>
        check.label === 'LLM answerability' && hasGeneratedFaqs
          ? {
              ...check,
              value: 'Strong',
              note: 'Generated FAQs now cover product, seasonal, and store-specific customer questions.',
            }
          : check
      ),
    [hasGeneratedFaqs]
  );

  const displayedAiVisibilityScore = hasGeneratedFaqs ? 93 : business.aiVisibilityScore;

  const removeOnboardingLocation = (locationId) => {
    setSelectedListingIds((current) => current.filter((id) => id !== locationId));
  };

  const addOnboardingLocation = (locationId) => {
    setSelectedListingIds((current) => {
      if (current.includes(locationId) || current.length >= 5) {
        return current;
      }

      return [...current, locationId];
    });
  };

  const setProductDecision = (product, decision, nextStep) => {
    setProductSelections((current) => ({
      ...current,
      [product]: decision,
    }));

    navigateToStep(nextStep);
  };

  const renderCartSummary = () => {
    const productLabels = {
      listings: 'Listings',
      pages: 'Local pages',
    };

    return (
      <div className="cart-summary-banner">
        <strong>Your bundle</strong>
        <div className="cart-summary-banner__items">
          {liveProducts.length ? (
            liveProducts.map((product) => (
              <span className="cart-pill cart-pill--live" key={product}>
                {productLabels[product]}
              </span>
            ))
          ) : (
            <span className="muted-copy">No products in your bundle yet.</span>
          )}
        </div>
      </div>
    );
  };

  const goNext = () => {
    const currentIndex = flowSteps.indexOf(step);
    const nextStep = flowSteps[currentIndex + 1];
    if (nextStep) {
      navigateToStep(nextStep);
    }
  };

  const goBack = () => {
    const currentIndex = flowSteps.indexOf(step);
    const previousStep = flowSteps[currentIndex - 1];
    if (previousStep) {
      navigateToStep(previousStep);
    }
  };

  const startCertification = () => navigateToStep('account');
  const submitAccount = () => {
    if (companySize === 'more-than-20') {
      navigateToStep('handoff');
      return;
    }

    navigateToStep('job');
  };

  const renderFlowCard = () => {
    if (step === 'location profile') {
      const primaryLocation = locations[0];
      const weeklyHours = [
        ['Monday', '9:00 AM - 8:00 PM'],
        ['Tuesday', '9:00 AM - 8:00 PM'],
        ['Wednesday', '9:00 AM - 8:00 PM'],
        ['Thursday', '9:00 AM - 8:00 PM'],
        ['Friday', '9:00 AM - 9:00 PM'],
        ['Saturday', '10:00 AM - 9:00 PM'],
        ['Sunday', '10:00 AM - 7:00 PM'],
      ];

      return (
        <div className="screen screen--directory">
          <div className="directory-topbar">
            <div className="directory-brand">
              <div className="directory-logo-mark" aria-hidden="true">
                <span className="directory-logo-mark__dot" />
                <span className="directory-logo-mark__stem" />
              </div>
              <div>
                <strong>Location.com</strong>
                <span>Powered by Yext</span>
              </div>
            </div>
            <div className="directory-search-pill">
              <span>Search brands</span>
              <div className="directory-search-pill__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M11.2 6.8a4.4 4.4 0 11-8.8 0 4.4 4.4 0 018.8 0zm-1.02 3.95a5.16 5.16 0 01-3.38 1.25A5.2 5.2 0 1112 6.8c0 1.29-.47 2.47-1.25 3.38l3.53 3.54a.4.4 0 01-.57.56l-3.53-3.53z" />
                </svg>
              </div>
            </div>
          </div>

          <nav className="directory-breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/">Shopping</a>
            <span>/</span>
            <a href="/">Illinois</a>
            <span>/</span>
            <a href="/">Chicago</a>
            <span>/</span>
            <span>{business.name}</span>
          </nav>

          <div className="hero-banner directory-hero-banner">
            <img className="directory-hero-scene" src="https://images.unsplash.com/photo-1576712967455-c8d22580e9be?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
          </div>

          <div className="directory-grid">
            <div className="profile-column">
              <div className="directory-main-column detail-card detail-card--plain">
                <div className="directory-main-stack">
                  <section className="directory-section directory-section--intro">
                    <div className="directory-status-chip">
                      <svg viewBox="0 0 256 256" aria-hidden="true">
                        <path d="M128 26a102 102 0 100 204 102 102 0 000-204zm0 180a78 78 0 110-156 78 78 0 010 156zm-6-94V84a6 6 0 0112 0v28a6 6 0 01-12 0zm6 48a10 10 0 110-20 10 10 0 010 20z" />
                      </svg>
                      <span>{business.status}</span>
                    </div>

                    <h1 className="heading heading-lead">{business.name}</h1>

                    <div className="directory-hours-status">
                      <div className="HoursStatus">
                        <span className="HoursStatus-current is-open">Open Now</span>
                        <svg className="HoursStatus-separator inline-block" viewBox="0 0 4 4" aria-hidden="true">
                          <circle cx="2" cy="2" r="2" />
                        </svg>
                        <span className="HoursStatus-future">Closes at</span>
                        <span className="HoursStatus-time"> 8:00 PM</span>
                      </div>
                    </div>

                    <div className="directory-actions">
                      <a
                        href="https://maps.google.com/?q=1457+N+Milwaukee+Ave+Chicago+IL+60622"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-primary"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 1.2A3 3 0 015 4.2c0 2.06 3 5.8 3 5.8s3-3.74 3-5.8a3 3 0 00-3-3zm0 4.2a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zM1 5.6l3-1.2v7.8L1 13.4V5.6zm5 .5l4 .9v7.8l-4-.9V6.1zm5 .9l4-1.5v7.8L11 14.8V7z" />
                        </svg>
                        <span>Get Directions</span>
                      </a>
                      <a href="https://www.momandpoplollipop.com/party-orders" target="_blank" rel="noopener noreferrer" className="button button-secondary">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M13.6 9.3V.8L8.4 1.5v8.85l5.2-1.05zM7.6 10.35V1.5L2.4.8v8.5l5.2 1.05zM0 1.6C0 1.15.36.8.8.8h14.4c.44 0 .8.35.8.8v8.83c0 .38-.27.71-.64.78l-7.04 1.41a1.7 1.7 0 01-.63 0L.64 11.2A.8.8 0 010 10.43V1.6z" />
                        </svg>
                        <span>Menu</span>
                      </a>
                      <a href="tel:+18775550118" className="button button-secondary">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M10.82 9.58c-.37-.16-.8-.06-1.06.26l-.72.88a8.4 8.4 0 01-3.44-3.44l.88-.72c.32-.26.42-.69.26-1.06L5.7 3.1a1 1 0 00-1.12-.58l-2.4.52a1 1 0 00-.8.98A11.2 11.2 0 0012.6 15.22a1 1 0 00.98-.8l.52-2.4a1 1 0 00-.58-1.12l-2.7-1.12z" />
                        </svg>
                        <span>Call</span>
                      </a>
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm5.96 7h-2.17a12.2 12.2 0 00-.75-3.22A6.43 6.43 0 0113.96 7zM8 1.63c.49 0 1.43 1.12 1.92 4.37H6.08C6.57 2.75 7.51 1.63 8 1.63zM4.96 3.78A12.2 12.2 0 004.21 7H2.04a6.43 6.43 0 012.92-3.22zM1.63 8c0-.1 0-.2.02-.3H3.9c-.03.3-.04.6-.04.9 0 .47.03.93.08 1.4H1.9A6.77 6.77 0 011.63 8zm.78 2.8h2.02c.17.83.43 1.62.77 2.42A6.44 6.44 0 012.4 10.8zm3.67 0h3.84C9.43 14.05 8.49 15.17 8 15.17c-.49 0-1.43-1.12-1.92-4.37zm4.96 2.42c.34-.8.6-1.6.77-2.42h2.02a6.44 6.44 0 01-2.79 2.42zM12.1 10c.05-.47.08-.93.08-1.4 0-.3-.01-.6-.04-.9h2.25c.02.1.02.2.02.3 0 .69-.1 1.36-.31 2h-2zm-5.2-.8a10.4 10.4 0 010-2.4h4.2a10.4 10.4 0 010 2.4H6.9z" />
                        </svg>
                        <span>Website</span>
                      </a>
                    </div>
                  </section>

                  <section className="directory-section">
                    <h2 className="heading heading-sub">Business Details</h2>

                    <div className="directory-detail-list">
                      <div className="directory-detail-item">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 1.6a4.8 4.8 0 00-4.8 4.8c0 2.18 2.93 6.08 4.21 7.68a.74.74 0 001.18 0c1.28-1.6 4.21-5.5 4.21-7.68A4.8 4.8 0 008 1.6zm0 6.8a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                        <a
                          href="https://maps.google.com/?q=1457+N+Milwaukee+Ave+Chicago+IL+60622"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-primary"
                        >
                          {primaryLocation.address}
                        </a>
                      </div>

                      <div className="directory-detail-item">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M10.82 9.58c-.37-.16-.8-.06-1.06.26l-.72.88a8.4 8.4 0 01-3.44-3.44l.88-.72c.32-.26.42-.69.26-1.06L5.7 3.1a1 1 0 00-1.12-.58l-2.4.52a1 1 0 00-.8.98A11.2 11.2 0 0012.6 15.22a1 1 0 00.98-.8l.52-2.4a1 1 0 00-.58-1.12l-2.7-1.12z" />
                        </svg>
                        <a href="tel:+18775550118" className="link-primary">
                          {business.phone}
                        </a>
                      </div>

                      <div className="directory-detail-item">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M10 1.6a.8.8 0 100 1.6h2.07L6.92 8.35a.8.8 0 101.13 1.13l5.15-5.15V6.4a.8.8 0 101.6 0V2a.8.8 0 00-.8-.8H10zM3.2 3.2A1.6 1.6 0 001.6 4.8v8A1.6 1.6 0 003.2 14.4H12a1.6 1.6 0 001.6-1.6V9.2a.8.8 0 10-1.6 0v3.6H3.2v-8h3.6a.8.8 0 000-1.6H3.2z" />
                        </svg>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="link-primary">
                          {business.website}
                        </a>
                      </div>

                      <div className="directory-detail-item directory-detail-item--social">
                        <svg viewBox="0 0 16 10" aria-hidden="true">
                          <path d="M3.2.2A3.2 3.2 0 000 3.4 3.2 3.2 0 003.2 6.6H4a.4.4 0 000-.8h-.8A2.4 2.4 0 01.8 3.4 2.4 2.4 0 013.2 1h4.4A2.4 2.4 0 0110 3.4c0 1.26-.97 2.3-2.23 2.39l-.2.01a.4.4 0 00.06.8l.2-.01A3.2 3.2 0 0010.8 3.4 3.2 3.2 0 007.6.2H3.2zm9.6 9.6A3.2 3.2 0 0016 6.6 3.2 3.2 0 0012.8 3.4H12a.4.4 0 000 .8h.8a2.4 2.4 0 012.4 2.4A2.4 2.4 0 0112.8 9H8.4A2.4 2.4 0 016 6.6c0-1.26.97-2.3 2.23-2.39l.2-.01a.4.4 0 00-.06-.8l-.2.01A3.2 3.2 0 005.2 6.6a3.2 3.2 0 003.2 3.2h4.4z" />
                        </svg>
                        <div className="directory-social-row">
                          <a href="https://maps.google.com/?q=1457+N+Milwaukee+Ave+Chicago+IL+60622" target="_blank" rel="noopener noreferrer" className="button button-social">
                            <span className="directory-social-dot directory-social-dot--google" />
                            <span>Google</span>
                          </a>
                          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="button button-social">
                            <span className="directory-social-dot directory-social-dot--tiktok" />
                            <span>TikTok</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="directory-section">
                    <h2 className="heading heading-sub">About</h2>
                    <div className="directory-meta-row">
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M3.17 9.22V3.75c0-.32.26-.58.58-.58h5.47c.31 0 .61.12.83.34l6.44 6.44a1.17 1.17 0 010 1.66l-4.88 4.88a1.17 1.17 0 01-1.66 0L3.51 10.05a1.17 1.17 0 01-.34-.83zm2.93-3.13a.88.88 0 100 1.76.88.88 0 000-1.76z" />
                      </svg>
                      <div className="directory-meta-tags">
                        <span>{business.category}</span>
                        <span className="bullet" />
                        <span>Gift Shop</span>
                      </div>
                    </div>
                  </section>

                  <section className="directory-section">
                    <h2 className="heading heading-sub">Location</h2>
                    <div className="directory-location-layout">
                      <a
                        href="https://maps.google.com/?q=1457+N+Milwaukee+Ave+Chicago+IL+60622"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="directory-map-card"
                      >
                        <div className="directory-map">
                          <div className="directory-map__road directory-map__road--one" />
                          <div className="directory-map__road directory-map__road--two" />
                          <div className="directory-map__road directory-map__road--three" />
                          <div className="directory-map__pin" />
                        </div>
                        <span className="sr-only">Open map for Mom and Pop Lollipop Shop</span>
                      </a>

                      <div className="directory-location-copy">
                        <div className="directory-location-name">{primaryLocation.name}</div>
                        <div className="directory-location-address">{primaryLocation.address}</div>
                        <a
                          href="https://maps.google.com/?q=1457+N+Milwaukee+Ave+Chicago+IL+60622"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-primary"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <aside className="certify-card">
              <div className="directory-certify-card__top">
                <h3>This profile is uncertified and using publicly sourced data</h3>
              </div>
              <div className="directory-certify-card__body">
                <p>
                  Yext customers see up to a 9% lift on Google Gemini and gain access to:
                </p>
                <ul className="check-list">
                  <li>Performance insights across AI and traditional search</li>
                  <li>Competitive benchmarking for your locations</li>
                  <li>Clear, actionable recommendations to improve visibility</li>
                  <li>AI-powered tools to manage your digital presence at scale</li>
                </ul>
                <button className="directory-certify-button" onClick={startCertification}>
                  Certify your brand
                </button>
              </div>
            </aside>

            <aside className="directory-hours-rail">
              <h2 className="heading heading-sub">Hours</h2>
              <div className="directory-hours-rail__status">
                <div className="HoursStatus">
                  <span className="HoursStatus-current is-open">Open Now</span>
                  <svg className="HoursStatus-separator inline-block" viewBox="0 0 4 4" aria-hidden="true">
                    <circle cx="2" cy="2" r="2" />
                  </svg>
                  <span className="HoursStatus-future">Closes at</span>
                  <span className="HoursStatus-time"> 8:00 PM</span>
                </div>
              </div>
              <div className="directory-hours-table">
                {weeklyHours.map(([day, hours]) => (
                  <div
                    className={`directory-hours-row ${day === 'Wednesday' ? 'is-today' : ''}`}
                    key={day}
                  >
                    <span>{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      );
    }

    if (step === 'account') {
      return (
        <div className="screen screen--setup">
          <SectionIntro
            // eyebrow="Step 0"
            title="Log in or create your Yext account"
            body="Your account is your gateway to managing your brand's presence across search engines, maps, and more."
            aside={<div className="metric-pill">Estimated setup time: 8 minutes</div>}
          />

          <div className="panel-grid panel-grid--two">
            <div className="panel panel--soft">
              <div className="toggle-row">
                <button
                  className={`toggle-pill ${accountMode === 'create' ? 'is-active' : ''}`}
                  onClick={() => setAccountMode('create')}
                >
                  Create account
                </button>
                <button
                  className={`toggle-pill ${accountMode === 'login' ? 'is-active' : ''}`}
                  onClick={() => setAccountMode('login')}
                >
                  Log in
                </button>
              </div>

              <div className="form-grid">
                <label>
                  Work email
                  <input defaultValue="owner@momandpoplollipop.com" />
                </label>
                {accountMode === 'create' ? (
                  <label>
                    Password
                    <input type="password" defaultValue="password" />
                  </label>
                ) : null}
                <label>
                  Your organization
                  <input defaultValue="Mom And Pop Lollipop Shop" />
                </label>
                <label>
                  Company size
                  <select value={companySize} onChange={(event) => setCompanySize(event.target.value)}>
                    <option value="1-20">1-20 locations</option>
                    <option value="more-than-20">More than 20 locations</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="panel">
              <h3>What happens next</h3>
              <ul className="check-list">
                <li>We use company size to route you into self-serve or sales-assisted onboarding</li>
                <li>Choose how you want Yext to improve your brand's digital presence</li>
                <li>Provide some details to make your digital presence come to life</li>
                <li>Go live, fast!</li>
              </ul>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={submitAccount}>
              Continue
            </button>
          </div>
        </div>
      );
    }

    if (step === 'handoff') {
      return (
        <div className="screen screen--setup">
          <SectionIntro
            eyebrow="Sales-assisted route"
            title="This brand needs a more hands-on onboarding path."
            body="Accounts with more than 20 locations are routed out of the SMB self-serve flow. In the real product, this is where we would hand off to the existing lead-gen or sales-assisted motion."
            aside={<div className="metric-pill">Representative placeholder only</div>}
          />

          <div className="panel-grid panel-grid--two">
            <div className="panel panel--soft">
              <h3>Why this branch exists</h3>
              <ul className="check-list">
                <li>Larger multi-location brands usually need implementation support</li>
                <li>They often have more complex governance and domain setup</li>
                <li>This keeps the SMB self-serve experience intentionally narrow</li>
              </ul>
            </div>

            <div className="panel">
              <h3>What would happen here</h3>
              <p>
                Show a lightweight handoff card, confirm contact details, and route the brand into the traditional enterprise sales cycle.
              </p>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={() => navigateToStep('account')}>
              Back
            </button>
            <button className="primary-button" onClick={() => navigateToStep('location profile')}>
              Return to location profile
            </button>
          </div>
        </div>
      );
    }

    if (step === 'job') {
      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Primary goal"
            title="What are you trying to get done first?"
            body="We will use your answer to curate the lightest onboarding path that still gets you to a meaningful win."
          />

          <div className="job-featured">
            {jobOptions
              .filter((option) => option.id === 'visibility')
              .map((option) => (
              <button
                className={`job-card ${option.id === job ? 'is-selected' : ''} ${
                  option.id === 'visibility' ? 'is-recommended' : 'is-secondary'
                }`}
                key={option.id}
                onClick={() => setJob(option.id)}
              >
                <div className="job-card__header">
                  {option.id === 'visibility' ? (
                    <span className="job-card__badge">Recommended</span>
                  ) : null}
                </div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <ul className="job-checklist">
                  {option.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="job-alternatives">
            <p className="job-alternatives__label">Or choose another goal...</p>
            <div className="job-grid">
              {jobOptions
                .filter((option) => option.id !== 'visibility')
                .map((option) => (
                  <button
                    className={`job-card ${option.id === job ? 'is-selected' : ''} is-secondary`}
                    key={option.id}
                    onClick={() => setJob(option.id)}
                  >
                    <div className="job-card__header" />
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                    <ul className="job-checklist">
                      {option.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  </button>
                ))}
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={goNext}>
              Build my onboarding path
            </button>
          </div>
        </div>
      );
    }

    if (step === 'brand') {
      const palette = [business.brand.primary, business.brand.secondary, business.brand.accent, '#1d2736'];

      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Brand validation"
            title="Review your locations and brand"
            body="We found your business locations and scraped your public brand signals. Adjust anything that looks off - this will be the foundation of your digital presence."
          />

          <div className="panel-grid brand-layout">
            <div className="panel content-panel">
              <h3>Brand assets</h3>
              <div className="asset-stack">
                <div>
                  <div className="asset-label-row">
                    <span className="field-label">Logo</span>
                    <span className="asset-edit-icon" aria-hidden="true">
                      ✎
                    </span>
                  </div>
                  <div className="logo-token">{business.brand.logoMark}</div>
                </div>
                <div>
                  <div className="asset-label-row">
                    <span className="field-label">Voice</span>
                    <span className="asset-edit-icon" aria-hidden="true">
                      ✎
                    </span>
                  </div>
                  <div className="tag-row">
                    {business.brand.voice.map((voice) => (
                      <span className="tag" key={voice}>
                        {voice}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="asset-label-row">
                    <span className="field-label">Images found</span>
                    <span className="asset-edit-icon" aria-hidden="true">
                      ✎
                    </span>
                  </div>
                  <div className="thumb-row">
                    {business.brand.imageLabels.map((image) => (
                      <div className="thumb" key={image}>
                        {image}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="asset-label-row">
                    <span className="field-label">Colors</span>
                    <span className="asset-edit-icon" aria-hidden="true">
                      ✎
                    </span>
                  </div>
                  <div className="palette-row">
                    {palette.map((color) => (
                      <button
                        className={`swatch ${selectedAccent === color ? 'is-active' : ''}`}
                        key={color}
                        onClick={() => setSelectedAccent(color)}
                        style={{ background: color }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="panel content-panel location-validation-panel">
              <div className="location-validation-header">
                <div>
                  <h3>Locations</h3>
                </div>
                <div className="scout-badge">
                  <img src={scoutImage} alt="Scout illustration" className="scout-badge__image" />
                  <span className="scout-badge__label">found by Scout</span>
                </div>
              </div>

              <div className="location-validation-grid">
                <div>
                  <div className="location-list location-list--managed">
                    {selectedOnboardingLocations.map((location) => (
                      <div className="location-row location-row--managed" key={location.id}>
                        <div>
                          <strong>{location.name}</strong>
                          <p>{location.address}</p>
                        </div>
                        <button
                          className="secondary-button secondary-button--compact"
                          onClick={() => removeOnboardingLocation(location.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div>
                  <span className="field-label">Available to add back</span>
                  <div className="location-list location-list--managed">
                    {remainingLocations.length ? (
                      remainingLocations.map((location) => (
                        <div className="location-row location-row--managed" key={location.id}>
                          <div>
                            <strong>{location.name}</strong>
                            <p>{location.address}</p>
                          </div>
                          <button
                            className="primary-button primary-button--compact"
                            onClick={() => addOnboardingLocation(location.id)}
                            disabled={selectedOnboardingLocations.length >= 5}
                          >
                            Add
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="muted-copy">All scanned locations are currently included.</p>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={goNext}>
              Start building
            </button>
          </div>
        </div>
      );
    }

    if (step === 'listings') {
      const isSelectedPublisherReady = selectedPublisher.state.includes('Ready');
      const isGooglePreview = selectedPublisher.name === 'Google Business Profile';
      const isFacebookPreview = selectedPublisher.name === 'Facebook';
      const isApplePreview = selectedPublisher.name === 'Apple Business Connect';

      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Listings setup"
            title="Your public listings are nearly ready to go live."
            body="Draft listings on the publishers that matter most, with the data you already have."
          />



          <div className="panel-grid listings-layout">
            <div className="panel">
              <h3>Recommended publishers</h3>
              <div className="delight-banner">
                <strong>Just for you</strong> Yext recommends starting with these publishers based on your vertical, your competitors, and your geography. You can always opt in to more publishers later.
              </div>
              <div className="publisher-list">
                {listingsPublishers.map((publisher) => (
                  <div className="publisher-row" key={publisher.name}>
                    <div className="publisher-row__main">
                      <div className="publisher-row__brand">
                        <img
                          src={publisherLogos[publisher.name]}
                          alt={`${publisher.name} logo`}
                          className="publisher-row__logo"
                        />
                        <strong>{publisher.name}</strong>
                      </div>
                      <span
                        className={`publisher-state publisher-state--compact ${
                          publisher.state.includes('Ready') ? 'is-ready' : ''
                        }`}
                      >
                        {publisher.state}
                      </span>
                    </div>
                    <button
                      className="secondary-button secondary-button--compact"
                      onClick={() => setSelectedPublisherName(publisher.name)}
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel map-preview-panel">
              <h3>Preview on {selectedPublisher.name}</h3>
              <div className="maps-preview">
                <div className={`maps-preview__canvas ${!isGooglePreview ? 'maps-preview__canvas--plain' : ''}`}>
                  {isGooglePreview ? (
                    <>
                      <div className="maps-preview__toolbar">
                        <span className="maps-preview__search">
                          {business.name} on {selectedPublisher.name}
                        </span>
                        <span className="maps-preview__zoom">+</span>
                      </div>
                      <div className="maps-preview__roads maps-preview__roads--one" />
                      <div className="maps-preview__roads maps-preview__roads--two" />
                      <div className="maps-preview__roads maps-preview__roads--three" />
                      <div className="maps-preview__block maps-preview__block--one" />
                      <div className="maps-preview__block maps-preview__block--two" />
                      <div className="maps-preview__block maps-preview__block--three" />
                      <div className="maps-preview__pin" />
                    </>
                  ) : null}
                  {isGooglePreview ? (
                    <div className="maps-preview__card">
                      <div className="maps-preview__photos">
                        <div className="maps-preview__thumb maps-preview__thumb--main">Storefront</div>
                        <div className="maps-preview__photo-strip">
                          <div className="maps-preview__thumb maps-preview__thumb--small">Candy wall</div>
                          <div className="maps-preview__thumb maps-preview__thumb--small">Gift boxes</div>
                        </div>
                      </div>
                      <div className="maps-preview__content">
                        <div className="maps-preview__eyebrow">{selectedPublisher.name}</div>
                        <div className="maps-preview__rating">
                          <strong>{business.name}</strong>
                          <span>4.8 ★★★★☆ (218) · {business.category}</span>
                        </div>
                        <div className="maps-preview__meta">
                          <span className="maps-preview__status maps-preview__status--open">{business.openStatus}</span>
                          <span>{business.closeTime}</span>
                          <span>In-store shopping</span>
                        </div>
                        <p>{locations[0].address}</p>
                        <p>{business.phone}</p>
                        <div className="maps-preview__chips">
                          <span>Candy</span>
                          <span>Party favors</span>
                          <span>Gift boxes</span>
                        </div>
                        <div className="maps-preview__actions">
                          <span>Directions</span>
                          <span>Call</span>
                          <span>Website</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {isFacebookPreview ? (
                    <div className="platform-card platform-card--facebook">
                      <div className="platform-card__header">
                        <img
                          src={publisherLogos[selectedPublisher.name]}
                          alt={`${selectedPublisher.name} logo`}
                          className="platform-card__network-logo"
                        />
                        <span>Facebook Page Preview</span>
                      </div>
                      <div className="platform-card__hero">Storefront cover photo</div>
                      <div className="platform-card__body">
                        <div className="platform-card__identity">
                          <div className="platform-card__avatar">{business.brand.logoMark}</div>
                          <div>
                            <strong>{business.name}</strong>
                            <p>{business.category} · Messenger enabled</p>
                          </div>
                        </div>
                        <p>{business.summary}</p>
                        <div className="platform-card__meta-list">
                          <span>{business.openStatus} · {business.closeTime}</span>
                          <span>{locations[0].address}</span>
                          <span>{business.phone}</span>
                        </div>
                        <div className="platform-card__actions">
                          <span>Call now</span>
                          <span>Get directions</span>
                          <span>Send message</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {isApplePreview ? (
                    <div className="platform-card platform-card--apple">
                      <div className="platform-card__header">
                        <img
                          src={publisherLogos[selectedPublisher.name]}
                          alt={`${selectedPublisher.name} logo`}
                          className="platform-card__network-logo"
                        />
                        <span>Apple place card preview</span>
                      </div>
                      <div className="platform-card__body platform-card__body--apple">
                        <div className="platform-card__identity">
                          <div className="platform-card__avatar platform-card__avatar--apple">
                            {business.brand.logoMark}
                          </div>
                          <div>
                            <strong>{business.name}</strong>
                            <p>{business.category}</p>
                          </div>
                        </div>
                        <div className="platform-card__meta-list">
                          <span>{locations[0].address}</span>
                          <span>{business.phone}</span>
                          <span>{business.openStatus} · {business.closeTime}</span>
                        </div>
                        <div className="platform-card__actions platform-card__actions--minimal">
                          <span>Directions</span>
                          <span>Call</span>
                          <span>Website</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

              </div>

              {!isSelectedPublisherReady ? (
                <div className="publisher-task-panel">
                  <div className="publisher-task-panel__header">
                    <strong>1 task left before you can publish</strong>
                    <span className="publisher-state">Action required</span>
                  </div>

                  <div className="publisher-task-upload">
                    <div className="publisher-task-upload__preview">{business.brand.logoMark}</div>
                    <div className="publisher-task-upload__copy">
                      <strong>Upload a compliant logo</strong>
                      <p>Recommended size: 256 x 256 px. Minimum accepted size: 64 x 64 px.</p>
                    </div>
                    <button className="primary-button primary-button--compact">Add logo</button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <div className="footer-actions footer-actions--stacked">
              <button
                className="ghost-button"
                onClick={() => setProductDecision('listings', 'skip', 'pages')}
              >
                Skip for now
              </button>
              <button
                className="secondary-button"
                onClick={() => setProductDecision('listings', 'draft', 'pages')}
              >
                Continue with listings draft
              </button>
              <button
                className="primary-button"
                onClick={() => setProductDecision('listings', 'live', 'pages')}
              >
                Add listings to cart
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 'pages') {
      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Pages preview"
            title="We generated draft location pages on a staging domain."
            body={`Because you chose “${activeJob.title},” we are recommending pages alongside listings. Review a sample page, then decide whether you want to publish on your own domain or use the faster location.com launch option.`}
          />

          <div className="panel-grid pages-layout">
            <div className="page-preview-shell">
              <div className="page-preview-topbar">
                <div className="page-url">preview.{business.launchUrl}/{pageLocation.id}</div>
                <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="page-preview-canvas">
                <div className="page-preview-hero" style={{ '--accent': selectedAccent }}>
                  <div>
                    <span className="status-badge">Open now</span>
                    <h2>{pageLocation.name}</h2>
                    <p>{pageLocation.address}</p>
                    <div className="tag-row">
                      <span className="mini-button">Call store</span>
                      <span className="mini-button mini-button--alt">Get directions</span>
                    </div>
                  </div>
                  <div className="image-placeholder">Signature candy display</div>
                </div>
                <div className="page-preview-sections">
                  <div>
                    <h3>About this location</h3>
                    <p>{business.summary}</p>
                  </div>
                  {hasGeneratedFaqs ? (
                    <div className="page-faq-block">
                      <h3>Popular questions</h3>
                      <div className="page-faq-list">
                        <div>
                          <strong>Do you offer sugar-free candy?</strong>
                          <p>Yes. Each location carries a rotating mix of sugar-free gummies, hard candy, and gift-ready treats.</p>
                        </div>
                        <div>
                          <strong>Can I place a party order?</strong>
                          <p>Yes. You can order party favors, custom candy mixes, and gift boxes for birthdays, showers, and office events.</p>
                        </div>
                        <div>
                          <strong>Do all stores carry the same products?</strong>
                          <p>Core favorites are available everywhere, with seasonal assortments and neighborhood-specific picks varying by location.</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="panel panel--sticky">
              <h3>AI readiness check</h3>
              <p className="muted-copy">In our AI-first digital world, how your page performs with LLMs is even more important than how it looks.</p>

              <div className="readiness-score">
                <strong>{displayedAiVisibilityScore}</strong>
                <span>AI visibility score</span>
              </div>
              <div className="readiness-list">
                {displayedAiChecks.map((check) => (
                  <div className="readiness-row" key={check.label}>
                    <div>
                      <strong>{check.label}</strong>
                      <p>{check.note}</p>
                    </div>
                    <span className={`publisher-state ${check.value === 'Strong' ? 'is-ready' : ''}`}>
                      {check.value}
                    </span>
                  </div>
                ))}
              </div>
                            {!hasGeneratedFaqs ? (
                <button className="ai-action-button" onClick={() => setHasGeneratedFaqs(true)}>
                  <span className="ai-action-button__icon" aria-hidden="true">
                    ✦
                  </span>
                  Generate FAQs
                </button>
              ) : null}
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <div className="footer-actions footer-actions--stacked">
              <button
                className="ghost-button"
                onClick={() => setProductDecision('pages', 'skip', 'checkout')}
              >
                Skip for now
              </button>
              <button
                className="secondary-button"
                onClick={() => setProductDecision('pages', 'draft', 'checkout')}
              >
                Continue with pages draft
              </button>
              <button
                className="primary-button"
                onClick={() => setProductDecision('pages', 'live', 'checkout')}
              >
                Add pages to cart
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 'checkout') {
      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Pay + publish"
            title="Go live now, or come back any time to launch"
            body="The setup you've done will become publicly accessible to customers and more legible to LLMs as soon as you publish."
          />

          <div className="panel-grid panel-grid--two checkout-layout">
            <div className="panel panel--soft">
              <h3>{business.recommendedPlan} plan</h3>
              <div className="price-lockup">
                <strong>${business.pricePerMonth}</strong>
                <span>/ month</span>
              </div>
              <ul className="check-list">
                {liveProducts.length ? (
                  liveProducts.map((product) => (
                    <li key={product}>
                      {product === 'listings'
                        ? `Listings publishing for ${selectedOnboardingLocations.length} locations`
                        : `Hosted pages on ${wantsHostedDomain ? business.launchUrl : 'your custom domain later'}`}
                    </li>
                  ))
                ) : (
                  <li>No products are in your cart yet. Add a license?</li>
                )}
                <li>AI readiness insights and next-step recommendations</li>
              </ul>
              {!liveProducts.length ? (
                <div className="checkout-empty-actions">
                  <button
                    className="secondary-button secondary-button--compact"
                    onClick={() => setProductSelections((current) => ({ ...current, pages: 'live' }))}
                  >
                    Add Pages
                  </button>
                  <button
                    className="secondary-button secondary-button--compact"
                    onClick={() => setProductSelections((current) => ({ ...current, listings: 'live' }))}
                  >
                    Add Listings
                  </button>
                </div>
              ) : null}
              {draftProducts.length ? (
                <div className="checkout-note">
                  <strong>Saved as draft:</strong> {draftProducts.join(' and ')}
                </div>
              ) : null}
              <div className="form-grid">
                <label>
                  Cardholder name
                  <input defaultValue="Martha Pop" />
                </label>
                <label>
                  Billing email
                  <input defaultValue="owner@momandpoplollipop.com" />
                </label>
              </div>
            </div>
            <div className="panel">
              <h3>What publishes immediately</h3>
              <div className="summary-stack">
                  <div className="summary-row">
                  <span>Primary goal</span>
                  <strong>{activeJob.title}</strong>
                </div>
                {productSelections.listings === 'live' ? (
                  <div className="summary-row">
                    <span>Listings</span>
                    <strong>Google, Facebook, Apple</strong>
                  </div>
                ) : null}
                {productSelections.pages === 'live' ? (
                  <div className="summary-row">
                    <span>Pages</span>
                    <strong>{wantsHostedDomain ? business.launchUrl : 'Staged until custom domain is connected'}</strong>
                  </div>
                ) : null}
                {!liveProducts.length ? (
                  <div className="summary-row">
                    <span>Publish now</span>
                    <strong>Nothing selected yet</strong>
                  </div>
                ) : null}

              </div>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={goNext}>
              Pay and publish
            </button>
          </div>
        </div>
      );
    }

    if (step === 'launch') {
      return (
        <div className="screen screen--celebration">
          <div className="celebration-card">
            <p className="eyebrow">You are live</p>
            <h1>{business.name} just launched on Yext.</h1>
            <p className="lead">
              Your listings are publishing now, and your pages are {wantsHostedDomain ? `live at ${business.launchUrl}` : 'staged for your custom domain connection'}.
            </p>
            <div className="launch-stats">
              <div>
                <strong>7</strong>
                <span>locations live</span>
              </div>
              <div>
                <strong>3</strong>
                <span>publishers activated</span>
              </div>
              <div>
                <strong>{business.aiVisibilityScore}</strong>
                <span>AI readiness score</span>
              </div>
            </div>
            <div className="tag-row">
              <span className="tag tag--bold">Listings launched</span>
              <span className="tag tag--bold">Pages launched</span>
              <span className="tag tag--bold">More tasks waiting in home</span>
            </div>
            <div className="footer-actions footer-actions--center">
              <button className="primary-button" onClick={goNext}>
                Go to my home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="screen screen--dashboard">
        <aside className="side-nav">
          <div className="side-nav__brand">
            <div className="brand-mark brand-mark--small">MP</div>
            <div>
              <strong>{business.name}</strong>
              <span>{business.locationCount} listings live</span>
            </div>
          </div>
          <nav>
            <button className="nav-link is-active">Home</button>
            <button className="nav-link">Listings</button>
            <button className="nav-link">Pages</button>
            <button className="nav-link">Action Center</button>
            <button className="nav-link">Reviews</button>
          </nav>
        </aside>

        <main className="dashboard-main">
          <SectionIntro
            eyebrow="Platform home"
            title={`Keep improving ${activeJob.title.toLowerCase()}.`}
            body="Day one asked you to do the minimum needed to launch. From here, Yext keeps surfacing the next best actions to improve performance and expand into adjacent jobs to be done."
            aside={<button className="secondary-button">Launch another workflow</button>}
          />

          <div className="dashboard-banner">
            <strong>Live now:</strong> Listings are publishing across your top publishers and your hosted pages are available at {business.launchUrl}.
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <strong>7</strong>
              <span>Total locations</span>
            </div>
            <div className="metric-card">
              <strong>3</strong>
              <span>Active publishers</span>
            </div>
            <div className="metric-card">
              <strong>12</strong>
              <span>New actions available</span>
            </div>
            <div className="metric-card">
              <strong>78</strong>
              <span>AI visibility score</span>
            </div>
          </div>

          <div className="panel-grid dashboard-layout">
            <div className="panel">
              <h3>Recommended next tasks</h3>
              <div className="task-list">
                {postLaunchTasks.map((task) => (
                  <div className="task-row" key={task.title}>
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.description}</p>
                    </div>
                    <span className="tag">{task.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>Launch recap</h3>
              <div className="summary-stack">
                <div className="summary-row">
                  <span>Chosen goal</span>
                  <strong>{activeJob.title}</strong>
                </div>
                <div className="summary-row">
                  <span>Hosted URL</span>
                  <strong>{business.launchUrl}</strong>
                </div>
                <div className="summary-row">
                  <span>Brand profile</span>
                  <strong>Validated</strong>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const shouldShowBundleSummary = ['listings', 'pages', 'checkout'].includes(step);

  return (
    <div className="prototype-shell">
      {shouldShowBundleSummary ? renderCartSummary() : null}
      {renderFlowCard()}
    </div>
  );
}

export default App;
