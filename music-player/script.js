const songs = [
    { title: "Song 1", artist: "Artist 1", src: "music/song1.mp3" },
    { title: "Song 2", artist: "Artist 2", src: "music/song2.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "music/song3.mp3" }
];

let currentSong = 0;
let isPlaying = false;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.querySelector(".progress-container");

function loadSong(index) {
    const song = songs[index];
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
}

function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸️";
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶️";
}

// Toggle play/pause
playBtn.addEventListener("click", () => {
    isPlaying ? pauseSong() : playSong();
});

// Previous song
prevBtn.addEventListener("click", () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
});

// Next song
nextBtn.addEventListener("click", () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
});

// Seek on progress bar click
progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

// Auto next when song ends
audio.addEventListener("ended", () => {
    nextBtn.click();
});

loadSong(currentSong);
