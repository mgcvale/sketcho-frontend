<script lang='ts'>
    import { userStore, type UserData } from "$lib/stores/userStore";
    import { UserService } from "$lib/services/userService";
    import Dropdown from "./Dropdown.svelte";
    import { goto } from "$app/navigation";
    import { chatStore } from "$lib/stores/chatStore";
    import { messageStore } from "$lib/stores/messageStore";

    let userService: UserService = new UserService();

    function logout() {
        userStore.set({ username: "", accessToken: "", loggedIn: false });
        userService.loadTokenToCookie($userStore.accessToken);
        $chatStore.connection?.disconnect();
    }

    function deleteAccount() {
        if (!confirm("Do you really want to delete your account? All your images will be deleted with it.")) {
            return;
        }
        try {
            $chatStore.connection?.disconnect();
            userService.deleteAccount($userStore.accessToken);
            userService.loadTokenToCookie($userStore.accessToken);
        } catch (e) {
            alert("Error deleting user! " + e);
            goto('/');
        }
    }

    let open: boolean = $state(false);

</script>

{#snippet rows(className: string)}
    {#if $userStore.loggedIn}
        <p>{$userStore.username}</p>
        <a href="/user/login" id="logout" role="button" onclick={(e) => logout()}>Log out</a>
        <a href="/user/register" id="delete" role="button" onclick={(e) => deleteAccount()} style="color: brown">Deletar conta</a>
    {:else}
        <a href="/user/register" id="create-account">Criar conta</a>
        <a href="/user/login" id="login">Log in</a>
    {/if}
{/snippet}

{#snippet opener()}
    <span class="opener">
        Conta
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" stroke="currentColor" fill="currentColor" width="512" height="298" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" clip-rule="evenodd" viewBox="0 0 512 298.04">
            <path d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/>
        </svg>
    </span>
{/snippet}

<Dropdown
    {open}
    class="account-menu-dropdown"
    itemsSnippet={rows}
    openerSnippet={opener}
></Dropdown>

<style lang="scss">
    @use '/src/var.scss';

    :global(.account-menu-dropdown) {
        border: none;
        background: transparent;
        white-space: nowrap;
        width: auto;
        direction: rtl;
    
        :global(.opener) {
            display: flex;
            font-size: 1.5em;
            padding-right: .2em;
            gap: .5em;
            direction: ltr;
            @media (max-width: 768px) {
                font-size: 1.25em;
            }
            :global(svg) {
                width: 1.3em;
                height: 1.5em;
                padding: .2em;
            }
        }
        
        :global(.dropdown-content) {
            backdrop-filter: blur(5px);
            background-color: rgba(0, 0, 0, 0.2) !important;
            border-radius: 12px;
            border: 2px solid var.$content-border;
            text-align: center;
            direction: ltr;

            :global(a), :global(button) {
                cursor: pointer;
                padding: .5em .7em;
                border-radius: 6px;
                border: none;
                text-align: center;

                &:hover {
                    background-color: rgba(0, 0, 0, 0.4);
                }

                @media (max-width: 768px) {
                    text-decoration: underline;
                }
            }

            :global(> *:not(a, button)) {
                padding: .5em .7em;
                border-radius: 6px;
            }
            background-color: transparent;
        }    
    }

</style>