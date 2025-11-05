import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQ() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const faqData: FAQItem[] = [
    {
      category: 'donations',
      question: 'How do I make a donation to Gift of Hope?',
      answer: 'Making a donation is simple! Click the "Donate Now" button on any page, choose your donation amount, select your preferred currency, and complete the secure payment through PayPal. You can donate using credit cards, debit cards, or your PayPal account. Every donation goes directly toward helping families in need with food, education, and healthcare support.'
    },
    {
      category: 'donations',
      question: 'What payment methods do you accept for online donations?',
      answer: 'We accept all major payment methods through our secure PayPal integration, including Visa, Mastercard, American Express, Discover, and PayPal balance. You don\'t need a PayPal account to donate - you can pay as a guest using any credit or debit card. All transactions are encrypted and secure.'
    },
    {
      category: 'donations',
      question: 'Is my donation tax-deductible?',
      answer: 'Yes! Gift of Hope is a registered nonprofit organization. All donations are tax-deductible to the fullest extent permitted by law. After completing your donation, you will receive an email receipt with your transaction details and tax ID information that you can use for your tax records.'
    },
    {
      category: 'donations',
      question: 'What is the minimum donation amount?',
      answer: 'There is no minimum donation amount at Gift of Hope. Every contribution, whether $5 or $5,000, makes a meaningful difference in someone\'s life. Small donations add up to create significant impact - even a $10 donation can provide meals for a family in need.'
    },
    {
      category: 'donations',
      question: 'Can I make recurring monthly donations?',
      answer: 'Yes! We offer monthly recurring donation options for supporters who want to make a sustained impact. Monthly donors become part of our Hope Heroes community and receive exclusive updates about the lives they\'re changing. You can set up, modify, or cancel your recurring donation at any time.'
    },
    {
      category: 'security',
      question: 'Is my donation secure and safe?',
      answer: 'Absolutely! We use industry-leading security measures to protect your donation. All payments are processed through PayPal\'s secure payment gateway with 256-bit SSL encryption. We never store your credit card information on our servers. Your financial data is completely safe and protected.'
    },
    {
      category: 'security',
      question: 'Will my personal information be kept private?',
      answer: 'Yes, your privacy is our top priority. We never share, sell, or distribute your personal information to third parties. Your email, name, and donation details are kept strictly confidential. Please read our Privacy Policy for complete details on how we protect your data.'
    },
    {
      category: 'transparency',
      question: 'How are donations used by Gift of Hope?',
      answer: 'We maintain 100% transparency with our donors. Your donations go directly toward our core programs: providing food assistance to hungry families, educational support for underprivileged children, healthcare services for those without access, and emergency relief during crises. You can view detailed impact reports on our Campaigns page.'
    },
    {
      category: 'transparency',
      question: 'What percentage of my donation goes to programs vs administrative costs?',
      answer: 'We are committed to maximizing impact - over 85% of every donation goes directly to our charitable programs. Less than 15% covers essential operational costs like website maintenance, payment processing fees, and program coordination. We believe in financial transparency and accountability to our donors.'
    },
    {
      category: 'transparency',
      question: 'Can I see where my donation goes?',
      answer: 'Yes! We provide complete transparency through our Donor Wall, Campaign updates, and impact reports. You can track the specific programs your donation supports and see real stories of families helped. We also send email updates to donors showing the direct impact of their contributions.'
    },
    {
      category: 'campaigns',
      question: 'What are campaign donations and how do they work?',
      answer: 'Campaigns are specific fundraising initiatives focused on particular causes like building schools, providing clean water, emergency disaster relief, or medical assistance. When you donate to a campaign, 100% of your contribution goes toward that specific project. You can browse active campaigns on our Campaigns page and choose the cause closest to your heart.'
    },
    {
      category: 'campaigns',
      question: 'Can I donate to a specific cause or campaign?',
      answer: 'Absolutely! Visit our Campaigns page to see all active fundraising initiatives. Each campaign has a dedicated page with detailed information, funding goals, and impact objectives. You can choose to support education, healthcare, hunger relief, or emergency assistance - whatever cause resonates with you most.'
    },
    {
      category: 'international',
      question: 'Can I donate from outside the United States?',
      answer: 'Yes! Gift of Hope accepts international donations from over 200 countries worldwide. We support multiple currencies including USD, EUR, GBP, CAD, AUD, and many more. Simply select your local currency during checkout, and the donation amount will be automatically converted.'
    },
    {
      category: 'international',
      question: 'Which countries and currencies do you support?',
      answer: 'We accept donations in 25+ major currencies through PayPal, including US Dollar (USD), Euro (EUR), British Pound (GBP), Canadian Dollar (CAD), Australian Dollar (AUD), Indian Rupee (INR), and many others. Our platform automatically detects your location and suggests your local currency for convenience.'
    },
    {
      category: 'receipts',
      question: 'Will I receive a donation receipt?',
      answer: 'Yes! Immediately after your donation is processed, you will receive a detailed email receipt with your transaction ID, donation amount, date, and our tax ID number. This receipt serves as official documentation for tax deduction purposes. If you don\'t receive it, please check your spam folder or contact us.'
    },
    {
      category: 'receipts',
      question: 'I didn\'t receive my donation confirmation email. What should I do?',
      answer: 'First, please check your spam or junk mail folder, as automated emails sometimes get filtered. If you still can\'t find it, contact us through our Contact page with your transaction details, and we\'ll resend your receipt within 24 hours. Keep your PayPal transaction ID for reference.'
    },
    {
      category: 'nonprofit',
      question: 'Is Gift of Hope a registered nonprofit charity organization?',
      answer: 'Yes, Gift of Hope is a fully registered 501(c)(3) nonprofit charitable organization committed to bringing hope to families worldwide through food assistance, education programs, and healthcare support. We operate with complete transparency and accountability to our donors and the communities we serve.'
    },
    {
      category: 'nonprofit',
      question: 'Where does Gift of Hope operate?',
      answer: 'Gift of Hope operates globally, with programs and partnerships in underserved communities across multiple continents. Our work focuses on areas with the greatest need - providing food security, educational opportunities, healthcare access, and emergency relief wherever families struggle to meet basic needs.'
    },
    {
      category: 'impact',
      question: 'How can I see the impact of my donation?',
      answer: 'You can track your impact in several ways: visit our Donor Wall to see yourself among our community of supporters, browse our Campaigns page for project updates, read impact stories on our Mission page, and check your email for donor update newsletters. We believe in showing donors the real difference their generosity makes.'
    },
    {
      category: 'impact',
      question: 'What kind of impact does Gift of Hope make in communities?',
      answer: 'Gift of Hope transforms lives through comprehensive support: we provide nutritious meals to hungry families, school supplies and scholarships for children, medical care for those without insurance, clean water access, emergency shelter during disasters, and sustainable livelihood programs. Every donation creates lasting positive change.'
    },
    {
      category: 'volunteer',
      question: 'Can I volunteer with Gift of Hope?',
      answer: 'Yes! We welcome volunteers who want to contribute their time, skills, and passion to our mission. Volunteer opportunities include event organization, social media outreach, translation services, fundraising campaigns, and more. Contact us through our Contact page to learn about current volunteer opportunities.'
    },
    {
      category: 'volunteer',
      question: 'How else can I support Gift of Hope besides donating money?',
      answer: 'There are many ways to support our mission: share our website and campaigns on social media, volunteer your professional skills, organize fundraising events in your community, become a monthly recurring donor, sponsor a specific campaign, or simply spread awareness about our work. Every form of support helps us reach more families in need.'
    },
    {
      category: 'contact',
      question: 'How can I contact Gift of Hope for questions or support?',
      answer: 'You can reach us anytime through our Contact page by filling out the contact form. We typically respond within 24-48 hours. For urgent matters, please include "URGENT" in your subject line. We\'re here to answer any questions about donations, programs, volunteering, or partnerships.'
    },
    {
      category: 'refunds',
      question: 'What is your donation refund policy?',
      answer: 'While all donations are generally final and non-refundable, we understand mistakes happen. If you made a duplicate donation or there was a processing error, please contact us within 30 days with your transaction details. We will review your request on a case-by-case basis. Please see our Donation Terms for complete refund policy details.'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'donations', name: 'Making Donations' },
    { id: 'security', name: 'Security & Privacy' },
    { id: 'transparency', name: 'Transparency' },
    { id: 'campaigns', name: 'Campaigns' },
    { id: 'international', name: 'International' },
    { id: 'receipts', name: 'Receipts & Tax' },
    { id: 'nonprofit', name: 'About Us' },
    { id: 'impact', name: 'Impact' },
    { id: 'volunteer', name: 'Volunteering' },
    { id: 'contact', name: 'Contact' },
    { id: 'refunds', name: 'Refunds' }
  ]

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="page">
      <Helmet>
        <title>FAQs | Gift Of Hope - Donation Questions & Answers</title>
        <meta name="description" content="Have questions about Gift Of Hope - Donation? Find answers about donations, programs, volunteering, and global support." />
        <meta name="keywords" content="Donation FAQs, Gift Of Hope Help, Charity Questions, Nonprofit Info, Global Donation FAQ, Support Families, Online Giving" />
        <link rel="canonical" href="https://www.giftofhope.online/faq" />
        
        <meta property="og:title" content="FAQs | Gift Of Hope - Donation Questions & Answers" />
        <meta property="og:description" content="Have questions about Gift Of Hope - Donation? Find answers about donations, programs, volunteering, and global support." />
        <meta property="og:url" content="https://www.giftofhope.online/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gift Of Hope - Donation" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://www.giftofhope.online/logo-square.png" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQs | Gift Of Hope" />
        <meta name="twitter:description" content="Find answers about donations, programs, volunteering, and global support." />
        <meta name="twitter:image" content="https://www.giftofhope.online/logo-square.png" />
      </Helmet>
      
      <section className="page-header">
        <h1>Frequently Asked Questions</h1>
        <p className="page-subtitle">Everything you need to know about donating to Gift of Hope, our mission, security, and impact</p>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{ marginBottom: '40px', maxWidth: '900px', margin: '0 auto 40px' }}>
            <label htmlFor="category-filter" style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Filter by Category:
            </label>
            <select
              id="category-filter"
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value)
                setOpenIndex(null)
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid var(--border-color, #E5E7EB)',
                background: 'var(--card-bg, white)',
                color: 'var(--text-primary, #1F2937)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color, #E5E7EB)'}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {filteredFAQs.length === 0 ? (
              <div className="content-block" style={{ textAlign: 'center' }}>
                <p>No questions found in this category.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="faq-item"
                    style={{
                      background: 'var(--card-bg, white)',
                      borderRadius: '12px',
                      boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.1))',
                      border: '1px solid var(--border-color, #F3F4F6)',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        color: 'var(--text-primary, #1F2937)'
                      }}
                    >
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        margin: 0,
                        lineHeight: '1.5',
                        flex: 1
                      }}>
                        {faq.question}
                      </h3>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary, #F3F4F6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                        transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        <svg 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </button>
                    
                    {openIndex === index && (
                      <div style={{
                        padding: '0 24px 24px 24px',
                        animation: 'slideDown 0.3s ease-out'
                      }}>
                        <p style={{
                          fontSize: '1rem',
                          lineHeight: '1.7',
                          margin: 0,
                          color: 'var(--text-secondary, #4B5563)'
                        }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="content-block" style={{
            marginTop: '60px',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '60px auto 0'
          }}>
            <h2>Still Have Questions?</h2>
            <p style={{ marginBottom: '30px' }}>
              Can't find the answer you're looking for? Our friendly team is here to help!
            </p>
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .faq-item:hover {
          box-shadow: var(--card-shadow-hover, 0 4px 16px rgba(0, 0, 0, 0.12));
        }
      `}</style>
    </div>
  )
}
