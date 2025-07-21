import api from "./api";

const ReportService = {
    TransactionReport: (Tokenid, Startdate, status, Enddate, MobileNo, Version, Location) =>
        api.post('/TransactionReport', {
            Tokenid, Startdate, status, Enddate, MobileNo, Version, Location
        }),
    DashboardHome: (Tokenid, FormDate, ToDate, Version, Location) =>
        api.post('/DashboardHome', {
            Tokenid, FormDate, ToDate, Version, Location
        }),
    RechargeReport: (Tokenid, Startdate, status, Enddate, MobileNo, Version, Location) =>
        api.post('/RechargeReport', {
            Tokenid, Startdate, status, Enddate, MobileNo, Version, Location
        }),
    StandingReport: (Tokenid, PageIndex, PageSize, Version, Location) =>
        api.post('/StandingReport', {
            Tokenid, PageIndex, PageSize, Version, Location
        }),
    ComplainList: (Tokenid, PageIndex, PageSize, Version, Location) =>
        api.post('/ComplainList', {
            Tokenid, PageIndex, PageSize, Version, Location
        }),
    UserDayBook: (Tokenid, Version, Location) =>
        api.post('/UserDayBook', {
            Tokenid, Version, Location
        }),
    FundRequestList: (Tokenid, PageIndex, PageSize, Version, Location) =>
        api.post('/FundRequestList', {
            Tokenid, PageIndex, PageSize, Version, Location
        }),
    MEMBERLIST: (Tokenid, Version, Location) =>
        api.post('/MEMBERLIST', {
            Tokenid, Version, Location
        }),
    REPORTSLIST: (Tokenid, Startdate, status, Enddate, MobileNo, Version, Location) =>
        api.post('/RechargeReport', {
            Tokenid, Startdate, status, Enddate, MobileNo, Version, Location
        }),



}

export default ReportService;