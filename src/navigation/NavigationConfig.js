/**
 * NavigationConfig - Navigation type definitions and route constants
 */

// Define route names as constants to avoid typos and enable code completion
export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    OTP_VERIFY: 'OtpVerify',
    FORGET_PASSWORD: 'ForgetPassword',
    CONTACT: 'Contact',
  },
  
  // Main app routes
  APP: {
    MAIN_TABS: 'MainTabs',
    HOME: 'Home',
    SERVICES: 'Services',
    MORE: 'MoreScreen',
    NOTIFICATION: 'Notification',
    PRINT_SCREEN: 'PrintScreen',
    HOME_SCREEN_2: 'HomeScreen2',
  },
  
  // Recharge routes
  RECHARGE: {
    MAIN: 'RechargeMain',
    MOBILE: 'MobileRecharge',
    DTH: 'DTHRecharge',
    COMPANY: 'CompanyRecharge',
    BROWSE_PLAN: 'BrowsePlan',
    BROWSE_PLAN_STATE: 'BrowsePlanStateSelection',
    SPECIAL_OFFERS: 'SpecialOffers',
    OPERATOR_DETAILS: 'OperatorDetails',
    PROGRESS: 'ProgressScreen',
  },
  
  // Payment routes
  PAYMENT: {
    ADD_MONEY: 'AddMoney',
    WALLET_PAYMENT: 'WalletPayment',
    WALLET_TOPUP: 'WalletTopup',
    PAYMENT_REQUEST: 'PaymentRequest',
    BILL_PAYMENTS: 'BillPayments',
    QR_SCANNER: 'QrScanner',
  },
  
  // Reports routes
  REPORTS: {
    MAIN: 'ReportsMain',
    TRANSACTION: 'TransactionReport',
    STANDING: 'StandingReport',
    USER_DAY_BOOK: 'UserDayBook',
    FUND_REQUEST_LIST: 'FundRequestList',
    REPORTS_LIST: 'ReportsList',
    RECHARGE_REPORT: 'RechargeReport',
    COMMISSION: 'Comission',
  },
  
  // Profile routes
  PROFILE: {
    MAIN: 'ProfileMain',
    CHANGE_PASSWORD: 'ChangePassword',
    CHANGE_PIN: 'ChangePin',
    ENABLE_DISABLE_PIN: 'EnableDisablePin',
    ENTER_PIN: 'EnterPin',
    MEMBER_LIST: 'MemberList',
    ADD_USER: 'AddUser',
  },
  
  // Support routes
  SUPPORT: {
    MAIN: 'SupportMain',
    CONTACT: 'Contact',
    COMPLAIN_LIST: 'ComplainList',
    BOOK_COMPLAIN: 'BookComplain',
  },
};

// Navigation types for type safety (can be used with TypeScript)
export const NAV_TYPES = {
  STACK: 'stack',
  TAB: 'tab',
  DRAWER: 'drawer',
};

// Screen configurations for consistent navigation options
export const SCREEN_OPTIONS = {
  DEFAULT: {
    headerShown: false,
  },
  WITH_HEADER: {
    headerShown: true,
    headerTitleAlign: 'center',
  },
  MODAL: {
    presentation: 'modal',
    headerShown: false,
  },
};

// Navigation animations
export const NAV_ANIMATIONS = {
  SLIDE_FROM_RIGHT: {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    }),
  },
  SLIDE_FROM_BOTTOM: {
    gestureDirection: 'vertical',
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    }),
  },
};
