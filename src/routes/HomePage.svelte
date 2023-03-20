<script lang="ts">
	import { createFFmpeg } from '@ffmpeg/ffmpeg';
	import { onMount } from 'svelte';
	import { convertToGif, drawGrid, drawText, overlayImage } from '../lib/ffmpeg-utils';
	import { urlToMovFile, urlToPngFile } from '../lib/file-utils';
	let ffmpeg = createFFmpeg({
		log: true,
		// logger: (o) => {
		// 	console.log(o);
		// }
		progress: (e) => {
			console.log(e.ratio);
		}
	});

	let video: HTMLVideoElement | null = null;
	let file: File | null = null;
	let imagefile: File | null = null;
	let video2: File | null = null;
	let gif: string | null = null;

	onMount(() => {
		load();
		setImageFile();
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
		}
	}
	async function setImageFile() {
		imagefile = await urlToPngFile('/g5.png');
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
		if (file && imagefile) {
			const ddd = await drawText(ffmpeg, file);
			gif = ddd;
		} else {
			console.error('video is not defined');
		}
	}}
	class="bg-blue-500 hover:bg-blue-700 rounded py-2 px-4">Click me</button
>

<button
	on:click={async () => {
		if (file && imagefile) {
			const ddd = await overlayImage(ffmpeg, file, imagefile);
			gif = ddd;
		} else {
			console.error('video is not defined');
		}
	}}
	class="bg-blue-500 hover:bg-blue-700 rounded py-2 px-4">Overlay image</button
>

{#if gif}
	<img src={gif} width="450" alt="" />

	<video controls width="450" src={gif}> <track kind="captions" /></video>
{/if}
