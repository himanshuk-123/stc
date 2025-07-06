import api from "./api";

const RegisterService = {
    otpRequest: (MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location) =>
        api.post('/RegisterOTPrequest',{
            MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location
        }),
        registeration: (ID,MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location) =>
        api.post('/Registration',{
            ID,MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location
        }),
        AddMember: (Tokenid,MobileNo,EmailID,Password,ShopName,Name,Type,Version) =>
        api.post('/AddMember',{
           Tokenid,MobileNo,EmailID,Password,ShopName,Name,Type,Version
        })
}

export default RegisterService;