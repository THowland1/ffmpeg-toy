import { fetchFile, type FFmpeg } from '@ffmpeg/ffmpeg';
import { getFrames } from './math-utils';

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

export async function overlayImage(
	ffmpeg: FFmpeg,
	video: string | Blob | File,
	image: string | Blob | File
): Promise<string> {
	// Write the file to memory
	ffmpeg.FS('writeFile', 'test.mov', await fetchFile(video));
	ffmpeg.FS('writeFile', 'test.png', await fetchFile(image));
	// 15 8

	// .15 NaN NaN
	// .16 8.3 13.8
	// ???
	// .22 5.7 13.6
	// 1.16 2.9 14.4

	function tscaled(value: number) {
		const s = Math.floor(value);
		const frames = 100 * (value - s);
		const FPS = 24;
		return s + frames / FPS;
	}
	function xscaled(value: number) {
		return 100 * (value - 5);
	}
	function yscaled(value: number) {
		return 100 * value;
	}

	const keyframes = [
		{
			t: 0.15,
			x: 13.8,
			y: 8.5
		},
		{
			t: 0.16,
			x: 13.8,
			y: 8.3
		},
		{
			t: 0.18,
			x: 13.7,
			y: 7.2
		},
		{
			t: 0.2,
			x: 13.6,
			y: 6.3
		},
		{
			t: 0.21,
			x: 13.6,
			y: 5.9
		},
		{
			t: 0.22,
			x: 13.2,
			y: 5.7
		},
		{
			t: 1,
			x: 13.7,
			y: 5.4
		},
		{
			t: 1.05,
			x: 13.9,
			y: 4.9
		},
		{
			t: 1.12,
			x: 14.2,
			y: 3.3
		},
		{
			t: 1.15,
			x: 14.4,
			y: 2.8
		},
		{
			t: 1.18,
			x: 14.3,
			y: 3.1
		},
		{
			t: 1.22,
			x: 14.0,
			y: 3.3
		},
		{
			t: 2,
			x: 13.9,
			y: 3.5
		},
		{
			t: 2.03,
			x: 13.9,
			y: 3.5
		},
		{
			t: 2.03,
			x: 13.0,
			y: 2.3
		},
		{
			t: 3,
			x: 12.3,
			y: 2.4
		},
		{
			t: 3.1,
			x: 12.1,
			y: 2.6
		},
		{
			t: 3.17,
			x: 12.1,
			y: 2.8
		},
		{
			t: 4,
			x: 12.3,
			y: 2.9
		},
		{
			t: 4.22,
			x: 12.1,
			y: 3.1
		},
		{
			t: 5,
			x: 12.1,
			y: 3
		},
		{
			t: 5.06,
			x: 12.1,
			y: 3
		},
		{
			t: 5.12,
			x: 12,
			y: 3
		},
		{
			t: 6.015,
			x: 12,
			y: 3
		}
	];

	const x = getFrames(keyframes.map((o) => ({ time: tscaled(o.t), value: xscaled(o.x) })));
	const y = getFrames(keyframes.map((o) => ({ time: tscaled(o.t), value: yscaled(o.y) })));

	// y = mx+c
	// f(t) = m*t + c

	// Run the FFMpeg command
	await ffmpeg.run(
		'-i',
		'test.mov',
		'-i',
		'test.png',
		// '-vf',
		// `drawtext=fontfile=/System/Library/Fonts/Supplemental/AmericanTypewriter.ttc:text='%{localtime}':fontcolor=white@0.8:x=7:y=7`,
		// '-crf',
		// '48',
		// '-b',
		// '400k',
		// '-ss',
		// '0.0',
		'-filter_complex',
		// `[1:v]rotate=(30*t)*PI/180 [rotate];[1:v][rotate]overlay=x='15+(t*200)':y=25:enable='between(t,0,8)'`,
		[
			`[1:v]scale=400*1.35:252*1.35,rotate=a=-0.246:ow=((cos(0.246)*iw)+(sin(0.246)*ih)):oh=((sin(0.246)*iw)+(cos(0.246)*ih)):c=none[wm]`,
			[
				`[0:v][wm]overlay='${x}':'${y}'`
				// 'drawgrid=width=100:height=100:thickness=2:color=black',
				// 'drawgrid=width=10:height=10:thickness=1:color=blue@0.5'
			].join(',')
		].join(';'),
		// 180ms
		// 1150ms
		// '-filter:v',
		// 'fps=fps=30',
		// '-f',
		// 'gif',
		'out.mov'
	);

	/* ffmpeg 
    -i
    input.mp4
    -i
    watermark.png
    -filter_complex
    "[1:v]rotate=angle=45*PI/180,format=argb,geq='r=if(lt(alpha,128),255,max(1,(255*(256-red))/alpha)):g=if(lt(alpha,128),255,max(1,(255*(256-green))/alpha)):b=if(lt(alpha,128),255,max(1,(255*(256-blue))/alpha)):a=1.0'[wm];[0:v][wm]overlay=10:10" output.mp4
*/

	// Read the result
	const data = ffmpeg.FS('readFile', 'out.mov');

	// Create a URL
	const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
	return url;
}

export async function drawGrid(ffmpeg: FFmpeg, video: string | Blob | File): Promise<string> {
	// Write the file to memory
	ffmpeg.FS('writeFile', 'test.mov', await fetchFile(video));

	// Run the FFMpeg command
	await ffmpeg.run(
		'-i',
		'test.mov',
		'-vf',
		'drawgrid=width=100:height=100:thickness=2:color=red@0.5',
		'out.mov'
	);

	// Read the result
	const data = ffmpeg.FS('readFile', 'out.mov');

	// Create a URL
	const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/quicktime' }));
	return url;
}
export async function drawText(ffmpeg: FFmpeg, video: string | Blob | File): Promise<string> {
	// Write the file to memory
	ffmpeg.FS('writeFile', 'test.mov', await fetchFile(video));
	ffmpeg.FS(
		'writeFile',
		'ibmplexmono.ttf',
		await fetchFile('https://fonts.gstatic.com/s/ibmplexmono/v15/-F63fjptAgt5VM-kVkqdyU8n5ig.ttf')
	);

	console.log(ffmpeg.FS('readdir', '/'));
	// Run the FFMpeg command
	await ffmpeg.run(
		'-i',
		'test.mov',
		'-vf',
		`settb=AVTB,setpts='trunc(PTS/1K)*1K+st(1,trunc(RTCTIME/1K))-1K*trunc(ld(1)/1K)',drawtext=fontsize=100:fontfile=ibmplexmono.ttf:text='timestamp \\: %{pts\\:gmtime\\:0\\:%H\\\\\\:%M\\\\\\:%S}.%{eif\\:1M*t-1K*trunc(t*1K)\\:d}':x=(w-text_w)/2:y=(h-text_h)/2,drawgrid=width=100:height=100:thickness=2:color=black,drawgrid=width=10:height=10:thickness=1:color=blue@0.5`,
		'out.mov'
	);

	// Read the result
	const data = ffmpeg.FS('readFile', 'out.mov');

	// Create a URL
	const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/quicktime' }));
	return url;
}
