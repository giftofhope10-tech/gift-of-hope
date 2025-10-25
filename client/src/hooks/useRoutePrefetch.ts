import { useEffect } from 'react';

const routeModules: Record<string, () => Promise<any>> = {
  '/about': () => import('../pages/About'),
  '/mission': () => import('../pages/Mission'),
  '/donate': () => import('../pages/Donate'),
  '/campaigns': () => import('../pages/Campaigns'),
  '/contact': () => import('../pages/Contact'),
  '/privacy': () => import('../pages/Privacy'),
  '/donation-terms': () => import('../pages/DonationTerms'),
  '/disclaimer': () => import('../pages/Disclaimer'),
  '/donor-wall': () => import('../pages/DonorWall'),
  '/faq': () => import('../pages/FAQ'),
};

export const useRoutePrefetch = () => {
  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) {
        return;
      }
    }

    let priorityTimeout: NodeJS.Timeout | null = null;
    let allRoutesTimeout: NodeJS.Timeout | null = null;

    const prefetchRoutes = () => {
      priorityTimeout = setTimeout(() => {
        const priorityRoutes = ['/donate', '/campaigns', '/about'];
        priorityRoutes.forEach(route => {
          if (routeModules[route]) {
            routeModules[route]().catch(() => {});
          }
        });
      }, 1000);

      allRoutesTimeout = setTimeout(() => {
        Object.entries(routeModules).forEach(([route, loader]) => {
          const priorityRoutes = ['/donate', '/campaigns', '/about'];
          if (!priorityRoutes.includes(route)) {
            loader().catch(() => {});
          }
        });
      }, 3000);
    };

    const cleanup = () => {
      if (priorityTimeout) clearTimeout(priorityTimeout);
      if (allRoutesTimeout) clearTimeout(allRoutesTimeout);
    };

    if (document.readyState === 'complete') {
      prefetchRoutes();
    } else {
      const handleLoad = () => {
        prefetchRoutes();
      };
      
      window.addEventListener('load', handleLoad, { once: true });
    }

    return cleanup;
  }, []);
};

export const prefetchRoute = (route: string) => {
  if (routeModules[route]) {
    routeModules[route]();
  }
};
