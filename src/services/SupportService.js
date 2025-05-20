import api from "./api";

const SupportService = {
    Support:(Tokenid,Version,Location)=>
        api.post('/Support',{
            Tokenid,Version,Location
        }),
    Contact:(Tokenid,Version,Location)=>
        api.post('/Contact',{
            Tokenid,Version,Location
        }),

}

export default SupportService;