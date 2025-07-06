import api from "./api";

export const PlanService = {
    DTHInfo: (Tokenid,Operator,DTHNO, Version, Location) =>
        api.post('/DTHINFO', {
            Tokenid, Operator, DTHNO, Version, Location
        })
    ,
    SpecialOffers: (Tokenid,Version,Operator,MobileNo, Location) =>
        api.post('/OperatorPlan', {
            Tokenid,Version, Operator, MobileNo, Location
        }),
    GetBrowsePlan: () =>
        api.get('/BrowseCircleList')
}

