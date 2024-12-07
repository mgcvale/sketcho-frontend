<script lang="ts">
    import { isUserData, UserService } from '$lib/services/userService';
    import { userStore, type UserData } from '$lib/stores/userStore';
    import { goto } from '$app/navigation';
    import '/src/style/forms.scss';
    import type { ApiResponse } from '$lib/services/requests';
    import { initializeSocketConnection, loadMessageHistory } from '$lib/services/chatService';
    import { chatStore } from '$lib/stores/chatStore';

    let username: string = $state("");
    let password: string = $state("");
    let confirmPassword: string = $state("");
    let { mode = $bindable() } = $props();
    let errorMsg: string | null = $state(null);

    let userService: UserService = new UserService();

    async function onclick() {
        $chatStore.connection?.disconnect();
        let response: ApiResponse<UserData | null> = await userService.createUser({username: username, password: password});
        if (response.success && isUserData(response.data)) {
            let userData = response.data;
            userService.loadTokenToCookie(userData.accessToken);
            userStore.set(userData);
            chatStore.set({connection: initializeSocketConnection(userData.accessToken)});
            loadMessageHistory();
            goto('/');
        } else {
            console.log(response.status);
            errorMsg = {
                400: `You left one or more fields empty.`,
                405: `An error occourred on our end. Error code: 405`,
                404: `An error occourred on our end. Error code: 404`,
                401: `Invalid username or password.`,
                403: `You are blocked from accessing this service.`,
                409: `A user with the '${username}' username already exists.`,
                500: `An error occoured with our provider. Error code: 500`,
                502: `An invalid response was sent by our provider. Error code: 502`,
                503: `The login service is unavaliable. Check your internet connection.`
            }[response.status] || `An unknown error occoured. Error code: ${response.status}`
            setInterval(() => {
                errorMsg = null;
            }, 10000)
        }
    };
</script>

<form>
    <div>
        <label for="username">Username</label>
        <input type="text" id="username" bind:value={username}>
    </div>
    <div>
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password}>
    </div>
    <div>
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirm-password"  bind:value={confirmPassword}>
    </div>
    <button {onclick}>Create user</button>
</form>
{#if errorMsg}
<p class="error">{errorMsg}</p>
{/if}
<a href="/user/login" onclick={() => mode = "login"}>Login instead</a>