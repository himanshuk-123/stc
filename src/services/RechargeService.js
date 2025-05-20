import api from './api'

const RechargeApiServices = {
  operator: (Tokenid, mode, Version, Location) =>
    api.post('/Operator', {
      Tokenid, mode, Version, Location
    }),
  commission: (Tokenid, Version, Location) =>
    api.post('/Commission', {
      Tokenid, Version, Location
    }),
  RechargeCall: (Tokenid, UserID, RefTxnId, MobileNo, Operator, CricleId, Amount, Pin, CircleId, MediumId, CircleCode, AccountNo, AccountOther, Version, Location) =>
    api.post('/RechargeCall', {
      Tokenid, UserID, RefTxnId, MobileNo, Operator, CricleId, Amount, Pin, CircleId, MediumId, CircleCode, AccountNo, AccountOther, Version, Location
    }),
  BookComplain:(Tokenid,RecID,Remark,Version,Location) =>
    api.post('/BookComplain',{
      Tokenid,RecID,Remark,Version,Location
    }),
  Commission2:(Tokenid,Version,Location) =>
    api.post('/Commission',{
      Tokenid,Version,Location
    }),
  DthInfo:(Tokenid,DTHNO,Operator,Version,Location) =>
    api.post('/DTHINFO',{
      Tokenid,DTHNO,Operator,Version,Location
    }),

}

export default RechargeApiServices;