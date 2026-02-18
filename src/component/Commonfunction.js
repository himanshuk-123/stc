import ReportService from '../services/reportService';
import RechargeService from '../services/RechargeService';
import { Alert ,Linking} from 'react-native';
export const dashboardHome = async ({ userData }) => {
  try {
    const payload = {
      Tokenid: userData.tokenid,
      FormDate: null,
      ToDate: null,
      Version: '1',
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

export const handleRecharge = async ({ userData, MobileNo, opcodenew, Amount, navigation, setLoading, setError, pin='0000' }) => {
  setLoading(true);

  const payload = {
      Token: userData.tokenid,
      UserID: null,
      RefTxnId: null,
      MobileNo: MobileNo,
      Operator: opcodenew,
      CricleId: "12",
      Amount: Amount,
      Pin: pin,
      CircleId: null,
      MediumId: "1",
      CircleCode: null,
      AccountNo: null,
      AccountOther: null,
      Optional1: null,
      Optional2: null,
      Optional3: null,
      Optional4: null,
      Version: '1',
      Location: null,
  }
  console.log(payload);
  try {
      const response = await RechargeService.RechargeCall(
          payload.Token,
          payload.UserID,
          payload.RefTxnId,
          payload.MobileNo,
          payload.Operator,
          payload.CricleId,
          payload.Amount,
          payload.Pin,
          payload.CircleId,
          payload.MediumId,
          payload.CircleCode,
          payload.AccountNo,
          payload.AccountOther,
          payload.Optional1,
          payload.Optional2,
          payload.Optional3,
          payload.Optional4,
          payload.Version,
          payload.Location,
      )
      console.log(response.data);
      
      // Still show the alert for backward compatibility
      // Alert.alert(
      //     response.data.STATUS,
      //     response.data.MESSAGE,
      //     [
      //         {
      //             text: 'OK',
      //             onPress: () => navigation.goBack()
      //         }
      //     ]
      // );
      
      // Return the result for use with success/error modal
      return {
          success: response.data.STATUS === "SUCCESS",
          message: response.data.MESSAGE,
          data: response.data
      };
  } catch (error) {
      console.error('Error during recharge:', error);
      setError('An error occurred while processing the recharge. Please try again.');
      
      // Return error for use with error modal
      return {
          success: false,
          message: 'An error occurred while processing the recharge. Please try again.',
          error: error
      };
  } finally {
      setLoading(false);
  }
}

export const handleCallPress = () => {
  const phoneNumber = 'tel:9119870214'; 
  Linking.openURL(phoneNumber);
};
