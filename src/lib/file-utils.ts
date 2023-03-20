export async function urlToMovFile(videoURL: string): Promise<File> {
	const response = await fetch(videoURL);
	const blob = await response.blob();
	const file = new File([blob], 'file.mov', { type: 'video/quicktime' });
	return file;
}
export async function urlToPngFile(imageURL: string): Promise<File> {
	const response = await fetch(imageURL);
	const blob = await response.blob();
	const file = new File([blob], 'file.png', { type: 'image/x-png' });
	return file;
}
