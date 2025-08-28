/**
 * API service for plan-related operations
 */
import { ENDPOINTS, HTTP_STATUS } from '../utils/api';

/**
 * Fetches browse plan data from the API
 * @param {string} opCode - Operator code
 * @param {string} circleId - Circle/State ID
 * @returns {Promise<Object>} - The response data or throws an error
 */
export const fetchBrowsePlans = async (opCode, circleId) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.BROWSE_PLAN}?OpCode=${opCode}&CircleID=${circleId}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    if (data?.STATUS !== HTTP_STATUS.SUCCESS) {
      throw new Error(data?.MESSAGE || 'Failed to fetch plan data');
    }

    return data?.RDATA || [];
  } catch (error) {
    console.error('Error in fetchBrowsePlans:', error);
    throw error;
  }
};
