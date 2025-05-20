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

}

export default BankService;