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

    // place endpoint
    'places': '/places/',
    'placeDetail': (id) => `/places/${id}/`,
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