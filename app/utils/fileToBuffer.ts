export async function fileToBuffer(file: File) {
	// convert the file to a buffer

	const arrayBuffer = await file.arrayBuffer();
	// convert the file to a buffer
	      
	const buffer = new Uint8Array(arrayBuffer);
          
	return buffer;
}
