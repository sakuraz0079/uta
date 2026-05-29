document.addEventListener('DOMContentLoaded', async () => {
    const songListContainer = document.getElementById('songList');

    try {
        // data.jsonを非同期で取得
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('データの読み込みに失敗しました');
        
        const songs = await response.json();

        // 読み込み中メッセージを削除
        songListContainer.innerHTML = '';

        // 楽曲リストの生成
        songs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            
            // 楽曲情報とオーディオプレイヤーのレンダリング
            div.innerHTML = `
                <div class="mb-3">
                    <h2 class="font-bold text-lg text-gray-800">${song.title}</h2>
                    <p class="text-sm text-gray-500">${song.artist}</p>
                    <span class="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">${song.category}</span>
                </div>
                <audio controls src="${song.url}" class="w-full h-10" preload="metadata"></audio>
            `;
            songListContainer.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        songListContainer.innerHTML = `<p class="text-center text-red-500">楽曲の読み込み中にエラーが発生しました。</p>`;
    }
});
