import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Mission() {
  useEffect(() => {
    document.title = 'Donate Now - Gift of Hope | Global Nonprofit'
  }, [])

  return (
    <div className="page mission-page">
      <section className="page-header">
        <h1>Our Mission & Vision</h1>
        <p className="page-subtitle">Transforming lives through purposeful giving</p>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px'}}>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/gift-of-hope-volunteer-work.webp" 
                alt="Gift of Hope volunteers supporting communities"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/gift-of-hope-children-education.webp" 
                alt="Children receiving education support from Gift of Hope"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/gift-of-hope-medical-care.webp" 
                alt="Healthcare and medical support provided by Gift of Hope"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="content-block" style={{textAlign: 'center', marginBottom: '60px'}}>
            <h2>Our Mission</h2>
            <p className="large-text" style={{fontSize: '22px', maxWidth: '800px', margin: '0 auto', color: 'var(--gray)'}}>
              At Gift of Hope, we believe that every act of kindness can change a life. Our mission is to bring hope and opportunity to those who need it most — by providing food, education, healthcare, and support to underprivileged communities. Together, we can create a world where compassion connects us all.
            </p>
          </div>

          <div className="content-block" style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2>Our Vision</h2>
            <p className="large-text" style={{fontSize: '22px', maxWidth: '800px', margin: '0 auto', color: 'var(--gray)'}}>
              A world where generosity flows freely, creating opportunities for everyone to thrive 
              and reach their fullest potential, regardless of circumstance.
            </p>
          </div>

          <div className="goals-section">
            <h2 className="section-title">Our Focus Areas</h2>
            <div className="goals-grid">
              <div className="goal-card">
                <div className="goal-number">01</div>
                <h3>Education & Opportunity</h3>
                <p>
                  Creating pathways to knowledge and skills that unlock potential, providing 
                  scholarships, learning resources, and mentorship programs.
                </p>
              </div>
              <div className="goal-card">
                <div className="goal-number">02</div>
                <h3>Essential Resources</h3>
                <p>
                  Ensuring access to fundamental needs - nutritious food, clean water, 
                  safe shelter, and comprehensive healthcare services.
                </p>
              </div>
              <div className="goal-card">
                <div className="goal-number">03</div>
                <h3>Community Empowerment</h3>
                <p>
                  Building capacity within communities to create lasting solutions, 
                  fostering leadership and sustainable development initiatives.
                </p>
              </div>
              <div className="goal-card">
                <div className="goal-number">04</div>
                <h3>Crisis Response</h3>
                <p>
                  Providing rapid, effective assistance during emergencies and disasters, 
                  helping communities recover and rebuild stronger.
                </p>
              </div>
              <div className="goal-card">
                <div className="goal-number">05</div>
                <h3>Health & Wellness</h3>
                <p>
                  Delivering comprehensive healthcare support, preventive services, 
                  and health education to underserved populations.
                </p>
              </div>
              <div className="goal-card">
                <div className="goal-number">06</div>
                <h3>Sustainable Solutions</h3>
                <p>
                  Developing long-term programs that create lasting impact, breaking cycles 
                  of poverty and building prosperous futures.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section" style={{marginTop: '80px', borderRadius: '32px'}}>
            <h2>Be Part of the Change</h2>
            <p>Your contribution directly supports these vital initiatives</p>
            <Link to="/donate" className="btn btn-secondary btn-large">
              Start Making Impact
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
