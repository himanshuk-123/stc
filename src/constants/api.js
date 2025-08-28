/**
 * API configuration constants
 */

// Base API URL
export const API_BASE_URL = 'https://onlinerechargeservice.in/App/webservice';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/Login`,
  REGISTER: `${API_BASE_URL}/Register`,
  
  // Recharge
  BROWSE_PLAN: `${API_BASE_URL}/BrowsePlan2`,
  MOBILE_RECHARGE: `${API_BASE_URL}/MobileRecharge`,
  DTH_RECHARGE: `${API_BASE_URL}/DTHRecharge`,
  
  // Utility bills
  ELECTRICITY_BILL: `${API_BASE_URL}/ElectricityBill`,
  WATER_BILL: `${API_BASE_URL}/WaterBill`,
  GAS_BILL: `${API_BASE_URL}/GasBill`,
  
  // Wallet and payments
  WALLET_BALANCE: `${API_BASE_URL}/WalletBalance`,
  ADD_MONEY: `${API_BASE_URL}/AddMoney`,
  PAYMENT_STATUS: `${API_BASE_URL}/PaymentStatus`,
  
  // User
  USER_PROFILE: `${API_BASE_URL}/UserProfile`,
  TRANSACTION_HISTORY: `${API_BASE_URL}/TransactionHistory`,
};

// HTTP Status codes
export const HTTP_STATUS = {
  SUCCESS: '1',
  ERROR: '0',
};

// Request methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API request timeout (in milliseconds)
export const API_TIMEOUT = 30000;
