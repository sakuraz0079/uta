let allSongs = [];
let audioPlayer = null; // ページ全体で1つのオーディオインスタンスを保持

document.addEventListener('DOMContentLoaded', async () => {
    // ページロード時に固定オーディオインスタンスを作成
    audioPlayer = new Audio();
    audioPlayer.className = "w-full";
    audioPlayer.controls = true;

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

    // オーディオ状態変化時のイベント
    audioPlayer.onplay = () => updateMiniPlayer();
    audioPlayer.onpause = () => updateMiniPlayer();
});

function showPlayer(index) {
    const song = allSongs[index];
    const playerScreen = document.getElementById('playerScreen');
    const listScreen = document.getElementById('listScreen');
    const content = document.getElementById('playerContent');

    // 新しい曲であればURLをセット
    if (audioPlayer.src !== song.url) {
        audioPlayer.src = song.url;
    }

    content.innerHTML = `
        <h2 class="text-2xl font-bold mb-1">${song.title}</h2>
        <p class="text-gray-500 mb-6">${song.artist}</p>
    `;
    content.appendChild(audioPlayer); // プレイヤーを移動

    listScreen.classList.add('hidden');
    playerScreen.classList.remove('hidden');
}

function showList() {
    document.getElementById('playerScreen').classList.add('hidden');
    document.getElementById('listScreen').classList.remove('hidden');
    updateMiniPlayer();
}

function updateMiniPlayer() {
    const miniPlayer = document.getElementById('miniPlayer');
    const content = document.getElementById('miniPlayerContent');
    
    // 再生中かつ一時停止中でない場合のみ表示
    if (audioPlayer.src && !audioPlayer.paused) {
        const currentSong = allSongs.find(s => s.url === audioPlayer.src);
        miniPlayer.classList.remove('hidden');
        content.innerHTML = `<p class="text-sm font-bold truncate">再生中: ${currentSong ? currentSong.title : '楽曲'}</p>`;
    } else {
        miniPlayer.classList.add('hidden');
    }
}
