document.addEventListener('DOMContentLoaded', async () => {
    const songListContainer = document.getElementById('songList');

    try {
        // data.jsonをGitHub PagesやR2から読み込む
        const response = await fetch('data.json');
        const songs = await response.json();

        songListContainer.innerHTML = '';
        songs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${song.title}</h2>
                    <p class="text-sm text-gray-500">${song.artist}</p>
                </div>
                <audio controls src="${song.url}" class="w-full h-10" preload="metadata"></audio>
            `;
            songListContainer.appendChild(div);
        });
    } catch (error) {
        songListContainer.innerHTML = '<p class="text-center text-red-500">楽曲データの読み込みに失敗しました。</p>';
    }
});
