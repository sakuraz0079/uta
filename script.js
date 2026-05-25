document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const songListContainer = document.getElementById('songList');

    // ページ読み込み時に保存されたリストを表示する試み
    // 注意: URL.createObjectURLはリロードで期限切れになるため、
    // 実際に再生するには再選択が必要になりますが、リストの表示までは保持可能です。
    
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            renderSongs(files);
            saveFileList(files);
        }
    });

    function saveFileList(files) {
        const fileNames = Array.from(files).map(f => f.name);
        localStorage.setItem('savedSongList', JSON.stringify(fileNames));
    }

    function renderSongs(files) {
        songListContainer.innerHTML = '';
        
        let foundWav = false;
        Array.from(files).forEach((file) => {
            if (!file.name.toLowerCase().endsWith('.wav')) return;
            foundWav = true;

            const objectUrl = URL.createObjectURL(file);
            const name = file.name.replace(/\.wav$/i, '');
            const parts = name.split('_');
            const artist = parts.length > 1 ? parts[0] : "不明";
            const title = parts.length > 1 ? parts[1] : name;

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${title}</h2>
                    <p class="text-sm text-gray-500">${artist}</p>
                </div>
                <audio controls src="${objectUrl}" class="w-full h-10" preload="metadata"></audio>
            `;
            songListContainer.appendChild(div);
        });

        if (!foundWav) {
            songListContainer.innerHTML = '<p class="text-center text-red-500">選択したファイルの中に.wavが見つかりませんでした。</p>';
        }
    }
});
