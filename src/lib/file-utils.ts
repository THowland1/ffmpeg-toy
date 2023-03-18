export async function urlToMovFile(videoURL: string): Promise<File> {
	const response = await fetch(videoURL);
	const blob = await response.blob();
	const file = new File([blob], 'file.mov', { type: 'video/quicktime' });
	return file;
}
