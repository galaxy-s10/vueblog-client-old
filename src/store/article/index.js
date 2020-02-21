import { articlelist, articlepage, findarticle, articletypelist } from '../../api/article'


const article = {
    state: {
        // 总页数
        count: null,
        // 当前页数
        nowpage: 1,
        // 当前类型
        nowtype: null,
        // 历史文章列表
        list: null,
        // 文章列表
        pagelist: null,
        // 热门文章列表
        hotlist: null,
        // 文章数据
        data: null,
        // 搜索数据
        search: null,
        // 分页大小
        pagesize: 4,
        // 文章类型
        typelist: null,
        history: null
    },
    getters: {

    },
    // 同步
    mutations: {
        list(state, res) {
            state.list = res
        },
        page(state, res) {
            state.list = res
        },
        nowpage(state, res) {
            state.nowpage = res
        },
        nowtype(state, res) {
            state.nowtype = res
        },
        typelist(state, res) {
            state.typelist = res
        },
        data(state, res) {
            window.document.title = res[0].title + " | vueblog"
            state.data = res
        },
        search(state, res) {
            state.search = res
        },
        pagelist(state, res) {
            state.pagelist = res
        },
        hotlist(state, res) {
            // state.hotlist = res
            // slice截取指定元素
            // state.hotlist = res.slice(0, 3)
            state.hotlist = res
        },
        history(state, res) {
            // slice截取指定元素
            state.history = res
        },
        count(state, res) {
            state.count = res
        }
    },
    // 异步
    actions: {
        articletypelist({ commit }) {
            articletypelist().then(res => {
                commit('typelist', res.typelist)
            }).catch(err => {
                console.log("获取文章类型失败");
                console.log(err)
            })
        },
        articlepage({ commit, state }, data) {
            var { ordername, orderby, type, nowpage } = data
            var nowtype = state.nowtype
            if (nowtype) {
                type = nowtype
            }
            articlepage(ordername, orderby, type, nowpage, state.pagesize)
                .then(res => {
                    commit('pagelist', res.pagelist.rows)
                    console.log(res)
                    commit('count', res.pagelist.count)
                })
        },
        articlelist({ commit }, data) {
            var { ordername, orderby } = data
            articlelist(ordername, orderby)
                .then(res => {
                    if (order) {
                        commit('history', res.data)
                        commit('count', res.data.length)
                    }
                    if (type == undefined) {
                        // 如果无类型的分页，总条数即全部条数
                        commit('count', res.data.length)
                    } else {
                        // 如果有类型的分页，总条数即有分类的总条数
                        commit('list', res.data)
                        commit('count', res.data.length)
                    }

                })
                .catch(err => {
                    console.log("获取文章数据失败");
                    console.log(err);
                });
        },
        articlehotlist({ commit }, data) {
            var { ordername, orderby, type, nowpage } = data
            articlepage(ordername, orderby, type, nowpage, 4)
                .then(res => {
                    commit('hotlist', res.pagelist.rows)
                })
        },
        async findarticle({ commit }, data) {
            var { keyword, id } = data
            await findarticle(id, keyword)
                .then(res => {
                    if (keyword) {
                        commit('search', res.data)
                    } else {
                        commit('data', res.data)
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        async articlehistory({ commit }, data) {
            var { ordername, orderby } = data
            var data = await articlelist(ordername, orderby)
            commit("count", data.list.count)
            commit("list", data.list.rows)
        }
    }
}

export default article;