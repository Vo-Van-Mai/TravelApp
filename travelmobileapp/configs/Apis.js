import axios from "axios";

const BASE_URL = "http://192.168.100.229:8000/";
export const endpoints = {
    // Categoories endpoint
    'categories': '/categories/',
    'role': '/roles/',
    //user
    'login': '/o/token/',
    'register': '/users/register/',
    'current-user': 'users/current-user/',
    'users': '/users/',
    'verified': (userId) => `/users/${userId}/verified-provider/`,
    'cancel': (userId) => `/users/${userId}/cancel-provider/`,
    // place endpoint
    'places': '/places/',
    'placeDetail': (id) => `/places/${id}/`,
    'favourite': '/users/get-favourite-place/',
    
    // comment and rating 
    'comments': (placeId) => `/places/${placeId}/get-comment/`,
    'ratings': (placeId) => `/places/${placeId}/get-rating/`,
    'averageRating': (placeId) => `/places/${placeId}/get-average-rating/`,
    'userRating': (placeId) => `/places/${placeId}/user-rating/`,

    'provinces': '/provinces/',
    'wards': '/wards/',

    //provider
    'provider': '/providers/',
    'detailProvider': (userId) => `/providers/${userId}/`,
    
    //tour
    'tour': '/tours/',
};

export const authAPI = (accessToken) => {
    return axios.create(
        {
            'baseURL': BASE_URL,
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
};

export default axios.create(
    {
        'baseURL': BASE_URL
    }
);