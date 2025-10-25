import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navigation" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="Gift of Hope Home" onClick={closeMenu}>
          <div className="logo-container">
            <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99872 7.05 2.99872C5.59096 2.99872 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.54872 7.04096 1.54872 8.5C1.54872 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.2225 22.4518 8.5C22.4518 7.7775 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12084 20.84 4.61Z" fill="url(#heartGradient)"/>
              <defs>
                <linearGradient id="heartGradient" x1="1.54872" y1="2.99817" x2="22.4518" y2="21.23" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6"/>
                  <stop offset="1" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">Gift of Hope</span>
          </div>
        </Link>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <ThemeToggle />
          
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMenu}
            aria-current={isActive('/about') ? 'page' : undefined}
          >
            {t('nav.about')}
          </Link>
          <Link 
            to="/mission" 
            className={`nav-link ${isActive('/mission') ? 'active' : ''}`}
            onClick={closeMenu}
            aria-current={isActive('/mission') ? 'page' : undefined}
          >
            {t('nav.mission')}
          </Link>
          <Link 
            to="/campaigns" 
            className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`}
            onClick={closeMenu}
            aria-current={isActive('/campaigns') ? 'page' : undefined}
          >
            {t('nav.campaigns')}
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={closeMenu}
            aria-current={isActive('/contact') ? 'page' : undefined}
          >
            {t('nav.contact')}
          </Link>

          <Link 
            to="/donate" 
            className="nav-link btn-donate"
            onClick={closeMenu}
            aria-label="Make a donation"
          >
            {t('nav.donate')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
