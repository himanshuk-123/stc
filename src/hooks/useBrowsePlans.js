/**
 * Custom hook for managing plan data
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchBrowsePlans } from '../services/planApiService';
import { groupPlansByType, prioritizeTabs } from '../utils/planUtils';

/**
 * Hook for managing browse plans data and state
 * @param {object} params - Parameters for fetching plans
 * @param {string} params.opCode - Operator code
 * @param {string} params.circleId - Circle/State ID
 * @returns {object} - Plan data and related state and functions
 */
export const useBrowsePlans = ({ opCode, circleId }) => {
  const [data, setData] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = useCallback(async () => {
    if (!opCode || !circleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const planData = await fetchBrowsePlans(opCode, circleId);
      setData(planData);
      
      const grouped = groupPlansByType(planData);
      setGroupedData(grouped);
      
      const types = prioritizeTabs(Object.keys(grouped));
      if (!selectedType || !types.includes(selectedType)) {
        setSelectedType(types[0] || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch plans');
      console.error('Error in useBrowsePlans:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [opCode, circleId, selectedType]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlans();
  }, [fetchPlans]);

  const handleTypeSelect = useCallback((type) => {
    setSelectedType(type);
  }, []);

  const handlePlanSelect = useCallback((plan) => {
    setSelectedPlan(prevPlan => prevPlan?.id === plan.id ? null : plan);
  }, []);

  return {
    data,
    groupedData,
    selectedType,
    loading,
    error,
    refreshing,
    selectedPlan,
    handleRefresh,
    handleTypeSelect,
    handlePlanSelect,
    availableTypes: Object.keys(groupedData).length > 0 ? prioritizeTabs(Object.keys(groupedData)) : [],
    currentPlans: groupedData[selectedType] || [],
  };
};
