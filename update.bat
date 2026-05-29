@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo [1/4] 楽曲リスト(data.json)を生成中...
python generate_json.py
if not exist data.json (
    echo [ERROR] data.json が見つかりません。generate_json.py を確認してください。
    pause
    exit /b 1
)

echo [2/4] リモートリポジトリと同期中...
git pull origin main
if %errorlevel% neq 0 (
    echo [ERROR] pullに失敗しました。
    pause
    exit /b %errorlevel%
)

echo [3/4] 変更をコミット中...
git add data.json
git commit -m "楽曲リスト自動更新: %date% %time%"
if %errorlevel% neq 0 (
    echo [INFO] コミットする変更がないか、すでに最新です。
)

echo [4/4] GitHubへアップロード中...
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] pushに失敗しました。
    pause
    exit /b %errorlevel%
)

echo.
echo [SUCCESS] 全ての処理が完了しました！
timeout /t 3