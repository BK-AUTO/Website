// Script để inject GA4 tracking code vào HTML
// Sử dụng trong quá trình build để thay thế placeholder
import { GA4_CONFIG } from './src/config/ga4.js';

// Function để thay thế placeholder trong HTML với measurement ID thực tế
export function injectGA4Script(html) {
  const measurementId = GA4_CONFIG.MEASUREMENT_ID;
  
  return html.replace(/GA_MEASUREMENT_ID/g, measurementId);
}