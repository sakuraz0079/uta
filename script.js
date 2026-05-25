document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.getElementById('songList');
    const searchInput = document.getElementById('searchInput');
    let allSongs = [];

    // JSONデータの読み込み
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allSongs = data;
            renderSongs(allSongs);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            songListContainer.innerHTML = '<p class="text-center text-red-500">データの読み込みに失敗しました。</p>';
        });

    function renderSongs(songs) {
        if (songs.length === 0) {
            songListContainer.innerHTML = '<p class="text-center text-gray-500">該当する曲が見つかりませんでした。</p>';
            return;
        }
        
        songListContainer.innerHTML = '';
        songs.forEach(song => {
            const filename = song["ファイル名"] || "";
            const fileId = song["ファイルID"] || "";
            
            const parts = filename.split('_');
            const artist = parts[0] || "不明";
            const title = parts[1] || filename;
            const version = parts.slice(2).join('_').replace('.wav', '') || "";

            // Google Driveの直接ダウンロードリンク
            const url = `https://drive.google.com/uc?id=${fileId}&export=download`;

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${title}</h2>
                    <p class="text-sm text-gray-600">${artist} ${version ? `(${version})` : ''}</p>
                </div>
                <!-- crossOrigin属性を追加し、リソース取得の許可を試みます -->
                <audio controls crossorigin="anonymous" class="w-full h-10 mt-2">
                    <source src="${url}" type="audio/wav">
                    お使いのブラウザは再生に対応していません。
                </audio>
            `;
            songListContainer.appendChild(div);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allSongs.filter(song => 
            (song["ファイル名"] && song["ファイル名"].toLowerCase().includes(searchTerm))
        );
        renderSongs(filtered);
    });
});
