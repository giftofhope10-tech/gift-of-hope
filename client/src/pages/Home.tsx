import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Home() {
  return (
    <div className="page home-page">
      <Helmet>
        <title>Gift Of Hope - Donation | Global Nonprofit Helping Families Worldwide</title>
        <meta name="description" content="Gift Of Hope - Donation: A global nonprofit organization helping families through food, education, and healthcare. Donate securely online to bring hope worldwide." />
        <meta name="keywords" content="Gift Of Hope, Donation, Global Nonprofit, Help Families, Charity Organization, Food Donation, Education Support, Healthcare Charity, Online Donation, Global NGO" />
        <link rel="canonical" href="https://www.giftofhope.online/" />
        
        <meta property="og:title" content="Gift Of Hope - Donation | Global Nonprofit Helping Families Worldwide" />
        <meta property="og:description" content="Join our global mission to provide food, education, and healthcare to families in need. Every donation makes a lasting impact." />
        <meta property="og:url" content="https://www.giftofhope.online/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gift Of Hope - Donation" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://www.giftofhope.online/logo-square.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gift Of Hope | Global Nonprofit Empowering Communities" />
        <meta name="twitter:description" content="Make a difference today. Donate to support food, education & healthcare programs for families worldwide." />
        <meta name="twitter:image" content="https://www.giftofhope.online/logo-square.png" />
      </Helmet>
      
      <section className="hero">
        <img 
          src="/images/aid-worker-delivery.webp" 
          alt="Gift of Hope volunteers helping communities"
          className="hero-bg"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
        <div className="hero-bg-gradient"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Together, We Bring Hope to Every Heart</h1>
          <p className="hero-subtitle">
            Gift of Hope is a community-driven nonprofit helping families through food, education, and healthcare support. Every act of kindness can change a life.
          </p>
          <div className="hero-buttons">
            <Link to="/donate" className="btn btn-primary btn-large">
              Donate Now
            </Link>
            <Link to="/about" className="btn btn-secondary btn-large">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="impact-section" style={{padding: '60px 0', background: 'var(--bg-secondary)'}}>
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <p className="section-subtitle">Creating real change in communities worldwide</p>
          <div className="impact-stats" style={{display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '40px', maxWidth: '600px', margin: '40px auto 0'}}>
            <div style={{textAlign: 'center', padding: '20px'}}>
              <div style={{fontSize: '48px', fontWeight: '700', color: '#8B5CF6', marginBottom: '10px'}}>1,200+</div>
              <div style={{fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500'}}>🥣 Meals Provided</div>
            </div>
            <div style={{textAlign: 'center', padding: '20px'}}>
              <div style={{fontSize: '48px', fontWeight: '700', color: '#EC4899', marginBottom: '10px'}}>350+</div>
              <div style={{fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500'}}>🎓 Children Educated</div>
            </div>
            <div style={{textAlign: 'center', padding: '20px'}}>
              <div style={{fontSize: '48px', fontWeight: '700', color: '#D97706', marginBottom: '10px'}}>50+</div>
              <div style={{fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500'}}>🏠 Families Supported Monthly</div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-showcase" style={{padding: '60px 0'}}>
        <div className="container">
          <h2 className="section-title">Our Work in Action</h2>
          <p className="section-subtitle">See how your donations create real impact</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '50px', maxWidth: '800px', margin: '50px auto 0'}}>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/aid-worker-delivery.webp" 
                alt="Gift of Hope volunteer delivering food to families in need"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover', display: 'block'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
              <div style={{padding: '20px', background: 'var(--card-bg)'}}>
                <h3 style={{color: '#7C3AED', marginBottom: '10px', fontWeight: '700'}}>Food Distribution</h3>
                <p style={{color: 'var(--text-secondary)'}}>Delivering nutritious meals to families facing food insecurity worldwide</p>
              </div>
            </div>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/education-child-reading.webp" 
                alt="Child receiving education support through Gift of Hope"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover', display: 'block'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
              <div style={{padding: '20px', background: 'var(--card-bg)'}}>
                <h3 style={{color: '#DB2777', marginBottom: '10px', fontWeight: '700'}}>Education Support</h3>
                <p style={{color: 'var(--text-secondary)'}}>Empowering children through access to books, schools, and learning resources</p>
              </div>
            </div>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/healthcare-support.webp" 
                alt="Healthcare support provided by Gift of Hope volunteers"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover', display: 'block'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
              <div style={{padding: '20px', background: 'var(--card-bg)'}}>
                <h3 style={{color: '#D97706', marginBottom: '10px', fontWeight: '700'}}>Healthcare Support</h3>
                <p style={{color: 'var(--text-secondary)'}}>Providing essential medical care and health services to underserved communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">How You Can Help</h2>
          <p className="section-subtitle">
            Your support makes a real difference in people's lives
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Donate</h3>
              <p>Your generosity provides food, education, and healthcare to those who need it most.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Compassion</h3>
              <p>We believe every person deserves dignity, respect, and the opportunity to thrive.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Transparency</h3>
              <p>Track exactly how your contribution is used with complete transparency and regular updates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Unity</h3>
              <p>Together we create a world where compassion connects us all and hope transforms lives.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Join the Movement</h2>
          <p>Be part of something bigger – help us bring hope to those who need it most</p>
          <Link to="/donate" className="btn btn-secondary btn-large">
            Make a Donation
          </Link>
        </div>
      </section>
    </div>
  )
}
