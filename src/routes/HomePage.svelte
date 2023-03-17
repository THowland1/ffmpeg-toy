<script lang="ts">
	import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
	import { onMount } from 'svelte';
	const ffmpeg = createFFmpeg({ log: true });

	let ready = false;
	let video: File | null = null;
	let gif: string | null = null;

	onMount(() => {
		ready = true;
		load();
	});

	const load = async () => {
		await ffmpeg.load();
		ready = true;
	};

	const convertToGif = async () => {
		// Write the file to memory
		ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

		// Run the FFMpeg command
		await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

		// Read the result
		const data = ffmpeg.FS('readFile', 'out.gif');

		// Create a URL
		const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
		gif = url;
	};
</script>

<p class="text-xl">{ready ? 'READY' : 'NOT READY'}</p>

{#if video}
	<video controls width="250" src={URL.createObjectURL(video)}> <track kind="captions" /></video>
{/if}

<input type="file" on:change={(e) => (video = e.currentTarget?.files?.item(0) ?? null)} />

<button on:click={convertToGif} class="bg-blue-500">Click me</button>

{#if gif}
	<img src={gif} width="250" alt="" />
{/if}
