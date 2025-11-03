import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'

interface Campaign {
  id: number
  title: string
  description: string
  goalAmount: string
  currentAmount: string
  startDate: string
  endDate: string | null
  isActive: boolean
  imageUrl: string | null
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const campaignsPerPage = 10

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        setCampaigns(data.campaigns || [])
        setLoading(false)
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading campaigns:', err)
        }
        setLoading(false)
      })
  }, [])

  const calculateProgress = useCallback((current: string, goal: string) => {
    const percentage = (parseFloat(current) / parseFloat(goal)) * 100
    return Math.min(percentage, 100).toFixed(1)
  }, [])

  const isCompleted = useCallback((current: string, goal: string) => {
    const percentage = (parseFloat(current) / parseFloat(goal)) * 100
    return percentage >= 100
  }, [])

  const { totalPages, currentCampaigns } = useMemo(() => {
    const pages = Math.ceil(campaigns.length / campaignsPerPage)
    const indexOfLast = currentPage * campaignsPerPage
    const indexOfFirst = indexOfLast - campaignsPerPage
    const current = campaigns.slice(indexOfFirst, indexOfLast)
    
    return { totalPages: pages, currentCampaigns: current }
  }, [campaigns, currentPage, campaignsPerPage])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [campaigns.length, currentPage, totalPages])

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="page campaigns-page">
      <section className="page-header" role="banner">
        <h1>Active Campaigns</h1>
        <p className="page-subtitle">
          Support specific causes and see the direct impact of your contribution
        </p>
      </section>

      <section className="content-section" style={{ padding: '80px 24px' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <div className="loading-spinner" role="status" aria-label="Loading campaigns">
                Loading campaigns...
              </div>
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>No Active Campaigns</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Check back soon for new fundraising campaigns, or make a general donation to support all our programs.
              </p>
              <Link to="/donate" className="btn btn-primary" aria-label="Make a general donation">
                Donate Now
              </Link>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '30px' 
            }}>
              {currentCampaigns.map(campaign => {
                const progress = calculateProgress(campaign.currentAmount, campaign.goalAmount)
                const completed = isCompleted(campaign.currentAmount, campaign.goalAmount)
                
                return (
                  <article 
                    key={campaign.id} 
                    className="campaign-card"
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      position: 'relative'
                    }}
                  >
                    {completed && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        zIndex: 10
                      }}>
                        ✓ Completed
                      </div>
                    )}
                    
                    {campaign.imageUrl && (
                      <img 
                        src={campaign.imageUrl} 
                        alt={campaign.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          background: 'var(--bg-secondary)',
                        }}
                        loading="lazy"
                      />
                    )}
                    
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ 
                        fontSize: '24px', 
                        marginBottom: '12px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {campaign.title}
                      </h3>
                      
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.6', 
                        marginBottom: '20px',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {campaign.description}
                      </p>

                      <div style={{ marginBottom: '20px' }}>
                        <div 
                          style={{
                            width: '100%',
                            height: '8px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                          role="progressbar"
                          aria-valuenow={parseFloat(progress)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${progress}% of goal reached`}
                        >
                          <div 
                            style={{
                              height: '100%',
                              width: `${Math.max(parseFloat(progress), 0.5)}%`,
                              background: completed 
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                        
                        <p style={{ 
                          textAlign: 'center', 
                          marginTop: '8px', 
                          fontSize: '16px',
                          fontWeight: '600',
                          color: completed ? '#10b981' : 'var(--primary)'
                        }}>
                          {completed ? 'Goal Reached!' : `${progress}% Funded`}
                        </p>
                      </div>

                      <Link 
                        to={`/donate?campaign=${campaign.id}`}
                        className="btn btn-primary"
                        style={{ width: '100%', textAlign: 'center' }}
                        aria-label={`Donate to ${campaign.title}`}
                      >
                        Support This Campaign
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {!loading && campaigns.length > campaignsPerPage && (
            <nav aria-label="Campaign pages">
              <div className="pagination" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '48px',
                flexWrap: 'wrap'
              }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    style={{
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      background: currentPage === number 
                        ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' 
                        : 'var(--card-bg)',
                      color: currentPage === number ? 'white' : 'var(--primary)',
                      boxShadow: currentPage === number 
                        ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                      minWidth: '44px'
                    }}
                    aria-label={`Go to page ${number}`}
                    aria-current={currentPage === number ? 'page' : undefined}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </section>
    </div>
  )
}
