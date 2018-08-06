import Vue from 'vue'
import Router from 'vue-router'
import LeafletMap from '@/components/MainPage/Index'
import Display from '@/components/Display/Index'
import Profile from '@/components/Profile/Index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Map',
      component: LeafletMap
    },
    {
      path: '/display',
      name: 'Display',
      component: Display
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/:id',
      props: true,
      component: LeafletMap
    }
  ]
})
