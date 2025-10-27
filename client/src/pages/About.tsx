import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <div className="page about-page">
      <Helmet>
        <title>About Us - Gift of Hope | Our Story & Mission</title>
        <meta name="description" content="Learn about Gift of Hope's journey bringing compassion and action together. Discover our volunteer-driven humanitarian initiative supporting families through food, education, and healthcare." />
        <meta name="keywords" content="gift of hope story, nonprofit mission, humanitarian organization, volunteer charity, global giving platform" />
        <link rel="canonical" href="https://www.giftofhope.online/about" />
        
        <meta property="og:title" content="About Us - Gift of Hope" />
        <meta property="og:description" content="Building bridges between compassion and action - discover Gift of Hope's humanitarian mission." />
        <meta property="og:url" content="https://www.giftofhope.online/about" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Gift of Hope" />
        <meta name="twitter:description" content="Our story of bringing compassion and action together to help families in need." />
      </Helmet>
      
      <section className="page-header">
        <h1>Our Story</h1>
        <p className="page-subtitle">Building bridges between compassion and action</p>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px'}}>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/gift-of-hope-community-gathering.webp" 
                alt="Gift of Hope community gathering - volunteers and families coming together to support humanitarian relief efforts"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div style={{borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
              <img 
                src="/images/gift-of-hope-helping-hands.webp" 
                alt="Gift of Hope helping hands - compassionate volunteers providing aid and support to families in need worldwide"
                style={{width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover'}}
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="content-grid">
            <div className="content-block">
              <h2>Who We Are</h2>
              <p>
                We're a passionate collective of individuals who believe in the transformative 
                power of generosity. Born from a simple idea that everyone deserves opportunity, 
                we've grown into a global movement connecting compassionate donors with 
                communities in need.
              </p>
              <p>
                Our platform serves as a bridge, making philanthropy accessible, transparent, 
                and impactful. We've reimagined charitable giving for the digital age, ensuring 
                every contribution creates maximum positive change.
              </p>
            </div>

            <div className="content-block">
              <h2>Our Journey</h2>
              <p>
                What started as a grassroots initiative has blossomed into a worldwide platform 
                for change. We've witnessed firsthand how collective action can transform entire 
                communities, providing education, healthcare, and sustainable opportunities.
              </p>
              <p>
                Today, we're proud to facilitate meaningful connections between donors and 
                causes, ensuring transparency and accountability in every transaction. Our 
                commitment to ethical practices and community empowerment drives everything we do.
              </p>
            </div>
          </div>

          <div className="values-section">
            <h2 className="section-title">Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Integrity First</h3>
                <p>
                  Operating with complete honesty and transparency in all our dealings, 
                  ensuring trust is at the heart of every interaction.
                </p>
              </div>
              <div className="value-card">
                <h3>Empower Communities</h3>
                <p>
                  We believe in sustainable change that comes from within, supporting 
                  local leadership and community-driven solutions.
                </p>
              </div>
              <div className="value-card">
                <h3>Innovation</h3>
                <p>
                  Leveraging technology and creative thinking to make giving more 
                  accessible, efficient, and impactful than ever before.
                </p>
              </div>
              <div className="value-card">
                <h3>Accountability</h3>
                <p>
                  Every dollar is tracked, every impact measured, ensuring your 
                  generosity creates the change you envision.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section" style={{marginTop: '60px', borderRadius: '32px'}}>
            <h2>Ready to Join Our Mission?</h2>
            <p>Become part of a movement that's changing lives every single day</p>
            <Link to="/donate" className="btn btn-secondary btn-large">
              Make Your Impact
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
