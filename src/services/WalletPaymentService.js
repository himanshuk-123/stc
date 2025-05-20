import api from "./api";

const WalletPayment = {
    DashboardHome:(Tokenid,mode,Version,Location)=>
        api.post('/DashboardHome',{
            Tokenid,mode,Version,Location
        }),
    UpiCall:(Tokenid,Version,Location)=>
        api.post('/UpiCall',{
            Tokenid,Version,Location
        }),
    StcPay:(Tokenid,Amount,Version,Location)=>
        api.post('/StcPay',{
            Tokenid,Amount,Version,Location
        }),
    Wallet:(Tokenid,UserID,TYPE,Amount,WalletType,Remark,SMS,Version,Location)=>
        api.post('/Wallet',{
            Tokenid,UserID,TYPE,Amount,WalletType,Remark,SMS,Version,Location
        }),

}

export default WalletPayment;