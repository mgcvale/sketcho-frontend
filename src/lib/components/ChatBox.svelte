<script lang="ts">
    import { messageStore } from "$lib/stores/messageStore";

</script>

<div class="chatbox">
{#each $messageStore.messages as message, i}
    <p>{message.sender}: {@html message.content}</p>
{/each}
</div>

<style lang="scss">
    .chatbox {
        overflow: scroll;

        display: flex;
        justify-content: flex-start;
        flex-direction: column-reverse;
        padding: 1em;
    }
</style>