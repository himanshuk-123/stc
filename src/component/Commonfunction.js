// src/utils/dashboardHome.js
  import Constants from 'expo-constants';
import ReportService from '../services/reportService';

export const dashboardHome = async ({ userData }) => {
  try {
    const payload = {
      Tokenid: userData.tokenid,
      FormDate: null,
      ToDate: null,
      Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
      Location: null,
    };

    const response = await ReportService.DashboardHome(
      payload.Tokenid,
      payload.FormDate,
      payload.ToDate,
      payload.Version,
      payload.Location
    );

    const { ClosingBalance, StandingBalance, Notification, STATUSCODE, MESSAGE } = response.data;

    return {
      success: STATUSCODE === "1",
      data: {
        closingBalance: ClosingBalance,
        standingBalance: StandingBalance,
        notification: Notification || '',
      },
      errorMessage: MESSAGE || '',
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch dashboard data. Please login again.',
    };
  }
};
