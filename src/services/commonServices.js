import api from './api'
export const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const COMMON_SERVICE = {
    slider: () =>
        api.get('/SliderList'),

    circleList: () =>
        api.get('/CircleList')
    
}

export default COMMON_SERVICE;