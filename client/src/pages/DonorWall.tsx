import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'

interface RealDonor {
  donorName: string
  amount: string
  currency: string
  paypalReference: string
  createdAt: string
}

export default function DonorWall() {
  const [donors, setDonors] = useState<RealDonor[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDonors, setTotalDonors] = useState(0)

  useEffect(() => {
    fetchDonors()
    
    const interval = setInterval(() => {
      fetchDonors()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchDonors = async () => {
    try {
      const response = await fetch('/api/recent-donations')
      const data = await response.json()
      setDonors(data.donations || [])
      setTotalDonors(data.total || 0)
    } catch (error) {
      console.error('Failed to fetch donors:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvatarColor = (index: number) => {
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444']
    return colors[index % colors.length]
  }

  return (
    <div className="page">
      <div className="page-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              marginBottom: '16px',
              color: 'white',
              fontWeight: '800'
            }}>
              Donor Wall
            </h1>
            <p className="page-subtitle" style={{ 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: '1.5'
            }}>
              Thank you to our incredible supporters changing lives every day
            </p>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container">
          
          {/* Impact Stats - Compact */}
          {totalDonors > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              maxWidth: '600px',
              margin: '0 auto 40px',
              padding: '24px',
              background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
              borderRadius: '16px'
            }}>
              <StatCard value={`${totalDonors}+`} label="Supporters" color="#8B5CF6" />
              <StatCard value="100%" label="Transparency" color="#EC4899" />
            </div>
          )}

          {/* Recent Donors - Compact Table */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
              marginBottom: '24px',
              color: '#1F2937',
              fontWeight: '700'
            }}>
              Recent Supporters
            </h2>

            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                fontSize: '1rem',
                color: '#6B7280'
              }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '32px',
                  height: '32px',
                  border: '3px solid #E5E7EB',
                  borderTopColor: '#8B5CF6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '12px'
                }}></div>
                <p>Loading supporters...</p>
              </div>
            ) : donors.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 30px',
                background: '#F9FAFB',
                borderRadius: '16px',
                maxWidth: '500px',
                margin: '0 auto',
                border: '2px dashed #D1D5DB'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌟</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#1F2937', fontWeight: '700' }}>
                  Be Our First Hero!
                </h3>
                <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '24px' }}>
                  Be the first donor on our Wall of Gratitude
                </p>
                <Link 
                  to="/donate" 
                  style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    color: 'white',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  Donate Now
                </Link>
              </div>
            ) : (
              <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: '1px solid #E5E7EB'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr auto',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                  borderBottom: '2px solid #E5E7EB',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <div></div>
                  <div>Donor</div>
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>Amount</div>
                </div>

                {/* Table Rows */}
                <div>
                  {donors.map((donor, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr auto',
                        gap: '16px',
                        padding: '16px 20px',
                        borderBottom: index < donors.length - 1 ? '1px solid #F3F4F6' : 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${getAvatarColor(index)}, ${getAvatarColor(index)}DD)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {donor.donorName.charAt(0).toUpperCase()}
                      </div>

                      {/* Donor Info */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minWidth: 0
                      }}>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: '600',
                          color: '#1F2937',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {donor.donorName}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Verified
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        minWidth: '100px'
                      }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: getAvatarColor(index),
                          whiteSpace: 'nowrap'
                        }}>
                          {donor.currency} {parseFloat(donor.amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thank You Message - Compact */}
          <div style={{
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto 40px',
            padding: '30px 24px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.15)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💝</div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700'
            }}>
              Thank You, Amazing Supporters!
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6',
              color: '#6B7280',
              margin: 0
            }}>
              Your generosity fuels our mission to bring hope and support to families in need. Every donation makes a real difference!
            </p>
          </div>

          {/* CTA Section - Compact */}
          <div style={{
            textAlign: 'center',
            padding: '50px 30px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
            color: 'white',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🌟</div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
              marginBottom: '16px',
              fontWeight: '700'
            }}>
              Join Our Community
            </h2>
            <p style={{ 
              fontSize: '1.05rem', 
              marginBottom: '28px',
              opacity: 0.95,
              lineHeight: '1.5'
            }}>
              Your contribution creates ripples of hope across the globe
            </p>
            <Link 
              to="/donate" 
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                fontSize: '1.1rem',
                fontWeight: '600',
                background: 'white',
                color: '#8B5CF6',
                borderRadius: '50px',
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
