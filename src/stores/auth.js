import { defineStore } from "pinia";
import api from "@/services/api";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === "admin",
    },

    actions: {
        async login(credentials) {
            const response = await api.post("/login", credentials);
            this.setAuthData(response.data);
        },

        async register(userData) {
            const response = await api.post("/register", userData);
            this.setAuthData(response.data);
        },

        async logout() {
            await api.post("/logout");
            this.user = null;
            this.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
        },

        setAuthData(data) {
            this.user = data.user;
            this.token = data.token;
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        },
    },
});