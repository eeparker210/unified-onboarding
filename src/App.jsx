import React, { useMemo, useState } from 'react';
import {
  aiChecks,
  business,
  jobOptions,
  listingsPublishers,
  locations,
  pageHighlights,
  postLaunchTasks,
} from './lib/prototypeData';

const flowSteps = [
  'location profile',
  'account',
  'qualification',
  'handoff',
  'job',
  'brand',
  'listings',
  'pages',
  'checkout',
  'launch',
  'home',
];

const curatedJobs = {
  visibility: ['Listings launch', 'Pages launch', 'AI readiness'],
  conversion: ['Pages launch', 'CTA tune-up', 'Conversion prompts'],
  customers: ['Listings launch', 'Publisher sync', 'Follow-up recommendations'],
};

function StepRail({ currentStep }) {
  const visibleSteps = [
    { id: 'qualification', label: 'Size check' },
    { id: 'job', label: 'Primary goal' },
    { id: 'brand', label: 'Brand validation' },
    { id: 'listings', label: 'Listings' },
    { id: 'pages', label: 'Pages' },
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
  const [step, setStep] = useState('location profile');
  const [accountMode, setAccountMode] = useState('create');
  const [isQualified, setIsQualified] = useState(true);
  const [job, setJob] = useState('visibility');
  const [selectedAccent, setSelectedAccent] = useState(business.brand.secondary);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [wantsHostedDomain, setWantsHostedDomain] = useState(true);

  const activeJob = useMemo(
    () => jobOptions.find((option) => option.id === job) ?? jobOptions[0],
    [job]
  );

  const pageLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocation) ?? locations[0],
    [selectedLocation]
  );

  const goNext = () => {
    const currentIndex = flowSteps.indexOf(step);
    const nextStep = flowSteps[currentIndex + 1];
    if (nextStep) {
      setStep(nextStep);
    }
  };

  const goBack = () => {
    const currentIndex = flowSteps.indexOf(step);
    const previousStep = flowSteps[currentIndex - 1];
    if (previousStep) {
      setStep(previousStep);
    }
  };

  const startCertification = () => setStep('account');
  const submitAccount = () => setStep('qualification');
  const submitQualification = () => {
    if (isQualified) {
      setStep('job');
      return;
    }
    setStep('handoff');
  };

  const renderFlowCard = () => {
    if (step === 'location profile') {
      return (
        <div className="screen screen--directory">
          <div className="directory-topbar">
            <div className="directory-brand">
              <div className="brand-mark">L</div>
              <div>
                <strong>Location.com</strong>
                <span>Powered by Yext</span>
              </div>
            </div>
            <div className="search-pill">Search brands</div>
          </div>

          <div className="directory-grid">
            <div className="profile-column">
              <div className="hero-banner candy-banner">
                <div className="banner-copy">
                  <span className="status-badge status-badge--soft">{business.status}</span>
                  <h2>{business.name}</h2>
                  <p>{business.tagline}</p>
                </div>
              </div>

              <div className="detail-card detail-card--plain">
                <div className="action-row">
                  <button className="primary-button">Get directions</button>
                  <button className="secondary-button">Call</button>
                  <button className="secondary-button">Website</button>
                </div>

                <div className="two-column-info">
                  <div>
                    <h3>Business details</h3>
                    <ul className="info-list">
                      <li>{locations[0].address}</li>
                      <li>{business.phone}</li>
                      <li>{business.website}</li>
                      <li>{business.category}</li>
                    </ul>
                  </div>
                  <div>
                    <h3>Hours</h3>
                    <ul className="hours-list">
                      <li>
                        <span>Today</span>
                        <strong>{locations[0].hours}</strong>
                      </li>
                      <li>
                        <span>Status</span>
                        <strong>{business.openStatus}</strong>
                      </li>
                      <li>
                        <span>Locations</span>
                        <strong>{business.locationCount}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <aside className="certify-card">
              <p className="eyebrow">Uncertified profile</p>
              <h3>Claim this brand and launch a guided setup.</h3>
              <p>
                Yext already found enough public data to draft listings and local pages for {business.locationCount}{' '}
                locations.
              </p>
              <ul className="check-list">
                <li>Validate your brand once</li>
                <li>Preview listings and pages before paying</li>
                <li>Publish to customers and LLMs when you are ready</li>
              </ul>
              <button className="primary-button" onClick={startCertification}>
                Certify your brand
              </button>
            </aside>
          </div>
        </div>
      );
    }

    if (step === 'account') {
      return (
        <div className="screen screen--setup">
          <SectionIntro
            eyebrow="Step 0"
            title="Save your progress before we start building."
            body="Create an account or log in first. After that, we will tailor the onboarding flow to your business goals and prefill what we already know."
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
                  Your role
                  <input defaultValue="Owner / operator" />
                </label>
              </div>
            </div>

            <div className="panel">
              <h3>What happens next</h3>
              <ul className="check-list">
                <li>We confirm this is the right fit for self-serve onboarding</li>
                <li>We ask what outcome matters most right now</li>
                <li>We curate only the tasks needed to get you live fast</li>
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

    if (step === 'qualification') {
      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Qualification"
            title="Is self-serve onboarding the right path for this brand?"
            body="For now, this prototype routes brands with 20 locations or fewer into the guided SMB flow. Larger footprints go to sales-assisted onboarding."
            aside={<div className="metric-card"><strong>{business.locationCount}</strong><span>locations found</span></div>}
          />

          <div className="panel-grid panel-grid--two">
            <button
              className={`choice-card ${isQualified ? 'is-selected' : ''}`}
              onClick={() => setIsQualified(true)}
            >
              <strong>20 or fewer locations</strong>
              <span>Keep going with self-serve setup and preview your experience before you pay.</span>
            </button>
            <button
              className={`choice-card ${!isQualified ? 'is-selected' : ''}`}
              onClick={() => setIsQualified(false)}
            >
              <strong>More than 20 locations</strong>
              <span>Route to a sales-assisted motion instead of this self-serve flow.</span>
            </button>
          </div>

          {!isQualified ? (
            <div className="panel notice-panel">
              <h3>Sales-assisted handoff</h3>
              <p>
                This prototype does not build the lead form. It represents the branch where enterprise accounts leave the self-serve experience and enter the traditional sales flow.
              </p>
            </div>
          ) : null}

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={submitQualification}>
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
            <button className="ghost-button" onClick={() => setStep('qualification')}>
              Back
            </button>
            <button className="primary-button" onClick={() => setStep('location profile')}>
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
            aside={<div className="metric-pill">Recommended for candy retailers like you</div>}
          />

          <div className="job-grid">
            {jobOptions.map((option) => (
              <button
                className={`job-card ${option.id === job ? 'is-selected' : ''}`}
                key={option.id}
                onClick={() => setJob(option.id)}
              >
                <p className="job-card__kicker">Businesses like you use Yext to</p>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <div className="tag-row">
                  {option.outcomes.map((outcome) => (
                    <span className="tag" key={outcome}>
                      {outcome}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="panel curated-panel">
            <strong>Your curated path</strong>
            <div className="tag-row">
              {curatedJobs[job].map((item) => (
                <span className="tag tag--bold" key={item}>
                  {item}
                </span>
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
            title="Review the brand assets we found for you."
            body="We scraped public brand signals and turned them into a draft identity package. Adjust anything that looks off before we use it in your listings and pages."
            aside={<div className="metric-pill">This step is the hook: make the brand feel real fast</div>}
          />

          <div className="panel-grid brand-layout">
            <div className="brand-preview-card">
              <div className="brand-browser" style={{ '--accent': selectedAccent }}>
                <div className="brand-browser__nav">
                  <div className="logo-square">{business.brand.logoMark}</div>
                  <div className="nav-pills">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="nav-actions">
                    <span />
                    <span />
                  </div>
                </div>
                <div className="brand-browser__body">
                  <div>
                    <h2>{business.name}</h2>
                    <p>{business.tagline}</p>
                    <div className="tag-row">
                      <span className="mini-button">Shop candy</span>
                      <span className="mini-button mini-button--alt">Plan a party</span>
                    </div>
                  </div>
                  <div className="image-placeholder image-placeholder--hero">Candy wall</div>
                </div>
                <div className="brand-browser__footer">
                  <div className="text-block" />
                  <div className="text-block" />
                  <div className="text-block" />
                </div>
              </div>
              <p className="caption">This preview will shape the look of your generated pages and support your listings rollout.</p>
            </div>

            <div className="panel panel--sticky">
              <h3>Brand assets</h3>
              <div className="asset-stack">
                <div>
                  <span className="field-label">Logo</span>
                  <div className="logo-token">{business.brand.logoMark}</div>
                </div>
                <div>
                  <span className="field-label">Voice</span>
                  <div className="tag-row">
                    {business.brand.voice.map((voice) => (
                      <span className="tag" key={voice}>
                        {voice}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Images found</span>
                  <div className="thumb-row">
                    {business.brand.imageLabels.map((image) => (
                      <div className="thumb" key={image}>
                        {image}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Colors</span>
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
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={goNext}>
              Looks right, keep going
            </button>
          </div>
        </div>
      );
    }

    if (step === 'listings') {
      return (
        <div className="screen screen--setup">
          <StepRail currentStep={step} />
          <SectionIntro
            eyebrow="Listings setup"
            title="Your public listings are nearly ready to go live."
            body="Because we already found your core location data, we can pre-stage your listings on the publishers that matter most."
            aside={<div className="metric-card"><strong>3</strong><span>publishers ready now</span></div>}
          />

          <div className="delight-banner">
            <strong>Moment of delight:</strong> Yext already has enough information to publish Mom and Pop Lollipop Shop to Google Business Profile, Facebook, and Bing Places.
          </div>

          <div className="panel-grid listings-layout">
            <div className="panel">
              <h3>Recommended publishers</h3>
              <div className="publisher-list">
                {listingsPublishers.map((publisher) => (
                  <div className="publisher-row" key={publisher.name}>
                    <div>
                      <strong>{publisher.name}</strong>
                      <p>{publisher.detail}</p>
                    </div>
                    <span className={`publisher-state ${publisher.state.includes('Ready') ? 'is-ready' : ''}`}>
                      {publisher.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>Sample locations</h3>
              <div className="location-list">
                {locations.slice(0, 4).map((location) => (
                  <div className="location-row" key={location.id}>
                    <div>
                      <strong>{location.name}</strong>
                      <p>{location.address}</p>
                    </div>
                    <span className="status-inline">{location.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={goNext}>
              Continue to pages preview
            </button>
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
            aside={<div className="metric-pill">Preview generated from your brand + location data</div>}
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
                  <div>
                    <h3>Why this page works for AI</h3>
                    <ul className="check-list">
                      {pageHighlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel panel--sticky">
              <h3>AI readiness check</h3>
              <p className="muted-copy">A lightweight mental-model shift from “does this page look good?” to “can search engines and LLMs understand and cite it?”</p>
              <div className="readiness-score">
                <strong>{business.aiVisibilityScore}</strong>
                <span>AI visibility score</span>
              </div>
              <div className="readiness-list">
                {aiChecks.map((check) => (
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
              <div className="hosting-choice">
                <span className="field-label">Launch option</span>
                <button
                  className={`hosting-card ${wantsHostedDomain ? 'is-selected' : ''}`}
                  onClick={() => setWantsHostedDomain(true)}
                >
                  <strong>Use the easy button</strong>
                  <span>Publish to {business.launchUrl} with no IT work required.</span>
                </button>
                <button
                  className={`hosting-card ${!wantsHostedDomain ? 'is-selected' : ''}`}
                  onClick={() => setWantsHostedDomain(false)}
                >
                  <strong>Bring my own domain later</strong>
                  <span>Keep this staged now and connect your custom domain after launch.</span>
                </button>
              </div>
            </div>
          </div>

          <div className="footer-actions">
            <button className="ghost-button" onClick={goBack}>
              Back
            </button>
            <button className="primary-button" onClick={goNext}>
              I want to publish this
            </button>
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
            title="Everything is staged. Paying is the last step to go live."
            body="This is the PLG gate. The work you have done here will become publicly accessible to customers and more legible to LLMs as soon as you publish."
            aside={<div className="metric-pill">No more setup tasks required for the first launch</div>}
          />

          <div className="panel-grid panel-grid--two checkout-layout">
            <div className="panel panel--soft">
              <h3>{business.recommendedPlan} plan</h3>
              <div className="price-lockup">
                <strong>${business.pricePerMonth}</strong>
                <span>/ month</span>
              </div>
              <ul className="check-list">
                <li>Listings publishing for 7 locations</li>
                <li>Hosted pages on {wantsHostedDomain ? business.launchUrl : 'your custom domain later'}</li>
                <li>AI readiness insights and next-step recommendations</li>
              </ul>
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
                  <span>Listings</span>
                  <strong>Google, Facebook, Bing</strong>
                </div>
                <div className="summary-row">
                  <span>Pages</span>
                  <strong>{wantsHostedDomain ? business.launchUrl : 'Staged until custom domain is connected'}</strong>
                </div>
                <div className="summary-row">
                  <span>Primary goal</span>
                  <strong>{activeJob.title}</strong>
                </div>
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

  return <div className="prototype-shell">{renderFlowCard()}</div>;
}

export default App;
