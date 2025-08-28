/**
 * Utility functions for processing plan data
 */
import { PLAN_TYPES_PRIORITY } from './api';

/**
 * Groups plans by their type
 * @param {Array} data - Raw plan data
 * @returns {Object} - Plans grouped by type
 */
export const groupPlansByType = (data = []) => {
  const grouped = {};
  
  data.forEach((category) => {
    const type = category?.name?.toLowerCase();
    if (!type) return;

    grouped[type] = category?.plans?.map((plan) => ({
      id: plan?.id,
      price: plan?.amount || '',
      validity: plan?.validity || '',
      benefit: plan?.benefit || '',
      sms: plan?.sms || '',
      data: plan?.data || '',
      calls: plan?.calls || '',
      validityDays: plan?.validityDays || '',
      dailyCost: plan?.dailyCost || '',
    })) || [];
  });
  
  return grouped;
};

/**
 * Prioritizes tabs based on predefined order
 * @param {Array} tabs - List of tabs to prioritize
 * @returns {Array} - Prioritized tabs
 */
export const prioritizeTabs = (tabs) => {
  const lowerTabs = tabs.map((tab) => tab.toLowerCase());
  const prioritizedTabs = [];
  
  PLAN_TYPES_PRIORITY.forEach((p) => {
    const index = lowerTabs.indexOf(p);
    if (index !== -1) prioritizedTabs.push(tabs[index]);
  });
  
  const remainingTabs = tabs.filter(tab => !PLAN_TYPES_PRIORITY.includes(tab.toLowerCase()));
  return [...prioritizedTabs, ...remainingTabs];
};
