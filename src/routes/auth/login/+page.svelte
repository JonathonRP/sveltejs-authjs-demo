<svelte:options runes={true} />
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { signIn } from '@auth/sveltekit/client';

    const { data } = $props<{ data: import('./$types').PageData }>();
    const { url: { searchParams } } = $derived(data);
</script>

<main class="flex flex-1 flex-col items-center justify-center overflow-hidden">
	<div class="w-[368px] pt-1 grid md:flex rounded-2xl bg-slate-200 overflow-hidden dark:bg-neutral-808 dark:text-neutral-309">
        <div class="flex h-full w-full justify-center items-center p-4">
            <form class="h-full w-full" method="post" use:enhance={async () => {

                return async ({result, update}) => {
                    switch (result.type) {
                        case 'success':
                            await update();
                            const redirectTo = searchParams.get('redirectTo');
                            await signIn('email', { email: result.data?.email, callbackUrl: redirectTo ? `/${redirectTo.slice(1)}` : undefined, redirect: !!redirectTo });
                            break;
                        case 'failure':
                            const [firstError] = Object.keys(result.data?.errors);
                            console.error(result.data?.errors[firstError][0]);
                            break;
                    }
                    await applyAction(result)
                }
            }}>
                <label class="px-1 font-bold" for="email">Email</label>
                <div class="flex items-center border-2 py-2 px-3 rounded-2xl mt-2 mb-4 border-neutral-309 dark:border-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input class="pl-2 outline-none border-none bg-transparent focus-visible:ring-0" type="email" name="email" id="email" placeholder="Email" />
                </div>
                <button type="submit" class="block h-16 w-full bg-orange-600 text-white py-2 my-4 rounded-xl mb-2 text-lg leading-6 font-semibold">Sign in with Email</button>
            </form>
        </div>
	</div>
</main>