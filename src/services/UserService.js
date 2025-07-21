import api from "./api";

const UserService = {
    Profile:(Tokenid,Version,Location)=>
        api.post('/Profile',{
            Tokenid,
            Version,
            Location
        }),
    BalanceCheck:(Tokenid,Version,Location)=>
        api.post('/BalanceCheck',{
            Tokenid,
            Version,
            Location
        }),
        
}

export default UserService;