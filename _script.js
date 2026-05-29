let allSongs = [];
let audioPlayer = null;

document.addEventListener('DOMContentLoaded', async () => {
    audioPlayer = new Audio();

    const listContainer = document.getElementById('songList');
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('データ取得失敗');
        
        allSongs = await response.json();
        
        listContainer.innerHTML = '';
        allSongs.forEach((song, index) => {
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50';
            div.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="font-bold text-gray-800">${song.title}</h2>
                        <p class="text-xs text-gray-500">${song.artist}</p>
                    </div>
                    ${song.is_retake ? '<span class="text-[10px] text-red-500 font-bold">RE-TAKE</span>' : ''}
                </div>
            `;
            div.onclick = () => showPlayer(index);
            listContainer.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        listContainer.innerHTML = '<p class="text-center text-red-500">読み込みエラー</p>';
    }

    // 再生状態の監視
    audioPlayer.onplay = () => updatePlayerUI();
    audioPlayer.onpause = () => updatePlayerUI();
    audioPlayer.ontimeupdate = () => updateProgress();
});

function showPlayer(index) {
    const song = allSongs[index];
    if (audioPlayer.src !== song.url) {
        audioPlayer.src = song.url;
    }

    const content = document.getElementById('playerContent');
    content.innerHTML = `
        <h2 class="text-2xl font-bold mb-1">${song.title}</h2>
        <p class="text-gray-500 mb-6">${song.artist}</p>
        <button onclick="togglePlay()" class="play-btn bg-blue-600 text-white w-20 h-20 rounded-full text-3xl shadow-xl mx-auto block mb-6">▶</button>
    `;

    document.getElementById('listScreen').classList.add('hidden');
    document.getElementById('playerScreen').classList.remove('hidden');
    updatePlayerUI();
}

function showList() {
    document.getElementById('playerScreen').classList.add('hidden');
    document.getElementById('listScreen').classList.remove('hidden');
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

function updateProgress() {
    const bar = document.getElementById('progressBar');
    if (bar && audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        bar.style.width = percent + '%';
    }
}

function updatePlayerUI() {
    const isPaused = audioPlayer.paused;
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => btn.innerHTML = isPaused ? '▶' : '⏸');
    
    const mini = document.getElementById('miniPlayer');
    if (audioPlayer.src) {
        mini.classList.remove('hidden');
        const currentSong = allSongs.find(s => s.url === audioPlayer.src);
        document.getElementById('miniTitle').innerText = currentSong?.title || '再生中';
    }
}
