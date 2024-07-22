import { createRouter, createWebHistory, RouteRecordRaw   } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    { path: '/trips', 
        name: 'Trips',
        component: ()=> import('../views/TripDetails.vue'),
    },
  
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router