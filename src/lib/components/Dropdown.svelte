<script lang="ts">
    import { onMount } from "svelte";

    let { open, itemsSnippet, openerSnippet, class: customClass } = $props();

    let dropdownElement: HTMLElement;

    function handleClickOutside(event: MouseEvent) {
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
            open = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

</script>

<button 
    class="dropdown {customClass}" 
    onclick={(e) => open = !open}
    bind:this={dropdownElement}>
    {@render openerSnippet()}
    {#if open}
    <div class="dropdown-content">
        {@render itemsSnippet("dropdown-items")}
    </div>
    {/if}
</button>

<style lang="scss">
    .dropdown {
    display: inline-block;
    cursor: pointer;
    padding: 0;
    font-size: 1em;

    .dropdown-content {
        text-align: center;
        cursor:default;
        display: block;
        position: absolute;
        min-width: 120px;
        padding: .7em;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.6);

        > * {
            display: block;
        }
    }
}
</style>