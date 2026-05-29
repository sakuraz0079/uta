import json
import os
import datetime

# ★WAVの読み込み元フォルダ
WAV_SOURCE_DIR = r"C:\Users\sakur\OneDrive\別のフォルダ名"

# ★R2の公開用ベースURL（末尾に / を忘れずに）
BASE_URL = "https://pub-your-id.r2.dev/" 

def generate_json():
    songs = []
    
    if not os.path.exists(WAV_SOURCE_DIR):
        print(f"エラー: 指定されたフォルダが見つかりません: {WAV_SOURCE_DIR}")
        return

    for filename in os.listdir(WAV_SOURCE_DIR):
        if filename.endswith(".wav"):
            full_path = os.path.join(WAV_SOURCE_DIR, filename)
            name_part = os.path.splitext(filename)[0]
            parts = name_part.split('_')
            
            artist = parts[0] if len(parts) > 0 else "不明"
            title = parts[1] if len(parts) > 1 else name_part
            
            # 「Re」が含まれているか判定
            is_re_take = "Re" in name_part
            
            # ファイルの最終更新日（歌唱日）を取得
            timestamp = os.path.getmtime(full_path)
            last_updated = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
            
            songs.append({
                "id": str(len(songs) + 1),
                "title": title,
                "artist": artist,
                "category": "歌い直し" if is_re_take else "Mastering",
                "last_updated": last_updated,
                "url": BASE_URL + filename 
            })

    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(songs, f, ensure_ascii=False, indent=4)
    print(f"{WAV_SOURCE_DIR} からリストを生成し、data.json を保存しました。")

if __name__ == "__main__":
    generate_json()