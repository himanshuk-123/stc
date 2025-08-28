/**
 * API endpoints and configuration
 */

export const API_BASE_URL = 'https://onlinerechargeservice.in/App/webservice';

export const ENDPOINTS = {
  BROWSE_PLAN: `${API_BASE_URL}/BrowsePlan2`,
  // Add other endpoints as needed
};

export const HTTP_STATUS = {
  SUCCESS: '1',
  // Add other status codes as needed
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export const PLAN_TYPES_PRIORITY = ['unlimited', 'data'];
