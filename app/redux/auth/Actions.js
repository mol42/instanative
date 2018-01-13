export const AUTO_LOGIN_REQUEST = "AUTO_LOGIN_REQUEST";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const APP_INITIALIZED = "APP_INITIALIZED";
export const LOGIN_FORM_UPDATED = "LOGIN_FORM_UPDATED";
export const FETCH_PROFILE_REQUEST = "FETCH_PROFILE_REQUEST";
export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
export const PROFILE_NAME_CHANGED = "PROFILE_NAME_CHANGED";
export const PROFILE_JOB_CHANGED = "PROFILE_JOB_CHANGED";
export const PROFILE_WEBSITE_CHANGED = "PROFILE_WEBSITE_CHANGED";
export const SAVE_PROFILE_REQUEST = "SAVE_PROFILE_REQUEST";
export const SAVE_PROFILE_SUCCESS = "SAVE_PROFILE_SUCCESS";
export const SAVE_PROFILE_FAILURE = "SAVE_PROFILE_FAILURE";

export const tryLogin = (email, password) => ({
    type : LOGIN_REQUEST,
    payload : {
        email,
        password
    }
});

export const tryAutoLogin = (email, password) => ({
    type : AUTO_LOGIN_REQUEST
});

export const loginSuccess = (loginData) => ({
    type : LOGIN_SUCCESS,
    payload : loginData
});

export const loginFailure = (errorData) => ({
    type : LOGIN_FAILURE,
    payload : errorData
});

export const informAppInitialized = () => ({
    type : APP_INITIALIZED
});

export const updateLoginForm = (email, password) => ({
    type : LOGIN_FORM_UPDATED,
    payload : {
        email,
        password
    }
});

export const fetchProfile = () => ({
    type : FETCH_PROFILE_REQUEST
});

export const fetchProfileSuccess = (profile) => ({
    type : FETCH_PROFILE_SUCCESS,
    payload : profile
})

export const nameChanged = (nameText) => ({
    type : PROFILE_NAME_CHANGED,
    payload : nameText
});

export const currentJobChanged = (currentJobText) => ({
    type : PROFILE_JOB_CHANGED,
    payload : currentJobText
});

export const webSiteLinkChanged = (webSiteLinkText) => ({
    type : PROFILE_WEBSITE_CHANGED,
    payload : webSiteLinkText
});

export const saveProfile = (profile) => ({
    type : SAVE_PROFILE_REQUEST,
    payload : profile
});

export const saveProfileSuccess = () => ({
    type : SAVE_PROFILE_SUCCESS
});

export const saveProfileFailure = () => ({
    type : SAVE_PROFILE_FAILURE
})