import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

declare global {
  interface Window {
    paypal?: any;
  }
}

interface CurrencyInfo {
  code: string
  symbol: string
  rate: number
  country: string
}

export default function Donate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const campaignId = searchParams.get('campaign')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState({ name: '', email: '', amount: '' })
  const [statusMessage, setStatusMessage] = useState('')
  const [currency, setCurrency] = useState<CurrencyInfo>({
    code: 'USD',
    symbol: '$',
    rate: 1,
    country: 'US'
  })
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true)

  const minAmount = useMemo(() => 3 * currency.rate, [currency.rate])

  const validateForm = useCallback(() => {
    const newErrors = { name: '', email: '', amount: '' }
    let isValid = true

    if (!name.trim()) {
      newErrors.name = 'Please enter your name'
      isValid = false
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid donation amount'
      isValid = false
    } else if (amountNum < minAmount) {
      newErrors.amount = `Minimum donation is ${currency.symbol}${minAmount.toFixed(2)} (equivalent to $3 USD)`
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }, [name, email, amount, minAmount, currency.symbol])

  const convertToUSD = useCallback((localAmount: number) => {
    return localAmount / currency.rate
  }, [currency.rate])

  useEffect(() => {
    const detectCurrencyAndLocation = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await response.json()
        
        const userCountry = await fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(geo => geo.country_code)
          .catch(() => 'US')

        const currencyMap: { [key: string]: { code: string; symbol: string } } = {
          'PK': { code: 'PKR', symbol: 'Rs' },
          'SA': { code: 'SAR', symbol: 'SR' },
          'AE': { code: 'AED', symbol: 'د.إ' },
          'IN': { code: 'INR', symbol: '₹' },
          'GB': { code: 'GBP', symbol: '£' },
          'EU': { code: 'EUR', symbol: '€' },
          'CA': { code: 'CAD', symbol: 'C$' },
          'AU': { code: 'AUD', symbol: 'A$' },
          'BD': { code: 'BDT', symbol: '৳' },
          'MY': { code: 'MYR', symbol: 'RM' },
          'SG': { code: 'SGD', symbol: 'S$' },
          'ID': { code: 'IDR', symbol: 'Rp' },
          'TR': { code: 'TRY', symbol: '₺' },
          'EG': { code: 'EGP', symbol: 'E£' }
        }

        const currencyData = currencyMap[userCountry] || { code: 'USD', symbol: '$' }
        const rate = data.rates[currencyData.code] || 1

        setCurrency({
          code: currencyData.code,
          symbol: currencyData.symbol,
          rate: rate,
          country: userCountry
        })
        setIsLoadingCurrency(false)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Currency detection error:', error)
        }
        setIsLoadingCurrency(false)
      }
    }

    detectCurrencyAndLocation()
  }, [])

  useEffect(() => {
    let scriptLoaded = false

    const loadPayPalSdk = async () => {
      try {
        if (window.paypal && !scriptLoaded) {
          initPayPal()
          return
        }

        if (scriptLoaded) return

        const response = await fetch('/paypal-client-id')
        const data = await response.json()
        const clientId = data.clientId || 'sb'

        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
        if (existingScript) {
          existingScript.remove()
        }

        const script = document.createElement('script')
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD`
        script.async = true
        script.onload = () => {
          scriptLoaded = true
          initPayPal()
        }
        script.onerror = () => {
          setStatusMessage('Error loading PayPal SDK')
        }
        document.head.appendChild(script)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error(err)
        }
        setStatusMessage('Could not load PayPal')
      }
    }

    const initPayPal = () => {
      const container = document.getElementById('paypal-button-container')
      if (!container || !window.paypal) return

      container.innerHTML = ''

      window.paypal.Buttons({
        createOrder: async (_data: any, actions: any) => {
          if (!validateForm()) {
            return Promise.reject(new Error('Form validation failed'))
          }

          const localAmount = parseFloat(amount)
          const usdAmount = convertToUSD(localAmount)

          setErrors({ name: '', email: '', amount: '' })
          setStatusMessage('')

          try {
            const response = await fetch('/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: usdAmount.toFixed(2),
                currency: 'USD',
                intent: 'CAPTURE',
                donorName: name.trim(),
                donorEmail: email.trim(),
                localAmount: localAmount,
                localCurrency: currency.code,
                campaignId: campaignId ? parseInt(campaignId) : null
              })
            })
            
            if (!response.ok) {
              throw new Error('Failed to create order')
            }
            
            const orderData = await response.json()
            return orderData.id
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Order creation error:', error)
            }
            setStatusMessage('❌ Failed to create order. Please try again.')
            return Promise.reject(error)
          }
        },
        onApprove: async (data: any) => {
          try {
            const response = await fetch(`/order/${data.orderID}/capture`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            })
            
            if (response.ok) {
              setStatusMessage('✅ Payment successful! Redirecting...')
              setTimeout(() => {
                navigate('/thank-you')
              }, 500)
            } else {
              const errorData = await response.json().catch(() => ({}))
              if (process.env.NODE_ENV === 'development') {
                console.error('Capture error:', errorData)
              }
              setStatusMessage('❌ Payment processing error. Please contact support.')
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Order capture error:', error)
            }
            setStatusMessage('❌ Payment processing error. Please contact support.')
          }
        },
        onError: (err: any) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('PayPal error:', err)
          }
          if (err.message !== 'Form validation failed') {
            setStatusMessage('❌ Payment processing error. Please try again.')
          }
        }
      }).render('#paypal-button-container').catch((err: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('PayPal render error:', err)
        }
      })

      setStatusMessage('')
    }

    loadPayPalSdk()

    return () => {
      scriptLoaded = false
    }
  }, [navigate, name, email, amount])

  return (
    <div className="page donate-page">
      <section className="page-header">
        <h1>Make Your Contribution</h1>
        <p className="page-subtitle">
          Every donation creates real, measurable impact in communities worldwide
        </p>
      </section>

      <section className="donate-section">
        <div className="container">
          <div className="donate-container">
            <div className="donate-form">
              <h2>Choose Your Impact</h2>
              
              {isLoadingCurrency ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                  Detecting your location and currency...
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                      💱 Showing amounts in <strong>{currency.code}</strong> {currency.country !== 'US' && `(${currency.country})`}
                      {currency.code !== 'USD' && ` • Minimum donation: ${currency.symbol}${(3 * currency.rate).toFixed(2)} ≈ $3 USD`}
                    </p>
                  </div>

                  <div className="form-group">
                    <label>Quick Select Amount</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
                      {[3, 5, 10, 25, 50, 100].map(usdAmount => {
                        const localAmount = (usdAmount * currency.rate).toFixed(0)
                        return (
                          <button
                            key={usdAmount}
                            type="button"
                            onClick={() => setAmount(localAmount)}
                            style={{
                              padding: '12px 8px',
                              border: amount === localAmount ? '2px solid #8B5CF6' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              background: amount === localAmount ? 'rgba(139, 92, 246, 0.1)' : 'var(--card-bg)',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: amount === localAmount ? '#8B5CF6' : 'var(--text-secondary)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {currency.symbol}{localAmount}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="donor-name">Your Name *</label>
                    <input
                      type="text"
                      id="donor-name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors({ ...errors, name: '' })
                      }}
                      style={{
                        borderColor: errors.name ? '#DC2626' : undefined
                      }}
                    />
                    {errors.name && (
                      <div style={{
                        color: '#DC2626',
                        fontSize: '0.875rem',
                        marginTop: '5px',
                        fontWeight: '500'
                      }}>
                        ⚠️ {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="donor-email">Your Email * (for receipt)</label>
                    <input
                      type="email"
                      id="donor-email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors({ ...errors, email: '' })
                      }}
                      style={{
                        borderColor: errors.email ? '#DC2626' : undefined
                      }}
                    />
                    {errors.email && (
                      <div style={{
                        color: '#DC2626',
                        fontSize: '0.875rem',
                        marginTop: '5px',
                        fontWeight: '500'
                      }}>
                        ⚠️ {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">Donation Amount ({currency.code}) *</label>
                    <div className="input-group">
                      <span className="input-prefix">{currency.symbol}</span>
                      <input
                        type="number"
                        id="amount"
                        placeholder={`Enter amount (min ${(3 * currency.rate).toFixed(0)})`}
                        min={(3 * currency.rate).toFixed(0)}
                        step="1"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value)
                          if (errors.amount) setErrors({ ...errors, amount: '' })
                        }}
                        style={{
                          borderColor: errors.amount ? '#DC2626' : undefined
                        }}
                      />
                    </div>
                    {amount && currency.code !== 'USD' && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
                        ≈ ${convertToUSD(parseFloat(amount || '0')).toFixed(2)} USD
                      </div>
                    )}
                    {errors.amount && (
                      <div style={{
                        color: '#DC2626',
                        fontSize: '0.875rem',
                        marginTop: '5px',
                        fontWeight: '500'
                      }}>
                        ⚠️ {errors.amount}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div id="paypal-button-container" style={{ marginTop: '25px' }}></div>
              {statusMessage && (
                <div style={{ 
                  marginTop: '15px', 
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: statusMessage.includes('✅') ? '#D1FAE5' : 
                                   statusMessage.includes('❌') ? '#FEE2E2' : '#FEF3C7',
                  color: statusMessage.includes('✅') ? '#065F46' : 
                         statusMessage.includes('❌') ? '#991B1B' : '#92400E'
                }}>
                  {statusMessage}
                </div>
              )}
            </div>

            <div className="donate-info">
              <div className="info-card">
                <h3>Why Give With Us?</h3>
                <ul>
                  <li>Direct, measurable community impact</li>
                  <li>Bank-level secure processing</li>
                  <li>Complete transparency guaranteed</li>
                  <li>Trusted by thousands worldwide</li>
                  <li>Real-time impact tracking</li>
                </ul>
              </div>

              <div className="info-card">
                <h3>Your Impact Examples</h3>
                <p>
                  <strong>{currency.symbol}{(30 * currency.rate).toFixed(0)}</strong> provides meals for a family
                </p>
                <p>
                  <strong>{currency.symbol}{(75 * currency.rate).toFixed(0)}</strong> supports education resources
                </p>
                <p>
                  <strong>{currency.symbol}{(150 * currency.rate).toFixed(0)}</strong> delivers healthcare services
                </p>
                <p>
                  <strong>{currency.symbol}{(300 * currency.rate).toFixed(0)}</strong> builds community programs
                </p>
              </div>

              <div className="info-card">
                <h3>Safe & Secure</h3>
                <p>
                  All contributions are processed through industry-leading secure payment 
                  systems. Your information is protected with bank-level encryption, and 
                  we never store sensitive payment data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
