import { createRouter, createWebHistory } from "vue-router";

let initRoutes = [
    {
        path: "/",
        name: "home",
        title: "home",
        meta: {
          title: "home",
        },
        component: () => import(/* webpackChunkName: "home" */ "../components/HelloWorld.vue"),
      },
]

const routes = [...initRoutes];

const router = createRouter({
    history: createWebHistory(""),
    routes,
  });

  export default router;