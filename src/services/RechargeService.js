import axios from 'axios';
import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Service for handling recharge-related API operations
 */
const RechargeApiServices = {
  /**
   * Fetches operators based on mode (Mobile/DTH)
   * @param {string} Tokenid - Authentication token
   * @param {string} mode - 1 for Mobile, 2 for DTH
   * @param {string} Version - API version
   * @param {string|null} Location - Optional location data
   * @returns {Promise} - API response
   */
  operator: (Tokenid, mode, Version, Location) =>
    api.post('/Operator', {
      Tokenid, 
      mode, 
      Version, 
      Location
    }),

  /**
   * Fetches commission information
   * @param {string} Tokenid - Authentication token
   * @param {string} Version - API version
   * @param {string|null} Location - Optional location data
   * @returns {Promise} - API response
   */
  commission: (Tokenid, Version, Location) =>
    api.post('/Commission', {
      Tokenid, 
      Version, 
      Location
    }),

  /**
   * Processes recharge request
   * @param {string} Tokenid - Authentication token
   * @param {string} UserID - User ID
   * @param {string} RefTxnId - Reference transaction ID
   * @param {string} MobileNo - Mobile number
   * @param {string} Operator - Operator code
   * @param {string} CricleId - Circle/State ID
   * @param {string} Amount - Recharge amount
   * @param {string} Pin - User PIN
   * @param {string} CircleId - Circle/State ID (duplicate)
   * @param {string} MediumId - Medium ID
   * @param {string} CircleCode - Circle code
   * @param {string} AccountNo - Account number
   * @param {string} AccountOther - Other account details
   * @param {string} Optional1 - Optional parameter 1
   * @param {string} Optional2 - Optional parameter 2
   * @param {string} Optional3 - Optional parameter 3
   * @param {string} Optional4 - Optional parameter 4
   * @param {string} Version - API version
   * @param {string|null} Location - Optional location data
   * @returns {Promise} - API response
   */
  RechargeCall: (
    Tokenid, 
    UserID, 
    RefTxnId, 
    MobileNo, 
    Operator, 
    CricleId, 
    Amount, 
    Pin, 
    CircleId, 
    MediumId, 
    CircleCode, 
    AccountNo, 
    AccountOther,
    Optional1,
    Optional2,
    Optional3,
    Optional4, 
    Version, 
    Location
  ) =>
    axios.post('https://onlinerechargeservice.in/Recharge/RechargeCall1', {
      Tokenid, 
      UserID, 
      RefTxnId, 
      MobileNo, 
      Operator, 
      CricleId, 
      Amount, 
      Pin, 
      CircleId, 
      MediumId, 
      CircleCode, 
      AccountNo, 
      AccountOther,
      Optional1,
      Optional2,
      Optional3,
      Optional4, 
      Version, 
      Location
    }),

  /**
   * Books a complaint
   * @param {string} Tokenid - Authentication token
   * @param {string} RecID - Record ID
   * @param {string} Remark - Complaint remark
   * @param {string} Version - API version
   * @param {string|null} Location - Optional location data
   * @returns {Promise} - API response
   */
  BookComplain: (Tokenid, RecID, Remark, Version, Location) =>
    api.post('/BookComplain', {
      Tokenid,
      RecID,
      Remark,
      Version,
      Location
    }),

  /**
   * Fetches commission information (alternative endpoint)
   * @param {string} Tokenid - Authentication token
   * @param {string} Version - API version
   * @param {string|null} Location - Optional location data
   * @returns {Promise} - API response
   */
  Commission2: (Tokenid, Version, Location) =>
    api.post('/Commission', {
      Tokenid,
      Version,
      Location
    }),

  /**
   * Fetches DTH information
   * @param {string} Tokenid - Authentication token
   * @param {string} DTHNO - DTH number
   * @param {string} Operator - Operator code
   * @param {string} Version - API version
   * @param {string|null} Location - Optional location data
   * @returns {Promise} - API response
   */
  DthInfo: (Tokenid, DTHNO, Operator, Version, Location) =>
    api.post('/DTHINFO', {
      Tokenid,
      DTHNO,
      Operator,
      Version,
      Location
    }),
};

export default RechargeApiServices;