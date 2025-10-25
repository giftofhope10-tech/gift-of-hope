import { useState, useEffect } from 'react'
import { formatDate, formatCurrency } from '../../../shared/utils'

interface TabButtonProps {
  label: string
  icon: string
  count: number
  isActive: boolean
  onClick: () => void
}

const TabButton = ({ label, icon, count, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    style={{
      padding: '16px 32px',
      background: 'transparent',
      border: 'none',
      borderBottom: isActive ? '3px solid #8B5CF6' : '3px solid transparent',
      color: isActive ? '#8B5CF6' : 'var(--text-secondary)',
      fontWeight: isActive ? '600' : '500',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
  >
    {icon} {label} ({count})
  </button>
)

interface Donation {
  id: number
  donorName: string
  donorEmail: string | null
  amount: string
  currency: string
  localAmount: string | null
  localCurrency: string | null
  paypalOrderId: string
  campaignId: number | null
  status: string
  createdAt: string
}

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
  createdAt: string
}

export default function Admin() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activeTab, setActiveTab] = useState<'donations' | 'campaigns'>('donations')
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    endDate: '',
    imageUrl: ''
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const campaignsPerPage = 10

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [donationsRes, campaignsRes] = await Promise.all([
        fetch('/api/admin/donations', {
          credentials: 'include'
        }),
        fetch('/api/campaigns')
      ])

      if (donationsRes.status === 401) {
        setIsAuthenticated(false)
        setDonations([])
        setCampaigns([])
        setAuthError('Your session has expired. Please log in again.')
        return
      }

      if (donationsRes.ok) {
        try {
          const donationsData = await donationsRes.json()
          setDonations(Array.isArray(donationsData) ? donationsData : [])
        } catch (e) {
          setDonations([])
        }
      } else {
        setDonations([])
      }

      if (campaignsRes.ok) {
        try {
          const campaignsData = await campaignsRes.json()
          setCampaigns(campaignsData.campaigns || [])
        } catch (e) {
          setCampaigns([])
        }
      } else {
        setCampaigns([])
      }
    } catch (error) {
      setDonations([])
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const loginRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password })
      })
      
      const data = await loginRes.json()
      
      if (loginRes.ok) {
        setIsAuthenticated(true)
        setAuthError('')
        setPassword('')
      } else {
        setAuthError(data.message || 'Incorrect password. Please try again.')
        setPassword('')
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setIsAuthenticated(false)
      setDonations([])
      setCampaigns([])
      setPassword('')
    } catch (error) {
      setIsAuthenticated(false)
      setDonations([])
      setCampaigns([])
      setPassword('')
    }
  }


  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(campaignForm)
      })

      const data = await response.json()

      if (response.ok) {
        setFormSuccess('Campaign created successfully!')
        setCampaignForm({
          title: '',
          description: '',
          goalAmount: '',
          endDate: '',
          imageUrl: ''
        })
        setTimeout(() => {
          setShowCreateForm(false)
          setFormSuccess('')
          fetchData()
        }, 1500)
      } else {
        setFormError(data.message || 'Failed to create campaign')
      }
    } catch (error) {
      setFormError('Error creating campaign. Please try again.')
    }
  }

  const handleDeleteCampaign = async (campaignId: number) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setDeleteConfirm(null)
        await fetchData()
        
        const indexOfLastCampaign = currentPage * campaignsPerPage
        const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage
        const remainingCampaigns = campaigns.filter(c => c.id !== campaignId)
        const currentPageCampaigns = remainingCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign)
        
        if (currentPageCampaigns.length === 0 && currentPage > 1) {
          setCurrentPage(1)
        }
      }
    } catch (error) {
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="page admin-page">
        <section className="page-header">
          <h1>Admin Access</h1>
          <p className="page-subtitle">Please enter your admin password</p>
        </section>

        <section className="content-section" style={{padding: '80px 24px'}}>
          <div className="container" style={{maxWidth: '500px'}}>
            <div style={{
              background: 'var(--card-bg)',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div>
                  <label htmlFor="admin-password" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)'}}>
                    Password
                  </label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="admin-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      style={{
                        width: '100%',
                        padding: '12px 48px 12px 16px',
                        fontSize: '16px',
                        border: authError ? '2px solid #ef4444' : '2px solid var(--border-color)',
                        borderRadius: '8px',
                        outline: 'none',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '20px',
                        padding: '4px 8px',
                        color: 'var(--text-secondary)'
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {authError && (
                    <p style={{color: '#ef4444', fontSize: '14px', marginTop: '8px'}}>
                      {authError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{width: '100%', padding: '14px', fontSize: '16px'}}
                >
                  Login to Admin Panel
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page admin-page">
      <section className="page-header">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10}}>
          <div>
            <h1>Admin Dashboard</h1>
            <p className="page-subtitle">Manage donations and campaigns</p>
          </div>
          <button 
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{padding: '12px 24px', fontSize: '16px', position: 'relative', zIndex: 10, cursor: 'pointer'}}
          >
            🚪 Logout
          </button>
        </div>
      </section>

      <section className="content-section" style={{padding: '60px 24px'}}>
        <div className="container" style={{maxWidth: '1400px'}}>
          
          <div style={{display: 'flex', gap: '16px', marginBottom: '40px', borderBottom: '2px solid var(--border-color)'}}>
            <TabButton
              label="Donations"
              icon="💰"
              count={donations.length}
              isActive={activeTab === 'donations'}
              onClick={() => setActiveTab('donations')}
            />
            <TabButton
              label="Campaigns"
              icon="🎯"
              count={campaigns.length}
              isActive={activeTab === 'campaigns'}
              onClick={() => setActiveTab('campaigns')}
            />
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '60px'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
              <p style={{color: 'var(--text-secondary)', fontSize: '18px'}}>Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'donations' && (
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden'}}>
                    <thead>
                      <tr style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', color: 'white'}}>
                        <th style={{padding: '16px', textAlign: 'left'}}>ID</th>
                        <th style={{padding: '16px', textAlign: 'left'}}>Donor</th>
                        <th style={{padding: '16px', textAlign: 'left'}}>Email</th>
                        <th style={{padding: '16px', textAlign: 'left'}}>Amount</th>
                        <th style={{padding: '16px', textAlign: 'left'}}>Status</th>
                        <th style={{padding: '16px', textAlign: 'left'}}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{padding: '40px', textAlign: 'center', color: 'var(--text-secondary)'}}>
                            No donations yet
                          </td>
                        </tr>
                      ) : (
                        donations.map((donation, index) => (
                          <tr key={donation.id} style={{borderBottom: '1px solid var(--border-color)', background: index % 2 === 0 ? 'var(--card-bg)' : 'var(--bg-secondary)'}}>
                            <td style={{padding: '16px', color: 'var(--text-primary)'}}>#{donation.id}</td>
                            <td style={{padding: '16px', fontWeight: '600', color: 'var(--text-primary)'}}>{donation.donorName}</td>
                            <td style={{padding: '16px', color: 'var(--text-secondary)'}}>{donation.donorEmail || 'N/A'}</td>
                            <td style={{padding: '16px', fontWeight: '600', color: '#10b981'}}>
                              {formatCurrency(donation.amount, donation.currency)}
                              {donation.localAmount && donation.localCurrency && (
                                <div style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
                                  ({formatCurrency(donation.localAmount, donation.localCurrency)})
                                </div>
                              )}
                            </td>
                            <td style={{padding: '16px'}}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: donation.status === 'completed' ? '#d1fae5' : '#fef3c7',
                                color: donation.status === 'completed' ? '#065f46' : '#92400e'
                              }}>
                                {donation.status}
                              </span>
                            </td>
                            <td style={{padding: '16px', color: 'var(--text-secondary)'}}>{formatDate(donation.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'campaigns' && (
                <>
                  <div style={{marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2 style={{fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)'}}>Campaigns</h2>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="btn btn-primary"
                      style={{padding: '12px 24px', fontSize: '14px'}}
                    >
                      + Create Campaign
                    </button>
                  </div>

                  {showCreateForm && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      padding: '20px'
                    }}>
                      <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '32px'
                      }}>
                        <h3 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--text-primary)'}}>
                          Create New Campaign
                        </h3>
                        <form onSubmit={handleCreateCampaign} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                          <div>
                            <label htmlFor="title" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)'}}>
                              Campaign Title *
                            </label>
                            <input
                              type="text"
                              id="title"
                              value={campaignForm.title}
                              onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                              required
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid var(--border-color)',
                                borderRadius: '8px',
                                outline: 'none',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            />
                          </div>

                          <div>
                            <label htmlFor="description" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)'}}>
                              Description *
                            </label>
                            <textarea
                              id="description"
                              value={campaignForm.description}
                              onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                              required
                              rows={4}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid var(--border-color)',
                                borderRadius: '8px',
                                outline: 'none',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            />
                          </div>

                          <div>
                            <label htmlFor="goalAmount" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)'}}>
                              Goal Amount (USD) *
                            </label>
                            <input
                              type="number"
                              id="goalAmount"
                              value={campaignForm.goalAmount}
                              onChange={(e) => setCampaignForm({...campaignForm, goalAmount: e.target.value})}
                              required
                              min="1"
                              step="0.01"
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid var(--border-color)',
                                borderRadius: '8px',
                                outline: 'none',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            />
                          </div>

                          <div>
                            <label htmlFor="endDate" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)'}}>
                              End Date (Optional)
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              value={campaignForm.endDate}
                              onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid var(--border-color)',
                                borderRadius: '8px',
                                outline: 'none',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            />
                          </div>

                          <div>
                            <label htmlFor="imageUrl" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)'}}>
                              Image URL (Optional)
                            </label>
                            <input
                              type="text"
                              id="imageUrl"
                              value={campaignForm.imageUrl}
                              onChange={(e) => setCampaignForm({...campaignForm, imageUrl: e.target.value})}
                              placeholder="https://example.com/image.jpg"
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid var(--border-color)',
                                borderRadius: '8px',
                                outline: 'none',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            />
                          </div>

                          {formError && (
                            <div style={{
                              padding: '12px 16px',
                              background: '#fee2e2',
                              border: '1px solid #ef4444',
                              borderRadius: '8px',
                              color: '#991b1b'
                            }}>
                              {formError}
                            </div>
                          )}

                          {formSuccess && (
                            <div style={{
                              padding: '12px 16px',
                              background: '#d1fae5',
                              border: '1px solid #10b981',
                              borderRadius: '8px',
                              color: '#065f46'
                            }}>
                              {formSuccess}
                            </div>
                          )}

                          <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              style={{flex: 1, padding: '12px', fontSize: '16px'}}
                            >
                              Create Campaign
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateForm(false)
                                setFormError('')
                                setFormSuccess('')
                              }}
                              className="btn btn-secondary"
                              style={{flex: 1, padding: '12px', fontSize: '16px'}}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {(() => {
                    const indexOfLastCampaign = currentPage * campaignsPerPage
                    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage
                    const currentCampaigns = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign)
                    const totalPages = Math.ceil(campaigns.length / campaignsPerPage)

                    return (
                      <>
                        <div style={{display: 'grid', gap: '20px'}}>
                          {currentCampaigns.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '60px', background: 'var(--card-bg)', borderRadius: '12px'}}>
                              <div style={{fontSize: '48px', marginBottom: '16px'}}>🎯</div>
                              <p style={{color: 'var(--text-secondary)', fontSize: '18px'}}>No campaigns yet</p>
                            </div>
                          ) : (
                            currentCampaigns.map((campaign) => (
                              <div key={campaign.id} style={{
                                background: 'var(--card-bg)',
                                padding: '24px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                              }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap'}}>
                                  <div style={{flex: 1, minWidth: '200px'}}>
                                    <h3 style={{fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px'}}>
                                      {campaign.title}
                                    </h3>
                                    <p style={{color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px'}}>
                                      {campaign.description}
                                    </p>
                                    <div style={{display: 'flex', gap: '20px', fontSize: '14px'}}>
                                      <span style={{color: 'var(--text-secondary)'}}>
                                        Goal: <strong style={{color: '#10b981'}}>${parseFloat(campaign.goalAmount).toLocaleString()}</strong>
                                      </span>
                                      <span style={{color: 'var(--text-secondary)'}}>
                                        Raised: <strong style={{color: '#8B5CF6'}}>${parseFloat(campaign.currentAmount).toLocaleString()}</strong>
                                      </span>
                                    </div>
                                  </div>
                                  <div style={{display: 'flex', gap: '8px'}}>
                                    {deleteConfirm === campaign.id ? (
                                      <>
                                        <button
                                          onClick={() => handleDeleteCampaign(campaign.id)}
                                          style={{
                                            padding: '8px 16px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                          }}
                                        >
                                          Confirm Delete
                                        </button>
                                        <button
                                          onClick={() => setDeleteConfirm(null)}
                                          style={{
                                            padding: '8px 16px',
                                            background: 'var(--text-secondary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => setDeleteConfirm(campaign.id)}
                                        style={{
                                          padding: '8px 16px',
                                          background: '#fee2e2',
                                          color: '#991b1b',
                                          border: '1px solid #fecaca',
                                          borderRadius: '6px',
                                          cursor: 'pointer',
                                          fontSize: '14px',
                                          fontWeight: '600'
                                        }}
                                      >
                                        🗑️ Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {totalPages > 1 && (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '32px',
                            flexWrap: 'wrap'
                          }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                              <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
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
                              >
                                {number}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
