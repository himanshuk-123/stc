import api from "./api";

export const PlanService = {
    DTHInfo: (Tokenid,Operator,DTHNO, Version, Location) =>
        api.post('/DTHINFO', {
            Tokenid, Operator, DTHNO, Version, Location
        })
}

