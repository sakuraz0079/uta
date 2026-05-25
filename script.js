document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const songListContainer = document.getElementById('songList');

    // ページロード時に以前のファイル名リストがあれば通知する
    const savedList = JSON.parse(localStorage.getItem('savedSongList') || '[]');
    if (savedList.length > 0) {
        songListContainer.innerHTML = `
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <p>前回のリスト: ${savedList.length}曲</p>
                <p class="mt-1">※ブラウザの仕様により、リロード後はもう一度「楽曲ファイルを選択」からファイルを選択し直してください。</p>
            </div>
        `;
    }

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
