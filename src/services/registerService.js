import api from "./api";

const RegisterService = {
    otpRequest: (MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location) =>
        api.post('/RegisterOTPrequest',{
            MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location
        }),
        registeration: (ID,MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location) =>
        api.post('/RegistrationCall1',{
            ID,MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location
        }),
        AddMember: (ID,MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location) =>
        api.post('/AddMember',{
            ID,MobileNo,EmailID,State,Pincode,Name,Address,MobileOTP,MailOTP,Version,Location
        })
}

export default RegisterService;