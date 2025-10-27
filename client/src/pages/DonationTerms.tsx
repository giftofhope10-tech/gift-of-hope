import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function DonationTerms() {
  return (
    <div className="page privacy-page">
      <Helmet>
        <title>Donation Terms & Refund Policy - Gift of Hope | Transparent Giving</title>
        <meta name="description" content="Learn about Gift of Hope's donation terms, refund policy, and how your contributions directly support families in need through food, education, and healthcare programs." />
        <meta name="keywords" content="donation terms, refund policy, charitable giving, donation receipt, nonprofit transparency, gift of hope donations" />
        <link rel="canonical" href="https://www.giftofhope.online/donation-terms" />
        
        <meta property="og:title" content="Donation Terms & Refund Policy - Gift of Hope" />
        <meta property="og:description" content="Transparent donation terms and refund policy for Gift of Hope's humanitarian programs." />
        <meta property="og:url" content="https://www.giftofhope.online/donation-terms" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Donation Terms - Gift of Hope" />
        <meta name="twitter:description" content="Learn how your donations support families in need through our transparent giving programs." />
      </Helmet>
      
      <section className="page-header">
        <h1>Donation Terms & Refund Policy</h1>
        <p className="page-subtitle">Understanding how your contributions help families in need</p>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{maxWidth: '900px', margin: '0 auto'}}>
            <div style={{padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', marginBottom: '40px', borderLeft: '4px solid #8B5CF6'}}>
              <p style={{fontSize: '18px', color: '#064e3b', lineHeight: '1.8'}}>
                Thank you for choosing to support <strong>Gift of Hope</strong>. Your contribution helps us provide food, education, and healthcare assistance to families and individuals in need. These terms explain how donations are handled and when refunds may apply.
              </p>
              <p style={{fontSize: '14px', color: '#64748b', marginTop: '15px'}}>
                <strong>Last updated:</strong> October 2025
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Nature of Donations</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                All donations made through <a href="https://www.giftofhope.online" style={{color: '#8B5CF6', fontWeight: '600'}}>www.giftofhope.online</a> are <strong>voluntary</strong> and used to support Gift of Hope's humanitarian projects and related operational expenses. Because we are a <strong>volunteer-led private initiative</strong> and not yet a registered charity, donations are <strong>not tax-deductible</strong> at this time.
              </p>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                We aim to use all donated funds effectively and transparently, prioritizing urgent relief and community support programs.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Use of Funds</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                Donations are allocated to:
              </p>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Primary Programs</h3>
              <ul style={{color: '#64748b', marginTop: '15px', paddingLeft: '25px', lineHeight: '1.8'}}>
                <li style={{marginBottom: '10px'}}>Food, water, and essential supplies for families in need</li>
                <li style={{marginBottom: '10px'}}>Educational materials and support for children</li>
                <li style={{marginBottom: '10px'}}>Medical and healthcare assistance</li>
                <li style={{marginBottom: '10px'}}>Administrative and logistics costs necessary to run the project</li>
              </ul>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Fund Flexibility</h3>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                We may adjust allocation of funds as required by local needs and emergencies.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Receipts & Confirmation</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                When you make a donation, you will receive an <strong>email confirmation or receipt</strong> via the payment platform (e.g., PayPal, Stripe, or other processor). Please ensure that your contact information is correct when submitting your donation.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Refund Policy</h2>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>General Policy</h3>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                All donations are <strong>final and non-refundable</strong>, as they are immediately allocated toward humanitarian activities.
              </p>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Exceptions</h3>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                However, if you:
              </p>
              <ul style={{color: '#64748b', marginTop: '15px', paddingLeft: '25px', lineHeight: '1.8'}}>
                <li style={{marginBottom: '10px'}}>Made an unintentional duplicate donation, or</li>
                <li style={{marginBottom: '10px'}}>Donated the wrong amount by mistake,</li>
              </ul>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                please email us within <strong>7 days</strong> of your donation at <a href="mailto:info@giftofhope.online" style={{color: '#8B5CF6', fontWeight: '600'}}>info@giftofhope.online</a>. Our team will review your request and, if appropriate, initiate a partial or full refund.
              </p>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0F172A', marginTop: '20px', marginBottom: '10px'}}>Processing Method</h3>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                Refunds will be processed using the same payment method used for the original donation.
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Payment Security</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                All donations are processed through secure, PCI-compliant third-party payment processors. Gift of Hope does <strong>not</strong> store or have access to your full payment information (such as card numbers or bank details).
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Contact Information</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                For any questions regarding donations, receipts, or refund requests, please contact:
              </p>
              <p style={{fontSize: '18px', fontWeight: '600', color: '#8B5CF6', marginTop: '15px'}}>
                <a href="mailto:info@giftofhope.online" style={{color: 'inherit', textDecoration: 'none'}}>
                  info@giftofhope.online
                </a>
              </p>
            </div>

            <div className="content-block" style={{marginBottom: '40px'}}>
              <h2>Acceptance of Terms</h2>
              <p style={{color: '#64748b', marginTop: '15px', lineHeight: '1.8'}}>
                By donating through our website or associated campaigns, you agree to this Donation Terms & Refund Policy.
              </p>
            </div>

            <div style={{marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', borderRadius: '16px', textAlign: 'center'}}>
              <h2 style={{color: 'white', fontSize: '32px', marginBottom: '16px'}}>Ready to Make a Difference?</h2>
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
