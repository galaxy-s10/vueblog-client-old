import Vue from 'vue'
import VueRouter from 'vue-router'

import layout from '../layout'

Vue.use(VueRouter)

var router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: layout,
            children: [
                {
                    // 当 / 匹配成功，
                    // allarticle 会被渲染在 layout 的 <router-view> 中
                    path: '',
                    component: () => import('@/components/allarticle'),
                    meta: { title: '首页' }
                }
            ],
        },
        {
            path: '/article/:id',
            component: layout,
            children: [
                {
                    // 当 /article/:id 匹配成功，
                    // articleid 会被渲染在 layout 的 <router-view> 中
                    path: '',
                    component: () => import('@/components/articleid'),
                    meta: { title: '文章' }
                },
                {
                    // 当 /article/:id/test 匹配成功，
                    // articleid 会被渲染在 layout 的 <router-view> 中
                    path: 'test',
                    component: () => import('@/components/articleid'),
                    meta: { title: '文章' }
                }
            ],
        },
        {
            path: '/about',
            component: layout,
            children: [
                {
                    path: '',
                    component: () => import('@/components/about'),
                    meta: { title: '关于' }
                }
            ],
        },
        {
            path: '/link',
            component: layout,
            children: [
                {
                    path: '',
                    component: () => import('@/components/link'),
                    meta: { title: '友链' }
                }
            ],
        },
        {
            path: '/message',
            component: layout,
            children: [
                {
                    path: '',
                    component: () => import('@/components/message'),
                    meta: { title: '留言板' }
                }
            ],
        },
        {
            path: '/history',
            component: layout,
            // component: () => import('@/components/history'),
            children: [
                {
                    path: '',
                    component: () => import('@/components/history'),
                    meta: { title: '归档' }
                }
            ],
        },
        { path: '*', component: () => import('@/components/err'), meta: { title: "404" } },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path.indexOf("/article/")) {
        window.document.title = to.meta.title + " | vueblog"
    }
    next()
})

export default router