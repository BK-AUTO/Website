import { useGA4 } from '@/composables/ga4.js';

/**
 * Utility để tự động track scroll depth
 * Sử dụng trong các page cần track user engagement
 */
export function useScrollTracking() {
  const { trackScroll } = useGA4();
  
  let isTracking = false;
  let scrollThresholds = [25, 50, 75, 90];
  let trackedThresholds = new Set();
  
  const trackScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    // Track thresholds
    scrollThresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        trackScroll(threshold);
      }
    });
    
    // Track 100% scroll
    if (scrollPercent >= 100 && !trackedThresholds.has(100)) {
      trackedThresholds.add(100);
      trackScroll(100);
    }
  };
  
  const startTracking = (customThresholds = null) => {
    if (isTracking) return;
    
    if (customThresholds) {
      scrollThresholds = customThresholds;
    }
    
    isTracking = true;
    trackedThresholds.clear();
    
    // Debounce scroll events
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          trackScrollDepth();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      isTracking = false;
    };
  };
  
  const stopTracking = () => {
    isTracking = false;
    trackedThresholds.clear();
  };
  
  return {
    startTracking,
    stopTracking,
    isTracking: () => isTracking,
    getTrackedThresholds: () => Array.from(trackedThresholds)
  };
}