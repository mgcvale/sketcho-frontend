<script lang="ts">
    import ChatBox from "./ChatBox.svelte";
    import ChatTyper from "./ChatTyper.svelte";
    import { userStore } from "$lib/stores/userStore";
    import { chatStore } from "$lib/stores/chatStore";

</script>

<div class="chat" >
    {#if $userStore.loggedIn}
        {#if $chatStore.connection}
        <ChatBox>
        </ChatBox>
        <ChatTyper>
        </ChatTyper>
        {:else}
        <p>Erro ao conectar com chat</p>
        {/if}
    {:else}
    <p>Faca login antes de conversar!</p>
    {/if}
</div>

<style lang="scss">
    @use '/src/var.scss';
    .chat {
        resize: both;
        width: 40%;

        @media (max-width: 768px) {
            width: 60%;
        }

        @media (max-width: 480px) {
            width: 80%;
        }

        height: 80%;
        background-color: var.$content-bg;
        border: 2px solid var.$content-border;

        display: flex;
        justify-content: space-between;
        flex-direction: column;
        border-radius: 8px;
    }
</style>