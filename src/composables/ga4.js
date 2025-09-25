import { GA4_CONFIG } from '@/config/ga4.js';

/**
 * Composable để sử dụng Google Analytics 4
 * Cung cấp các phương thức để track events, page views, và user properties
 */
export function useGA4() {
  
  /**
   * Kiểm tra xem gtag có sẵn không
   */
  const isGtagAvailable = () => {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  };

  /**
   * Track page view
   * @param {string} pagePath - Đường dẫn trang
   * @param {string} pageTitle - Tiêu đề trang
   */
  const trackPageView = (pagePath, pageTitle) => {
    if (!isGtagAvailable()) return;
    
    window.gtag('config', GA4_CONFIG.MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle
    });
  };

  /**
   * Track custom event
   * @param {string} eventName - Tên event
   * @param {object} parameters - Các parameters của event
   */
  const trackEvent = (eventName, parameters = {}) => {
    if (!isGtagAvailable()) return;
    
    window.gtag('event', eventName, {
      // Thêm timestamp
      timestamp: Date.now(),
      ...parameters
    });
  };

  /**
   * Track user properties
   * @param {object} properties - Các properties của user
   */
  const setUserProperties = (properties) => {
    if (!isGtagAvailable()) return;
    
    window.gtag('set', 'user_properties', properties);
  };

  /**
   * Track course view
   * @param {object} courseData - Dữ liệu khóa học
   */
  const trackCourseView = (courseData) => {
    trackEvent(GA4_CONFIG.EVENTS.COURSE_VIEW, {
      course_id: courseData.id,
      course_name: courseData.name,
      course_category: courseData.category || 'unknown',
      content_type: 'course'
    });
  };

  /**
   * Track news view  
   * @param {object} newsData - Dữ liệu tin tức
   */
  const trackNewsView = (newsData) => {
    trackEvent(GA4_CONFIG.EVENTS.NEWS_VIEW, {
      article_id: newsData.id,
      article_title: newsData.title,
      article_category: newsData.category || 'general',
      content_type: 'news'
    });
  };

  /**
   * Track project view
   * @param {object} projectData - Dữ liệu dự án
   */
  const trackProjectView = (projectData) => {
    trackEvent(GA4_CONFIG.EVENTS.PROJECT_VIEW, {
      project_id: projectData.id,
      project_name: projectData.name,
      project_type: projectData.type || 'unknown',
      content_type: 'project'
    });
  };

  /**
   * Track research view
   * @param {object} researchData - Dữ liệu nghiên cứu
   */
  const trackResearchView = (researchData) => {
    trackEvent(GA4_CONFIG.EVENTS.RESEARCH_VIEW, {
      research_id: researchData.id,
      research_title: researchData.title,
      research_category: researchData.category || 'unknown',
      content_type: 'research'
    });
  };

  /**
   * Track contact form submission
   * @param {string} formType - Loại form liên hệ
   */
  const trackContactFormSubmit = (formType = 'general') => {
    trackEvent(GA4_CONFIG.EVENTS.CONTACT_FORM_SUBMIT, {
      form_type: formType,
      interaction_type: 'form_submit'
    });
  };

  /**
   * Track search
   * @param {string} searchTerm - Từ khóa tìm kiếm
   * @param {string} searchCategory - Danh mục tìm kiếm
   */
  const trackSearch = (searchTerm, searchCategory = 'general') => {
    trackEvent(GA4_CONFIG.EVENTS.SEARCH, {
      search_term: searchTerm,
      search_category: searchCategory
    });
  };

  /**
   * Track download
   * @param {string} fileName - Tên file
   * @param {string} fileType - Loại file  
   */
  const trackDownload = (fileName, fileType) => {
    trackEvent(GA4_CONFIG.EVENTS.DOWNLOAD, {
      file_name: fileName,
      file_type: fileType,
      interaction_type: 'download'
    });
  };

  /**
   * Track custom click events
   * @param {string} elementName - Tên element được click
   * @param {string} elementType - Loại element
   * @param {string} location - Vị trí của element
   */
  const trackClick = (elementName, elementType = 'button', location = '') => {
    trackEvent(GA4_CONFIG.EVENTS.CLICK, {
      element_name: elementName,
      element_type: elementType,
      element_location: location,
      interaction_type: 'click'
    });
  };

  /**
   * Track scroll depth
   * @param {number} scrollPercent - Phần trăm scroll
   */
  const trackScroll = (scrollPercent) => {
    trackEvent(GA4_CONFIG.EVENTS.SCROLL, {
      scroll_depth: Math.round(scrollPercent),
      interaction_type: 'scroll'
    });
  };

  return {
    // Core functions
    trackPageView,
    trackEvent,
    setUserProperties,
    
    // Specific tracking functions
    trackCourseView,
    trackNewsView,
    trackProjectView,
    trackResearchView,
    trackContactFormSubmit,
    trackSearch,
    trackDownload,
    trackClick,
    trackScroll,
    
    // Utility
    isGtagAvailable
  };
}