v = document.querySelectorAll("video");

for (let el of v) {
	el.volume == 0 ? (el.volume = 0.3) : (el.volume = 0);
	console.log("new volume: ", el.volume);
}
