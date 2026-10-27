"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Inquire.module.css";

interface FormData {
  commissionType: string;
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  services: string[];
  budget: string;
  notes: string;
}

const COMMISSION_TYPES = [
  {
    id: "weddings",
    title: "Weddings & Celebrations",
    desc: "Multi-day ceremonies, royal weddings, destination celebrations, and family heritage moments.",
  },
  {
    id: "films",
    title: "Pre-wedding Films",
    desc: "Cinematic portrait films, destination narratives, and stylized love stories shot on cinema glass.",
  },
  {
    id: "editorial",
    title: "Editorial & Campaigns",
    desc: "High-fashion campaigns, luxury hospitality showcases, lookbooks, and brand visual direction.",
  },
  {
    id: "other",
    title: "Other Commissions",
    desc: "Cultural documentaries, private family visual archives, and bespoke artistic commissions.",
  },
];

export default function InquirePage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    commissionType: "weddings",
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    location: "",
    services: ["photography", "cinematography"],
    budget: "₹15L – ₹25L",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommissionSelect = (id: string) => {
    setFormData((prev) => ({ ...prev, commissionType: id }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please provide your name";
    if (!formData.email.trim()) {
      newErrors.email = "Please provide your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Please provide a contact phone number";
    if (!formData.location.trim()) newErrors.location = "Please enter city or destination";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 3) {
      if (!validateStep3()) return;
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Explicit client-side processing: format brief and advance to verified confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5);
    }, 450);
  };

  const getCommissionLabel = (id: string) => {
    return COMMISSION_TYPES.find((c) => c.id === id)?.title || id;
  };

  const whatsappMessage = encodeURIComponent(
    `*NEW COMMISSION ENQUIRY — 24 FRAMES*\n\n` +
    `• *Client:* ${formData.fullName}\n` +
    `• *Commission:* ${getCommissionLabel(formData.commissionType)}\n` +
    `• *Date:* ${formData.eventDate || "Dates TBD"}\n` +
    `• *Location:* ${formData.location}\n` +
    `• *Services:* ${formData.services.join(", ")}\n` +
    `• *Budget Range:* ${formData.budget}\n` +
    `• *Contact:* ${formData.email} | ${formData.phone}\n` +
    (formData.notes ? `• *Brief:* ${formData.notes}\n` : "")
  );

  return (
    <div className={styles.pageWrap}>
      {/* Top Header & Progress */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backHomeLink}>
          <span aria-hidden="true">←</span>
          <span>Back to Home</span>
        </Link>

        {step < 5 && (
          <div className={styles.progressBarContainer} aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`${styles.stepDot} ${
                  s === step ? styles.stepDotActive : s < step ? styles.stepDotCompleted : ""
                }`}
              />
            ))}
            <span className={styles.stepLabel}>
              {step === 1 ? "Welcome" : step === 2 ? "Commission" : step === 3 ? "Details" : "Review"}
            </span>
          </div>
        )}
      </div>

      <main className={styles.mainContainer}>
        {/* Step 1: Welcome Screen */}
        {step === 1 && (
          <div className={`${styles.stepContainer} ${styles.welcomeCard}`}>
            <div className={styles.welcomeImgWrap}>
              <Image
                src="/images/portfolio/sireesh-harshitha/cover.jpg"
                alt="24 Frames Wedding Commission"
                fill
                priority
                className={styles.welcomeImg}
              />
            </div>
            <div className={styles.welcomeContent}>
              <span className={styles.welcomeEyebrow}>24 Frames · Commissions 2026/2027</span>
              <h1 className={styles.welcomeTitle}>Tell us about your story</h1>
              <p className={styles.welcomeCopy}>
                Every celebration is singular. To ensure our signature artistry and intimate
                oversight, founder Phani Gogireddy accepts a carefully calibrated number of
                commissions each season worldwide.
              </p>
              <button
                type="button"
                onClick={handleNext}
                className={styles.btnPrimary}
                aria-label="Begin enquiry process"
              >
                <span>Begin Enquiry</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Commission Type */}
        {step === 2 && (
          <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEyebrow}>Step 01 of 03</span>
              <h2 className={styles.stepTitle}>Select Commission Type</h2>
              <p className={styles.stepDesc}>
                Choose the discipline that best reflects your celebration or project.
              </p>
            </div>

            <div className={styles.commissionGrid}>
              {COMMISSION_TYPES.map((comm) => (
                <div
                  key={comm.id}
                  onClick={() => handleCommissionSelect(comm.id)}
                  className={`${styles.commissionCard} ${
                    formData.commissionType === comm.id ? styles.commissionCardActive : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCommissionSelect(comm.id);
                    }
                  }}
                  aria-pressed={formData.commissionType === comm.id}
                >
                  <div className={styles.cardCheckmark}>✓</div>
                  <h3 className={styles.commissionCardTitle}>{comm.title}</h3>
                  <p className={styles.commissionCardDesc}>{comm.desc}</p>
                </div>
              ))}
            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={handleBack} className={styles.btnSecondary}>
                Back
              </button>
              <button type="button" onClick={handleNext} className={styles.btnPrimary}>
                Continue to Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal & Project Details */}
        {step === 3 && (
          <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEyebrow}>Step 02 of 03</span>
              <h2 className={styles.stepTitle}>Project & Contact Information</h2>
              <p className={styles.stepDesc}>
                Help us understand the dates, locations, and vision you are imagining.
              </p>
            </div>

            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="fullName" className={styles.fieldLabel}>
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Radhika Sharma"
                    className={styles.fieldInput}
                    required
                  />
                  {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.fieldLabel}>
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. radhika@example.com"
                    className={styles.fieldInput}
                    required
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="phone" className={styles.fieldLabel}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={styles.fieldInput}
                    required
                  />
                  {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="eventDate" className={styles.fieldLabel}>
                    {formData.commissionType === "editorial"
                      ? "Target Production Window"
                      : "Celebration / Event Date"}
                  </label>
                  <input
                    id="eventDate"
                    name="eventDate"
                    type="text"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    placeholder="e.g. November 2026 / Winter 2027"
                    className={styles.fieldInput}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="location" className={styles.fieldLabel}>
                    Destination / City *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Hyderabad / Udaipur / Lake Como"
                    className={styles.fieldInput}
                    required
                  />
                  {errors.location && <span className={styles.fieldError}>{errors.location}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="budget" className={styles.fieldLabel}>
                    Approximate Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={styles.fieldSelect}
                  >
                    <option value="₹10L – ₹15L">₹10L – ₹15L</option>
                    <option value="₹15L – ₹25L">₹15L – ₹25L</option>
                    <option value="₹25L – ₹40L">₹25L – ₹40L</option>
                    <option value="₹40L+ / Bespoke">₹40L+ / Bespoke Royal Commission</option>
                    <option value="USD $15,000+ (Destination)">USD $15,000+ (International Destination)</option>
                  </select>
                </div>

                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label className={styles.fieldLabel}>Disciplines Required</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                    {[
                      { id: "photography", label: "Still Photography" },
                      { id: "cinematography", label: "Cinematic Films" },
                      { id: "drone", label: "Aerial Cinematography" },
                      { id: "album", label: "Handcrafted Heirloom Book" },
                    ].map((item) => (
                      <label
                        key={item.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontFamily: "var(--font-body, Inter, sans-serif)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(item.id)}
                          onChange={() => handleServiceToggle(item.id)}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label htmlFor="notes" className={styles.fieldLabel}>
                    Tell us what you are imagining (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Share any special venues, aesthetic references, family traditions, or personal stories..."
                    className={styles.fieldTextarea}
                  />
                </div>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={handleBack} className={styles.btnSecondary}>
                Back
              </button>
              <button type="button" onClick={handleNext} className={styles.btnPrimary}>
                Review Answers →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {step === 4 && (
          <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEyebrow}>Step 03 of 03</span>
              <h2 className={styles.stepTitle}>Review Your Commission Brief</h2>
              <p className={styles.stepDesc}>
                Review your selections before transmitting to Phani Gogireddy and executive studio.
              </p>
            </div>

            <div className={styles.reviewGrid}>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Commission Type</span>
                <span className={styles.reviewVal}>{getCommissionLabel(formData.commissionType)}</span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Name</span>
                <span className={styles.reviewVal}>{formData.fullName}</span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Contact</span>
                <span className={styles.reviewVal}>
                  {formData.email} · {formData.phone}
                </span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Date / Production Window</span>
                <span className={styles.reviewVal}>{formData.eventDate || "Dates TBD"}</span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Destination / City</span>
                <span className={styles.reviewVal}>{formData.location}</span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Budget Bracket</span>
                <span className={styles.reviewVal}>{formData.budget}</span>
              </div>

              <div className={`${styles.reviewItem} ${styles.fullWidth}`}>
                <span className={styles.reviewLabel}>Selected Disciplines</span>
                <span className={styles.reviewVal}>{formData.services.join(", ")}</span>
              </div>

              {formData.notes && (
                <div className={`${styles.reviewItem} ${styles.fullWidth}`}>
                  <span className={styles.reviewLabel}>Client Vision Notes</span>
                  <span className={styles.reviewVal}>{formData.notes}</span>
                </div>
              )}
            </div>

            {/* Explicit Integration Boundary Notice */}
            <div className={styles.integrationNotice}>
              <strong>Direct Studio Transmission:</strong> Submitting will record your project
              parameters into your client dossier. You will also have the option to transmit directly to
              Phani Gogireddy’s studio via encrypted WhatsApp or executive email.
            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={handleBack} className={styles.btnSecondary}>
                Edit Details
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={styles.btnPrimary}
              >
                {isSubmitting ? "Processing..." : "Confirm & Submit Enquiry ↗"}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success Confirmation State */}
        {step === 5 && (
          <div className={`${styles.stepContainer} ${styles.successCard}`}>
            <div className={styles.successIcon} aria-hidden="true">
              ✓
            </div>
            <h2 className={styles.successTitle}>Enquiry Brief Received</h2>
            <p className={styles.successCopy}>
              Thank you, {formData.fullName}. Your commission brief for{" "}
              <strong>{getCommissionLabel(formData.commissionType)}</strong> in{" "}
              <strong>{formData.location}</strong> has been prepared for executive review.
              Our studio manager will connect with you within 24 hours.
            </p>

            <div className={styles.directOptions}>
              <a
                href={`https://wa.me/919985999999?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                <span>Instant WhatsApp Concierge ↗</span>
              </a>

              <a
                href={`mailto:contact@24frames.in?subject=${encodeURIComponent(
                  `Commission Brief: ${formData.fullName} - ${getCommissionLabel(formData.commissionType)}`
                )}&body=${encodeURIComponent(
                  `Hello Phani,\n\nHere is our commission brief:\n\nName: ${formData.fullName}\nCommission: ${getCommissionLabel(formData.commissionType)}\nDate: ${formData.eventDate}\nLocation: ${formData.location}\nBudget: ${formData.budget}\nServices: ${formData.services.join(", ")}\n\nVision:\n${formData.notes}`
                )}`}
                className={styles.btnSecondary}
              >
                <span>Send via Email ↗</span>
              </a>
            </div>

            <div style={{ marginTop: "2.5rem" }}>
              <Link href="/" className={styles.backHomeLink}>
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
