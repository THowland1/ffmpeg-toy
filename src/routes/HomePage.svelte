<script lang="ts">
	import { createFFmpeg } from '@ffmpeg/ffmpeg';
	import { onMount } from 'svelte';
	import { convertToGif } from '../lib/ffmpeg-utils';
	import { urlToMovFile } from '../lib/file-utils';
	let ffmpeg = createFFmpeg({ log: true });

	let video: HTMLVideoElement | null = null;
	let file: File | null = null;
	let video2: File | null = null;
	let gif: string | null = null;

	onMount(() => {
		load();
	});

	$: {
		if (video && !file) {
			populateVideoWithDefaultFile();
		}
	}

	async function populateVideoWithDefaultFile() {
		if (video) {
			file = await urlToMovFile('/look-at-this-graph.mov');

			video.src = URL.createObjectURL(file);
			video = video;
			console.log('ksdfciwsdiufh');
		}
	}

	async function load() {
		await ffmpeg.load();
		ffmpeg = ffmpeg;
	}
</script>

<p class="text-xl">{ffmpeg.isLoaded() ? 'READY' : 'NOT READY'}</p>

<video bind:this={video} controls width="450"> <track kind="captions" /></video>

<input
	type="file"
	on:change={(e) => {
		if (video) {
			video.srcObject = e.currentTarget?.files?.item(0) ?? null;
		} else {
			console.error('video is not defined');
		}
	}}
/>

<button
	on:click={async () => {
		if (file) {
			const ddd = await convertToGif(ffmpeg, file);
			gif = ddd;
		} else {
			console.error('video is not defined');
		}
	}}
	class="bg-blue-500">Click me</button
>

{#if gif}
	<img src={gif} width="250" alt="" />
{/if}
