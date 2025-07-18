"use client"

import { useEffect, useRef, useState } from "react"

export default function ContactSection() {
    const sectionRef = useRef(null)
    const [formData, setFormData] = useState({ name: "", email: "", message: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in")
                    }
                })
            },
            { threshold: 0.3 },
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setSubmitted(true)
        setIsSubmitting(false)

        // Reset after 3 seconds
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: "", email: "", message: "" })
        }, 3000)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <section ref={sectionRef} className="contact-section">
            <div className="contact-background">
                <div className="contact-grid"></div>
                <div className="contact-orbs">
                    <div className="contact-orb contact-orb-1"></div>
                    <div className="contact-orb contact-orb-2"></div>
                    <div className="contact-orb contact-orb-3"></div>
                </div>
            </div>

            <div className="contact-container">
                <div className="contact-content">
                    <div className="contact-header">
                        <h2 className="contact-title">Feedbacks are welcome!</h2>
                        <p className="contact-subtitle">
                            Anything is fine. feel free to contact me. I will try to get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="contact-main">
                        <div className="contact-info">
                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div className="contact-info-content">
                                    <h3>Email</h3>
                                    <a href="mailto:example@gmail.com" className="contact-link">
                                        draveos20@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                                    </svg>
                                </div>
                                <div className="contact-info-content">
                                    <h3>mails..contact..anything!</h3>
                                    <p>Available anytime. Most likely.</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12,6 12,12 16,14"></polyline>
                                    </svg>
                                </div>
                                <div className="contact-info-content">
                                    <h3>Response Time</h3>
                                    <p>Within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                    <label className="form-label">Name</label>
                                </div>

                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                    <label className="form-label">Email</label>
                                </div>

                                <div className="form-group">
                  <textarea
                      name="message"
                      placeholder="Tell me about your project or question..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="form-textarea"
                      rows="5"
                  ></textarea>
                                    <label className="form-label">Message</label>
                                </div>

                                <button type="submit" className="form-submit" disabled={isSubmitting || submitted}>
                                    {isSubmitting ? (
                                        <div className="submit-loading">
                                            <div className="loading-spinner"></div>
                                            Sending...
                                        </div>
                                    ) : submitted ? (
                                        <div className="submit-success">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20,6 9,17 4,12"></polyline>
                                            </svg>
                                            Message Sent!
                                        </div>
                                    ) : (
                                        <>
                                            Send Message
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
