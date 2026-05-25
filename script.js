document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const songListContainer = document.getElementById('songList');

    // ファイル選択イベントのリスナー
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            renderSongs(files);
        }
    });

    /**
     * 選択されたファイルを解析・表示する関数
     * @param {FileList} files 
     */
    function renderSongs(files) {
        songListContainer.innerHTML = ''; // リストを一度クリア
        
        let foundWav = false;
        Array.from(files).forEach((file) => {
            // .wavファイルのみを対象に処理
            if (!file.name.toLowerCase().endsWith('.wav')) return;
            foundWav = true;

            // ローカルファイル再生用のURL生成
            const objectUrl = URL.createObjectURL(file);
            
            // ファイル名解析: "アーティスト_曲名.wav" の形式を想定
            const name = file.name.replace(/\.wav$/i, '');
            const parts = name.split('_');
            const artist = parts.length > 1 ? parts[0] : "不明";
            const title = parts.length > 1 ? parts[1] : name;

            // リスト項目の生成
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

        // 該当ファイルがない場合の通知
        if (!foundWav) {
            songListContainer.innerHTML = '<p class="text-center text-red-500">選択したファイルの中に.wavが見つかりませんでした。</p>';
        }
    }
});
