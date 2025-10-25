import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ThankYou() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="page thankyou-page">
      <section className="thankyou-section">
        <div className="container">
          <div className="thankyou-content">
            <div className="success-icon">✓</div>
            <h1>You're Amazing!</h1>
            <p className="large-text" style={{fontSize: '20px', color: 'var(--gray)', marginBottom: '40px'}}>
              Your contribution has been successfully received. You've just made a real, 
              tangible difference in someone's life.
            </p>

            <div className="confirmation-card">
              <h3>What Happens Next</h3>
              <div className="steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <div>
                    <strong style={{display: 'block', marginBottom: '8px', color: 'var(--dark)'}}>Confirmation Sent</strong>
                    <p style={{color: 'var(--gray)', margin: 0}}>
                      Check your inbox for a detailed receipt and tax documentation
                    </p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <div>
                    <strong style={{display: 'block', marginBottom: '8px', color: 'var(--dark)'}}>Immediate Action</strong>
                    <p style={{color: 'var(--gray)', margin: 0}}>
                      Your contribution is processed and allocated to active programs
                    </p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <div>
                    <strong style={{display: 'block', marginBottom: '8px', color: 'var(--dark)'}}>Impact Updates</strong>
                    <p style={{color: 'var(--gray)', margin: 0}}>
                      Receive regular updates showing the direct results of your generosity
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="message-card">
              <h3>Your Impact Matters</h3>
              <p style={{color: 'var(--gray)', lineHeight: '1.8', marginBottom: '20px'}}>
                Thanks to generous individuals like you, we can continue creating positive 
                change in communities worldwide. Your contribution supports education, healthcare, 
                essential resources, and emergency relief for those who need it most.
              </p>
              <p style={{color: 'var(--gray)', lineHeight: '1.8'}}>
                Every dollar you contribute creates measurable, lasting impact. From everyone 
                we serve, thank you for believing in our mission and investing in a brighter, 
                more hopeful future.
              </p>
            </div>

            <div className="action-buttons">
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
              <Link to="/mission" className="btn btn-secondary">
                Explore Our Mission
              </Link>
            </div>

            <div style={{marginTop: '60px', textAlign: 'center', paddingTop: '40px', borderTop: '2px solid var(--bg)'}}>
              <h4 style={{fontFamily: 'Poppins, sans-serif', fontSize: '20px', marginBottom: '12px'}}>
                Share the Impact
              </h4>
              <p style={{color: 'var(--gray)', maxWidth: '600px', margin: '0 auto'}}>
                Help us reach more people by sharing our mission with your community. 
                Together, we can create even greater positive change.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
