import { call, put, takeEvery, takeLatest, take } from 'redux-saga/effects'
import instaApi from "./configureApi";
import uploadApi from "./uploadApi";

import {
    LOGIN_REQUEST,
    AUTO_LOGIN_REQUEST,
    SAVE_PROFILE_REQUEST,
    FETCH_PROFILE_REQUEST,
    LOGOUT_REQUEST,
    loginSuccess,
    loginFailure,
    logoutSuccess,
    saveProfileSuccess,
    fetchProfileSuccess
} from "../auth/Actions";
import {
    FETCH_RECENT_MEDIA_REQUEST,
    FETCH_MY_RECENT_PHOTOS_REQUEST,
    DO_UPLOAD_REQUEST,
    UPLOAD_PROGRESS_CHANGED,
    fetchMediaSuccess,
    fetchMyRecentPhotosSuccess
} from "../media/Actions";

import uploadSaga from "./uploadSaga";

const tryLoginSaga = function*(action) {
    let {email, password} = action.payload;

    try {
        const loginResponse = yield call(instaApi.doLogin, email, password);
        if (loginResponse && loginResponse.status == "ok") {
            let {sessionToken, user} = loginResponse.data;
            // api token bilgisini yardımcı olarak kullandığımız
            // sınıflar ile paylaşıyoruz.
            instaApi.setToken(sessionToken).saveAuthInfo(user, sessionToken);
            uploadApi.setToken(sessionToken);
            yield put(loginSuccess(loginResponse.data));
        } else {
            yield put(loginFailure({}));
        }
    } catch(err) {
        yield put(loginFailure({}));
    }
}

const tryAutoLoginSaga = function*() {
    const authInfo = yield call(instaApi.readAuthInfo);
    if (authInfo) {
        let {sessionToken} = authInfo;
        instaApi.setToken(sessionToken);
        uploadApi.setToken(sessionToken);
        yield put(loginSuccess(authInfo));       
    }
}

const doLogoutSaga = function*() {
    
}

const fetchRecentMediaSaga = function*() {
    const mediaDataResponse = yield call(instaApi.fetchRecentMedia);
    yield put(fetchMediaSuccess(mediaDataResponse.data));
}

const fetchMyRecentPhotosSaga = function*() {
    const mediaDataResponse = yield call(instaApi.fetchMyRecentPhotos);
    yield put(fetchMyRecentPhotosSuccess(mediaDataResponse.data));    
}

const saveProfileSaga = function*(action) {
    let profile = action.payload;
    const saveProfileResponse = yield call(instaApi.saveProfile, profile);
    yield put(saveProfileSuccess(saveProfileResponse));
}

const fetchProfileSaga = function*() {
    const profileResponse = yield call(instaApi.fetchProfile);
    yield put(fetchProfileSuccess(profileResponse.data));    
}

// api istekleri için kullandığımız saga dinleyicilerini
// tanımlıyoruz
const apiSagas = function*() {
    yield takeLatest(LOGIN_REQUEST, tryLoginSaga);
    yield takeLatest(FETCH_RECENT_MEDIA_REQUEST, fetchRecentMediaSaga);
    yield takeLatest(FETCH_MY_RECENT_PHOTOS_REQUEST, fetchMyRecentPhotosSaga);
    yield takeLatest(SAVE_PROFILE_REQUEST, saveProfileSaga);
    yield takeLatest(AUTO_LOGIN_REQUEST, tryAutoLoginSaga);
    yield takeLatest(FETCH_PROFILE_REQUEST, fetchProfileSaga);
}

// saga'lar birleştirilebiliyorlar ve burada upload ve
// api istekleri için kullandığımız sagaları birleştiriyoruz
const instaSaga = function* instaSaga() {
    yield [apiSagas(), uploadSaga()]
}

export default instaSaga;