import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import { ThemeProvider } from './contexts/ThemeContext'
import { useRoutePrefetch } from './hooks/useRoutePrefetch'

const About = lazy(() => import('./pages/About'))
const Mission = lazy(() => import('./pages/Mission'))
const Donate = lazy(() => import('./pages/Donate'))
const Campaigns = lazy(() => import('./pages/Campaigns'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const DonationTerms = lazy(() => import('./pages/DonationTerms'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))
const DonorWall = lazy(() => import('./pages/DonorWall'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Admin = lazy(() => import('./pages/Admin'))

const LazyRoute = ({ element }: { element: React.ReactElement }) => (
  <Suspense fallback={<div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{fontSize: '16px', color: '#8B5CF6', fontWeight: 600}}>Loading...</div></div>}>
    {element}
  </Suspense>
);

function App() {
  useRoutePrefetch();
  
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<LazyRoute element={<About />} />} />
              <Route path="/mission" element={<LazyRoute element={<Mission />} />} />
              <Route path="/donate" element={<LazyRoute element={<Donate />} />} />
              <Route path="/campaigns" element={<LazyRoute element={<Campaigns />} />} />
              <Route path="/contact" element={<LazyRoute element={<Contact />} />} />
              <Route path="/privacy" element={<LazyRoute element={<Privacy />} />} />
              <Route path="/donation-terms" element={<LazyRoute element={<DonationTerms />} />} />
              <Route path="/disclaimer" element={<LazyRoute element={<Disclaimer />} />} />
              <Route path="/donor-wall" element={<LazyRoute element={<DonorWall />} />} />
              <Route path="/faq" element={<LazyRoute element={<FAQ />} />} />
              <Route path="/thank-you" element={<LazyRoute element={<ThankYou />} />} />
              <Route path="/admin" element={<LazyRoute element={<Admin />} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
