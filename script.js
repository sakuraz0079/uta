document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.getElementById('songList');
    const searchInput = document.getElementById('searchInput');
    let allSongs = [];

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
        songListContainer.innerHTML = '';
        songs.forEach(song => {
            const filename = song["ファイル名"] || "";
            const fileId = song["ファイルID"] || "";
            
            // Google Drive のプレビュー用 URL 形式に変更 (UC ではなく VIEW に変更)
            const url = `https://drive.google.com/file/d/${fileId}/view`;

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${filename}</h2>
                </div>
                <!-- 属性を極限までシンプルに -->
                <audio controls src="${url}" class="w-full h-10 mt-2"></audio>
            `;
            songListContainer.appendChild(div);
        });
    }
    // (以下検索処理は略)
});
