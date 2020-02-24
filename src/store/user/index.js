import { MessageBox, Message } from 'element-ui'
import { login, getinfo, register } from '../../api/user'

const user = {
    state: {
        id: null,
        name: null,
        avatar: null,
        title: null,
        token: null
    },
    getters: {

    },
    mutations: {
        settoken(state, res) {
            state.token = res
        },
        setname(state, res) {
            state.name = res
        },
        setid(state, res) {
            state.id = res
        },
        settitle(state, res) {
            state.title = res
        },
        setavatar(state, res) {
            state.avatar = res
        }
    },
    actions: {
        async login({ commit }, data) {
            await login(data).then(res => {
                if (res.token) {
                    commit('settoken', res.token.id)
                    Message({
                        message: '登录成功！',
                        type: 'success',
                        duration: 1000
                    })
                } else {
                    commit('settoken', res.token)
                    console.log('登录成功账号或密码错误！！')
                    Message({
                        message: '账号或密码错误！',
                        type: 'error',
                        duration: 1000
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        logout({ commit }) {
            commit("settoken", null)
        },
        async getInfo({ commit, state }) {
            await getinfo(state.token).then(res => {
                commit("setname", res.userinfo.username)
                commit("setavatar", res.userinfo.avatar)
                commit("settitle", res.userinfo.title)
            }).catch(err => {
                console.log(res)
            })
        }
    }
}

export default user;