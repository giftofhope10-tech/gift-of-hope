import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setErrors({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting form:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page contact-page">
      <Helmet>
        <title>Contact Us - Gift of Hope | Get In Touch</title>
        <meta name="description" content="Contact Gift of Hope for questions about donations, volunteering, partnerships, or our humanitarian programs. We're here to help and respond within 24-48 hours." />
        <meta name="keywords" content="contact gift of hope, charity contact, donate questions, volunteer inquiry, nonprofit support, get in touch" />
        <link rel="canonical" href="https://www.giftofhope.online/contact" />
        
        <meta property="og:title" content="Contact Us - Gift of Hope" />
        <meta property="og:description" content="Get in touch with Gift of Hope for questions about donations, volunteering, or partnerships." />
        <meta property="og:url" content="https://www.giftofhope.online/contact" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Gift of Hope" />
        <meta name="twitter:description" content="We're here to help with questions about donations, volunteering, and our programs." />
      </Helmet>
      
      <section className="page-header">
        <h1>Get In Touch</h1>
        <p className="page-subtitle">We'd love to hear from you. Reach out anytime!</p>
      </section>

      <section className="content-section" style={{padding: '80px 24px'}}>
        <div className="container" style={{maxWidth: '1200px'}}>
          <div className="contact-grid">
            <div className="contact-form-wrapper">
              <div className="contact-intro">
                <h2 style={{fontSize: '32px', marginBottom: '16px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  Send Us a Message
                </h2>
                <p style={{color: '#64748b', fontSize: '16px', lineHeight: '1.6'}}>
                  Have a question, want to volunteer, or interested in partnering with us? Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="modern-contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'error' : ''}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Your Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={errors.email ? 'error' : ''}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className={errors.subject ? 'error' : ''}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className={errors.message ? 'error' : ''}
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-contact" disabled={isSubmitting}>
                  {submitted ? '✓ Message Sent Successfully!' : isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="contact-info-wrapper">
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <h3>Email Us</h3>
                <p>support@giftofhope.online</p>
                <span className="contact-desc">We'll respond within 24 hours</span>
              </div>

              <div className="contact-card">
                <div className="contact-icon">🌍</div>
                <h3>Global Reach</h3>
                <p>Helping communities worldwide</p>
                <span className="contact-desc">Making a difference everywhere</span>
              </div>

              <div className="contact-card">
                <div className="contact-icon">🤝</div>
                <h3>Get Involved</h3>
                <p>Volunteer or Partner with us</p>
                <span className="contact-desc">Join our mission of hope</span>
              </div>

              <div className="contact-card social-card">
                <div className="contact-icon">💬</div>
                <h3>Follow Our Journey</h3>
                <p>Connect with us on social media for inspiring stories and updates</p>
              </div>

              <div className="contact-card" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', color: 'white', textAlign: 'center'}}>
                <div className="contact-icon" style={{fontSize: '48px'}}>💜</div>
                <h3 style={{color: 'white'}}>Make a Difference Today</h3>
                <p style={{color: 'rgba(255,255,255,0.9)', marginBottom: '20px'}}>Your donation brings hope to families in need</p>
                <Link to="/donate" className="btn" style={{background: 'white', color: '#8B5CF6', fontWeight: '600', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block'}}>
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
