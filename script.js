document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.getElementById('songList');
    const searchInput = document.getElementById('searchInput');
    let allSongs = [];

    // JSONデータの読み込み
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log("読み込んだデータ:", data); // データの中身をブラウザのコンソールで確認
            allSongs = data;
            renderSongs(allSongs);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            songListContainer.innerHTML = '<p class="text-center text-red-500">データの読み込みに失敗しました。</p>';
        });

    // リストのレンダリング関数
    function renderSongs(songs) {
        if (songs.length === 0) {
            songListContainer.innerHTML = '<p class="text-center text-gray-500">該当する曲が見つかりませんでした。</p>';
            return;
        }
        
        songListContainer.innerHTML = '';
        songs.forEach(song => {
            // ここでデータキーを柔軟に取得できるように修正（大文字・小文字対応）
            const title = song.title || song.Title || song.TITLE || '無題';
            const artist = song.artist || song.Artist || song.ARTIST || '不明';
            const version = song.version || song.Version || song.VERSION || '';
            const url = song.url || song.URL;

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${title}</h2>
                    <p class="text-sm text-gray-600">${artist} ${version ? `(${version})` : ''}</p>
                </div>
                <audio controls class="w-full h-10 mt-2">
                    <source src="${url}" type="audio/wav">
                    お使いのブラウザは再生に対応していません。
                </audio>
            `;
            songListContainer.appendChild(div);
        });
    }

    // 検索機能
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allSongs.filter(song => 
            (song.title && song.title.toLowerCase().includes(searchTerm)) || 
            (song.artist && song.artist.toLowerCase().includes(searchTerm))
        );
        renderSongs(filtered);
    });
});
