<script lang="ts">
    import Chat from "$lib/components/Chat.svelte";
    import ChatBox from "$lib/components/ChatBox.svelte";
    import ChatTyper from "$lib/components/ChatTyper.svelte";
    import AccountMenu from "$lib/components/AccountMenu.svelte";
    import '../style.scss';

</script>
<header>
    <div class="flex">
        <a href="/">
            <h1>
                Chat com os amigos
            </h1>
        </a>
    </div>
    <AccountMenu></AccountMenu>
</header>
<main>
    <Chat></Chat>
</main>

<style lang="scss">
    @use '/src/var.scss';

    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 4em);
        width: 100vw;
    }
</style>