import axios from 'axios';
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
  RechargeCall: (Tokenid, UserID, RefTxnId, MobileNo, Operator, CricleId, Amount, Pin, CircleId, MediumId, CircleCode, AccountNo, AccountOther,Optional1,Optional2,Optional3,Optional4, Version, Location) =>
    axios.post('https://onlinerechargeservice.in/Recharge/RechargeCall1', {
      Tokenid, UserID, RefTxnId, MobileNo, Operator, CricleId, Amount, Pin, CircleId, MediumId, CircleCode, AccountNo, AccountOther,Optional1,Optional2,Optional3,Optional4, Version, Location
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