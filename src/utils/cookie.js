import Cookies from 'js-cookie'

export default  {
    getCookie(key) {
        return Cookies.get(key)
    },
    setCookie(key, value, expiresTime) {
        let seconds = expiresTime
        let expires = new Date(new Date() * 1 + seconds * 1000)
        return Cookies.set(key, value, { expires: expires })
    },
    removeCookie(key){
        return Cookies.remove(key)
    }
};
