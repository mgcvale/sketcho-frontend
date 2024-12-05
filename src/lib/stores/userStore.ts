import { writable } from "svelte/store";

export interface UserData {
    accessToken: string,
    username: string,
    loggedIn: boolean
}

export interface LoginData {
    username: string,
    password: string
}

export const userStore = writable<UserData>({
    accessToken: "",
    username: "",
    loggedIn: false
})