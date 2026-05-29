let allSongs = [];

document.addEventListener('DOMContentLoaded', async () => {
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
});

function showPlayer(index) {
    const song = allSongs[index];
    const playerScreen = document.getElementById('playerScreen');
    const listScreen = document.getElementById('listScreen');
    const content = document.getElementById('playerContent');

    content.innerHTML = `
        <h2 class="text-2xl font-bold mb-1">${song.title}</h2>
        <p class="text-gray-500 mb-6">${song.artist}</p>
        <audio controls autoplay src="${song.url}" class="w-full"></audio>
    `;

    listScreen.classList.add('hidden');
    playerScreen.classList.remove('hidden');
}

function showList() {
    document.getElementById('playerScreen').classList.add('hidden');
    document.getElementById('listScreen').classList.remove('hidden');
}
