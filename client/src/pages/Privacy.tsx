import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="page privacy-page">
      <section className="page-header">
        <h1>Privacy Policy</h1>
        <p className="page-subtitle">Your privacy matters to us</p>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{maxWidth: '900px', margin: '0 auto'}}>
            <div style={{padding: '20px', backgroundColor: '#ede9fe', borderRadius: '12px', marginBottom: '40px', borderLeft: '4px solid #8B5CF6'}}>
              <p style={{fontSize: '18px', color: '#3730a3', lineHeight: '1.8'}}>
                <strong>Gift of Hope</strong> ("we," "our," or "us") operates the website{' '}
                <a href="https://www.giftofhope.online" style={{color: '#8B5CF6', fontWeight: '600'}}>https://www.giftofhope.online</a>{' '}
                (the "Site"). We value your privacy and are committed to protecting your personal information. This policy explains what data we collect, how we use it, and how you can contact us with questions.
              </p>
              <p style={{fontSize: '14px', color: '#64748b', marginTop: '15px'}}>
                <strong>Last updated:</strong> October 2025
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Information We Collect</h2>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Personal Data</h3>
              <p style={{color: '#64748b', marginTop: '15px'}}>
                When you use our website or make a donation, we may collect:
              </p>
              <ul style={{color: '#64748b', marginTop: '15px', paddingLeft: '25px'}}>
                <li style={{marginBottom: '10px'}}>Name and email address</li>
                <li style={{marginBottom: '10px'}}>Donation amount and payment information (processed securely by PayPal/Stripe)</li>
                <li style={{marginBottom: '10px'}}>Communication preferences for updates and newsletters</li>
                <li style={{marginBottom: '10px'}}>Technical data like IP address and browser type for website improvement</li>
              </ul>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>How We Use Your Information</h2>
              <p style={{color: '#64748b', marginTop: '15px'}}>
                We use your information to:
              </p>
              <ul style={{color: '#64748b', marginTop: '15px', paddingLeft: '25px'}}>
                <li style={{marginBottom: '10px'}}>Process and confirm your donations</li>
                <li style={{marginBottom: '10px'}}>Send you updates about our work and impact</li>
                <li style={{marginBottom: '10px'}}>Respond to your inquiries and support requests</li>
                <li style={{marginBottom: '10px'}}>Improve our website and services</li>
                <li style={{marginBottom: '10px'}}>Comply with legal and regulatory requirements</li>
              </ul>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Data Protection & Security</h2>
              <p style={{color: '#64748b', marginTop: '15px'}}>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul style={{color: '#64748b', marginTop: '15px', paddingLeft: '25px'}}>
                <li style={{marginBottom: '10px'}}>SSL encryption for all data transmission</li>
                <li style={{marginBottom: '10px'}}>Secure payment processing through trusted providers (PayPal, Stripe)</li>
                <li style={{marginBottom: '10px'}}>Regular security audits and updates</li>
                <li style={{marginBottom: '10px'}}>Limited access to personal data by authorized personnel only</li>
              </ul>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Your Rights</h2>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Data Control</h3>
              <p style={{color: '#64748b', marginTop: '15px'}}>
                You have the right to:
              </p>
              <ul style={{color: '#64748b', marginTop: '15px', paddingLeft: '25px'}}>
                <li style={{marginBottom: '10px'}}>Access your personal data</li>
                <li style={{marginBottom: '10px'}}>Request correction of inaccurate data</li>
                <li style={{marginBottom: '10px'}}>Request deletion of your data</li>
                <li style={{marginBottom: '10px'}}>Opt-out of marketing communications</li>
                <li style={{marginBottom: '10px'}}>Withdraw consent for data processing</li>
              </ul>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Cookies</h2>
              <p style={{color: '#64748b', marginTop: '15px'}}>
                We use cookies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Third-Party Links</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                Our website may include links to other sites (for example, partner organizations or payment gateways). We are not responsible for the privacy practices or content of those websites.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Updates to This Policy</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                We may update this Privacy Policy periodically. The updated version will always include the "Last updated" date at the top of this page.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Contact Us</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p style={{fontSize: '18px', fontWeight: '600', color: '#8B5CF6', marginTop: '15px'}}>
                <a href="mailto:info@giftofhope.online" style={{color: 'inherit', textDecoration: 'none'}}>
                  info@giftofhope.online
                </a>
              </p>
            </div>

            <div style={{marginTop: '50px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', textAlign: 'center'}}>
              <p style={{color: '#64748b', fontSize: '14px'}}>
                Last updated: October 2025
              </p>
            </div>

            <div style={{marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', borderRadius: '16px', textAlign: 'center'}}>
              <h2 style={{color: 'white', fontSize: '32px', marginBottom: '16px'}}>Help Us Bring Hope</h2>
              <p style={{color: 'rgba(255,255,255,0.95)', fontSize: '18px', marginBottom: '30px'}}>
                Your donation creates lasting change in communities worldwide
              </p>
              <Link to="/donate" className="btn" style={{background: 'white', color: '#8B5CF6', fontWeight: '600', padding: '16px 40px', fontSize: '18px', borderRadius: '10px', textDecoration: 'none', display: 'inline-block'}}>
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
