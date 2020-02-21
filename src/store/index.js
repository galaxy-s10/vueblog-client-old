import Vue from 'vue'
import Vuex from 'vuex'
import article from './article'
import user from './user'


Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        article,
        user
    },

})

export default store