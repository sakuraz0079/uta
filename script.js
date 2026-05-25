import os
import json

# Google Driveの公開用ベースURL
DRIVE_BASE_URL = "https://drive.google.com/uc?export=open&id="

def generate_json_for_drive(directory_path, id_mapping):
    """
    directory_path: ファイルがある場所
    id_mapping: { "filename.wav": "FILE_ID_STRING" } の形式の辞書
    """
    songs = []
    files = [f for f in os.listdir(directory_path) if f.endswith('.wav')]
    
    for i, filename in enumerate(files):
        name_without_ext = os.path.splitext(filename)[0]
        parts = name_without_ext.split('_')
        
        artist = parts[0] if len(parts) > 0 else "不明"
        title = parts[1] if len(parts) > 1 else name_without_ext
        version = parts[2] if len(parts) > 2 else ""
        
        # マッピングからIDを取得（IDがない場合は空文字）
        file_id = id_mapping.get(filename, "MISSING_ID")
        song_url = f"{DRIVE_BASE_URL}{file_id}"
        
        songs.append({
            "id": i + 1,
            "artist": artist,
            "title": title,
            "version": version,
            "url": song_url,
            "category": "歌ってみた"
        })
    
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(songs, f, ensure_ascii=False, indent=4)
    print("Google Drive対応の data.json を生成しました。")
