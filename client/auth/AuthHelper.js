import { useSelector } from "react-redux"

const auth = {
    isAuthenticated() {
        if (typeof window == "undefined") return false

        if (localStorage.getItem('userData') || sessionStorage.getItem('userData')) return true
        else return false
    },

    isAdmin() {
        const userinfo = useSelector(state => state.login)
        if (!userinfo) return false
        const { user } = userinfo
        console.log('user', user)
        if (typeof window == "undefined") return false

        if (!info) return false
        if (info.user.user_type === 'Admin') return true

        else return false
    }
}

export default auth
