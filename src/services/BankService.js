import api from "./api";

const BankService = {
    Support:(Tokenid,Version,Location)=>
        api.post('/Support',{
            Tokenid,Version,Location
        }),
    Support:(Tokenid,Version,Location)=>
        api.post('/Support',{
            Tokenid,Version,Location
        }),
    BankList:(Tokenid,Version,Location)=>
        api.post('/BankDetails',{
            Tokenid,Version,Location
        }),
    PaymentRequest:(Tokenid,RequestTo,Amount,SecAmt,Mode,Bankid,WalletType,RefrenceNo,Remark,Response,Version,Location)=>
        api.post('/WalletRequest',{
            Tokenid,RequestTo,Amount,SecAmt,Mode,Bankid,WalletType,RefrenceNo,Remark,Response,Version,Location
        }),

}

export default BankService;