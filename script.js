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
            
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${filename}</h2>
                </div>
                <!-- Google公式プレイヤーの埋め込みコード -->
                <iframe src="https://drive.google.com/file/d/${fileId}/preview" width="100%" height="60" frameborder="0"></iframe>
            `;
            songListContainer.appendChild(div);
        });
    }
    // (以下検索処理は略)
});
