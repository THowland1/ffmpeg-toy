import { fetchFile, type FFmpeg } from '@ffmpeg/ffmpeg';

export async function convertToGif(ffmpeg: FFmpeg, video: string | Blob | File): Promise<string> {
	// Write the file to memory
	ffmpeg.FS('writeFile', 'test.mov', await fetchFile(video));
	// Run the FFMpeg command
	await ffmpeg.run('-i', 'test.mov', '-t', '8', '-ss', '0.0', '-f', 'gif', 'out.gif');

	// Read the result
	const data = ffmpeg.FS('readFile', 'out.gif');

	// Create a URL
	const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
	return url;
}
