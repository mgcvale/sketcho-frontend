<script lang="ts">
    import { chatStore } from "$lib/stores/chatStore";
    import { userStore } from "$lib/stores/userStore";

    let message: string = $state("");

    function sendMessage() {
        $chatStore.connection?.sendMessage(message);
        message = "";
    }

</script>

<div>
    <input type="text" placeholder="type your message here" onkeypress={(e) => { if(e.key === "Enter" || e.keyCode === 13) sendMessage()}} bind:value={message}>
    <button onclick={sendMessage}>send</button>
</div>

<style lang="scss">
    div {
        padding: 1em;
        display: flex;
        gap: 8px;

        width: 100%;


        input {
            flex-grow: 1;
        }
    }
</style>