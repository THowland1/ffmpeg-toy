export function getFrames(keyframes: { time: number; value: number }[]) {
	let output = '';
	for (let i = 0; i < keyframes.length; i++) {
		const keyframe = keyframes[i];

		if (i === 0) {
			output += `if(lt(t,${keyframe.time}),NaN,`;
			continue;
		}
		const previousKeyframe = keyframes[i - 1];
		const m = (keyframe.value - previousKeyframe.value) / (keyframe.time - previousKeyframe.time);
		const signedc = keyframe.value - m * keyframe.time;
		const sign = signedc >= 0 ? '+' : '-';
		const c = Math.abs(signedc);
		output += `if(lte(t,${keyframe.time}),(${m}*t)${sign}${c},`;

		if (i === keyframes.length - 1) {
			output += `NaN`;
		}
	}
	for (let i = 0; i < keyframes.length; i++) {
		output += ')';
	}

	return output;
	return 'if(lt(t,1),NaN,if(lte(t,2),(3*t)-2,NaN))';
}
