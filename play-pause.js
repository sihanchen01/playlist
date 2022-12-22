v = document.querySelectorAll("video");

if (v != null) {
	for (let i = 0; i < v.length; i++) {
		v[i].paused
			? (v[i].play(),
			  v[i].requestPictureInPicture().catch((err) => {
					console.log(err);
			  }))
			: v[i].pause();
	}
} else {
	//TODO: No video elements on audible tab (Spotify, 网易云, etc.)
}
