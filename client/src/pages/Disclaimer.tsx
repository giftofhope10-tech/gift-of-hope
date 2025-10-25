import { Link } from 'react-router-dom'

export default function Disclaimer() {
  return (
    <div className="page privacy-page">
      <section className="page-header">
        <h1>Disclaimer</h1>
        <p className="page-subtitle">Important information about Gift of Hope</p>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{maxWidth: '900px', margin: '0 auto'}}>
            <div style={{padding: '20px', backgroundColor: '#fef3c7', borderRadius: '12px', marginBottom: '40px', borderLeft: '4px solid #f59e0b'}}>
              <p style={{fontSize: '16px', color: '#78350f', lineHeight: '1.8'}}>
                <strong>Last updated:</strong> October 2025
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>About Gift of Hope</h2>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Our Initiative</h3>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                <strong>Gift of Hope</strong> (accessible at <a href="https://www.giftofhope.online" style={{color: '#8B5CF6', fontWeight: '600'}}>www.giftofhope.online</a>) is a private, volunteer-driven initiative created to support families and individuals in need through food, education, and healthcare assistance.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Organizational Status</h2>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Registration Status</h3>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                We operate as an <strong>independent humanitarian project</strong> and are <strong>not yet registered</strong> as a formal non-profit or charitable organization with any government authority. All activities are conducted by volunteers, and all donations are used directly for aid work and project expenses unless otherwise stated.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Information Accuracy</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                While we make every effort to ensure that all information on this website is accurate and up to date, we make no warranties or representations about completeness, reliability, or accuracy. Any action you take based on the information found on this website is strictly at your own risk.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Limitation of Liability</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                Gift of Hope will not be liable for any losses or damages in connection with the use of our website, including issues related to third-party links or donation platforms.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Donation Policy</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                All donations are voluntary and final. If you have made a donation in error, please contact us within <strong>7 days</strong> at <a href="mailto:info@giftofhope.online" style={{color: '#8B5CF6', fontWeight: '600'}}>info@giftofhope.online</a> and our team will review your request.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Agreement</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                By using our website, you acknowledge and agree to this Disclaimer.
              </p>
            </div>

            <div style={{marginTop: '50px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', textAlign: 'center'}}>
              <p style={{color: '#64748b', fontSize: '16px', lineHeight: '1.8'}}>
                For questions or concerns, please contact us at{' '}
                <a href="mailto:info@giftofhope.online" style={{color: '#8B5CF6', fontWeight: '600'}}>
                  info@giftofhope.online
                </a>
              </p>
            </div>

            <div style={{marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', borderRadius: '16px', textAlign: 'center'}}>
              <h2 style={{color: 'white', fontSize: '32px', marginBottom: '16px'}}>Join Us in Making a Difference</h2>
              <p style={{color: 'rgba(255,255,255,0.95)', fontSize: '18px', marginBottom: '30px'}}>
                Together, we can bring hope to those who need it most
              </p>
              <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <Link to="/donate" className="btn" style={{background: 'white', color: '#8B5CF6', fontWeight: '600', padding: '16px 40px', fontSize: '18px', borderRadius: '10px', textDecoration: 'none', display: 'inline-block'}}>
                  Donate Now
                </Link>
                <Link to="/contact" className="btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: '600', padding: '16px 40px', fontSize: '18px', borderRadius: '10px', textDecoration: 'none', display: 'inline-block', border: '2px solid white'}}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
