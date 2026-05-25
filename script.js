document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.getElementById('songList');
    const searchInput = document.getElementById('searchInput');
    let allSongs = [];
    const CACHE_NAME = 'uta-archive-v1';

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

    // キャッシュから再生用URLを取得、なければダウンロードしてキャッシュへ
    async function getCachedUrl(fileId) {
        const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
            return URL.createObjectURL(await cachedResponse.blob());
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Download failed');
            await cache.put(url, response.clone());
            return URL.createObjectURL(await response.blob());
        } catch (e) {
            console.error('キャッシュ保存に失敗しました:', e);
            return url; // 失敗時は元のDrive URLを返す
        }
    }

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

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${title}</h2>
                    <p class="text-sm text-gray-600">${artist} ${version ? `(${version})` : ''}</p>
                </div>
                <div id="player-${fileId}">
                    <button id="btn-${fileId}" class="w-full bg-blue-500 text-white py-2 rounded-lg">再生準備（キャッシュ確認）</button>
                </div>
            `;
            songListContainer.appendChild(div);

            // 再生ボタンクリック時の処理
            document.getElementById(`btn-${fileId}`).addEventListener('click', async (e) => {
                e.target.innerText = '読み込み中...';
                const playUrl = await getCachedUrl(fileId);
                const playerContainer = document.getElementById(`player-${fileId}`);
                playerContainer.innerHTML = `
                    <audio controls autoplay class="w-full h-10 mt-2">
                        <source src="${playUrl}" type="audio/wav">
                        お使いのブラウザは再生に対応していません。
                    </audio>
                `;
            });
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
