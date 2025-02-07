import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Feed from "@/views/Feed.vue";
import Profile from "@/views/Profile.vue";
import Post from "@/views/Post.vue";

const routes = [
  { path: "/", name: "Feed", component: Feed },
  { path: "/login", name: "Login",component: Login },
  { path: "/register", name: "Register",component: Register },
  { path: "/profile/:id",name: "Profile", component: Profile, props:true },
  { path: "/post", name: "Post",component: Post },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
