<script lang="ts">
    import { onMount } from 'svelte';
    import { userStore, type UserData } from "$lib/stores/userStore";
    import { isUserData, UserService } from "$lib/services/userService";
    import type { ApiResponse } from '$lib/services/requests';
    import { initializeSocketConnection, loadMessageHistory } from '$lib/services/chatService';
    import { chatStore } from '$lib/stores/chatStore';

    let { children } = $props();

    const userService = new UserService();
    onMount(async () => {
        if ($userStore.loggedIn) {
            return;
        }
        
        const response: ApiResponse<UserData | null> = await userService.getDataFromCookie();
        if (response.success && isUserData(response.data)) {
            userStore.set(response.data);
            console.log("Loaded user " + $userStore.username);
        } else {
            console.log("Error loading user: " + response.status);
            if (response.error !== "No cookie" && response.status != 400) {
                alert("There was an error loading your account! You may re-login or check yout internet connection to use the service.");
            }
        }

        if ($userStore.loggedIn) {
            chatStore.set({connection:  initializeSocketConnection($userStore.accessToken)});
            loadMessageHistory();
        }
    });
</script>

{@render children()}