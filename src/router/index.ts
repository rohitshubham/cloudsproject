import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import Country from '@/views/Country.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Coronahome',
    component: HomePage
  },
  {
    path: '/homepage',
    name: 'Coronahome',
    component: HomePage
  },
  {
    path: '/country/:country',
    name: 'Country Details',
    component: Country
  },
  {
    path: '*',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
