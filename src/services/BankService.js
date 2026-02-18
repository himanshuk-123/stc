import api from "./api";

const BankService = {
    Support:(Tokenid,Version,Location)=>
        api.post('/Support',{
            Tokenid,Version,Location
        }),
    BankList:(Tokenid,Version,Location)=>
        api.post('/BankDetails',{
            Tokenid,Version,Location
        }),
    PaymentRequest:(payload)=>
        api.post('/WalletRequest',payload),
     
    WalletRequestStatusCheck:(Tokenid,WalletID,Version)=>
        api.post('/WalletRequestStatusCheck',{
            Tokenid,WalletID,Version
        })
}

export default BankService;