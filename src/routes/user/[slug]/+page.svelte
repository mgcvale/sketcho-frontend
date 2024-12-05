<script lang="ts">
    import '/src/style.scss';
    import { userStore, type UserData } from '$lib/stores/userStore';
    import LoginMenu from '$lib/components/LoginMenu.svelte';
    import RegisterMenu from '$lib/components/RegisterMenu.svelte';
    import { type PageData } from './$types';

    let { data } = $props();
    let mode = $state(data.slug);

</script>

<header>
    <div class="flex">
        <a href="/">
            <h1>
                Chat com os amigos
            </h1>
        </a>
        <span>/</span>
        <h2>
            Conta
        </h2>
        <span>/</span>
        <h2>
            {mode}
        </h2>
    </div>
    <a href="/">
        &lt;- Voltar para o chat
    </a>
</header>

<main class="floating-content-container">
    <div class="floating-content center-text">
        <h2>{mode.charAt(0).toUpperCase() + mode.slice(1)}</h2>
        {#if mode == "register"}
        <RegisterMenu bind:mode={mode}></RegisterMenu>
        {:else if mode == "login"}
        <LoginMenu bind:mode={mode}></LoginMenu>
        {:else}
        <h3>What are you doing here?!</h3>
        <a href="/user/login" onclick={() => mode = "register"}>Go to login page</a>
        {/if}
        {#if $userStore.loggedIn}
        <p class="warning" style="font-size: .8em">
            Warning: you are already logged in! Re-logging in will log you out of your current '{$userStore.username}' account.
        </p>
        {/if}
    </div>
</main>

<style lang="scss">
    .floating-content {
        width: clamp(20%, 450px, 80%);
    }
</style>