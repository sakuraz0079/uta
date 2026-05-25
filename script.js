document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const songListContainer = document.getElementById('songList');

    // ファイル選択時のイベント
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        renderSongs(files);
    });

    function renderSongs(files) {
        songListContainer.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            // 一時的な再生URLを作成
            const objectUrl = URL.createObjectURL(file);
            
            // ファイル名からアーティスト名と曲名を推測
            const name = file.name.replace('.wav', '').replace('.mp3', '');
            const parts = name.split('_');
            const artist = parts[0] || "不明";
            const title = parts[1] || name;

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2';
            div.innerHTML = `
                <div class="mb-2">
                    <h2 class="font-bold text-lg">${title}</h2>
                    <p class="text-sm text-gray-500">${artist}</p>
                </div>
                <audio controls src="${objectUrl}" class="w-full h-10"></audio>
            `;
            songListContainer.appendChild(div);
        });
    }
});
