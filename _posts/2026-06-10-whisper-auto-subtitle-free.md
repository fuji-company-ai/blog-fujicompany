---
layout: post
title: "Whisperで動画字幕を自動生成する方法【無料】"
date: 2026-06-10 11:00:00 +0900
categories:
  - tech
tags:
  - Whisper
  - 字幕
  - 動画編集
  - 無料
  - 自動化
description: "OpenAIのWhisperを使って動画・音声ファイルから字幕を無料で自動生成する方法を初心者向けに徹底解説。Pythonなしでも使える方法も紹介。"
amazon_associate_tag: "fujicompany-22"
---

YouTube動画やセミナー録画に字幕を付けたいけど、手動で入力するのは大変すぎる——そんな悩みを解決するのが、OpenAIの**Whisper**です。

Whisperは高精度な音声認識AIで、**日本語を含む99言語に対応**し、しかも**完全無料**で使えます。この記事では、Whisperで動画・音声ファイルから字幕（SRT/VTTファイル）を自動生成する方法を、初心者にも分かりやすく解説します。

## WhisperとはOpenAIが公開した無料の音声認識AI

### Whisperの特徴と精度

Whisperは2022年にOpenAIが公開したオープンソースの音声認識モデルです。以下の特徴があります。

**対応言語**：99言語（日本語・英語・中国語・韓国語など）

**精度**：
- 英語：業界トップクラス（単語誤り率約3%）
- 日本語：非常に高精度（方言・専門用語もある程度対応）

**モデルサイズ**：
| モデル | サイズ | 速度 | 精度 |
|--------|--------|------|------|
| tiny   | 39MB   | 最速 | 低   |
| base   | 74MB   | 速い | 中   |
| small  | 244MB  | 普通 | 高   |
| medium | 769MB  | 遅い | 高   |
| large  | 1.5GB  | 最遅 | 最高 |

日本語の字幕生成には**smallまたはmediumモデル**がバランス良くておすすめです。

### Whisperが選ばれる理由

市販の字幕生成ソフトは月額数千円〜数万円かかるものが多い中、Whisperは**完全無料**で商用利用も可能なMITライセンスで公開されています。品質はプロ向け有料サービスと遜色なく、YouTuber・動画クリエイター・ビジネスマンに広く使われています。

## インストール方法：3通りのアプローチ

### 方法1：Whisper Web（ブラウザで完結・最も簡単）

**Hugging Faceの「whisper-web」** を使えば、ブラウザだけでWhisperを動かせます。インストール不要で今すぐ試せます。

1. [Whisper Web](https://huggingface.co/spaces/sanchit-gandhi/whisper-web)にアクセス
2. 音声ファイルをアップロード（またはURLを入力）
3. 言語を「Japanese」に設定
4. 「Transcribe」ボタンをクリック
5. テキスト・字幕ファイルをダウンロード

**メリット**：インストール不要、誰でも使える  
**デメリット**：処理が遅い、ファイルサイズ制限あり

### 方法2：Pythonでローカルインストール（推奨）

ローカル環境にインストールすることで、より高速・高品質な処理が可能になります。

**前提条件**：Python 3.8以上がインストール済み

```bash
# Whisperをインストール
pip install openai-whisper

# ffmpegもインストール（動画ファイル処理に必要）
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows (Chocolateyを使用)
choco install ffmpeg
```

**基本的な使い方：**

```bash
# 日本語動画から字幕を生成（SRT形式）
whisper video.mp4 --language Japanese --output_format srt

# 高精度モードで生成
whisper video.mp4 --model large --language Japanese --output_format srt

# VTT形式（Webサイト向け）
whisper audio.wav --language Japanese --output_format vtt
```

### 方法3：faster-whisper（最速・GPU不要）

**faster-whisper**はWhisperを最適化した高速版です。通常のWhisperと比べて4倍以上高速で、GPUなしでも快適に動作します。

```bash
pip install faster-whisper

# Pythonスクリプトから使う場合
python3 << 'EOF'
from faster_whisper import WhisperModel

model = WhisperModel("medium", device="cpu", compute_type="int8")

segments, info = model.transcribe("video.mp4", language="ja", beam_size=5)

# SRTファイルに出力
with open("output.srt", "w", encoding="utf-8") as f:
    for i, segment in enumerate(segments, 1):
        start = format_time(segment.start)
        end = format_time(segment.end)
        f.write(f"{i}\n{start} --> {end}\n{segment.text.strip()}\n\n")

def format_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

print("字幕ファイルを生成しました: output.srt")
EOF
```

## 生成した字幕ファイルを動画に埋め込む方法

### YouTube・動画プラットフォームへのアップロード

生成した.srtまたは.vttファイルは、そのままYouTubeにアップロードできます。

**YouTubeの場合：**
1. YouTube Studioにログイン
2. 字幕を追加したい動画を選択
3. 「字幕」→「字幕を追加」
4. 「ファイルをアップロード」でSRTファイルを選択

### FFmpegで動画に焼き込む（ハードサブ）

字幕をファイルに直接埋め込みたい場合（プレゼン資料や映像作品向け）：

```bash
# 字幕を動画に焼き込む
ffmpeg -i input.mp4 -vf "subtitles=output.srt:force_style='FontName=Hiragino Sans,FontSize=24,PrimaryColour=&Hffffff'" output_with_subtitle.mp4
```

### 動画編集ソフトでの活用

**DaVinci Resolve**（無料）や**CapCut**（無料）ではSRTファイルをインポートして字幕を自動配置できます。手作業での入力が不要になり、編集時間を大幅に短縮できます。

## 字幕品質を上げるための実践テクニック

### 音声品質の改善

Whisperの精度は入力音声の品質に大きく左右されます。

**録音時のコツ：**
- マイクを口元から15〜20cmの距離に
- 静かな環境で録音（背景雑音を減らす）
- 音量レベルを-12dBFS程度に調整

**音声前処理（オプション）：**
```bash
# ffmpegでノイズリダクションと音量正規化
ffmpeg -i input.mp4 -af "highpass=f=200,lowpass=f=3000,dynaudnorm" cleaned.mp4
```

### プロンプト機能で専門用語に対応

Whisperには「初期プロンプト」機能があり、専門用語をあらかじめ指定できます。

```bash
# 専門用語を含む初期プロンプトを指定
whisper lecture.mp4 --language Japanese \
  --initial_prompt "この動画はPythonプログラミング、機械学習、AIについての講義です。Claude、ChatGPT、Whisperなどのキーワードが頻出します。"
```

### AIで字幕を整形する

生成された字幕をClaudeやChatGPTに渡して、句読点の修正・改行調整・不自然な表現の修正を自動化できます。

**プロンプト例：**
```
以下の自動生成字幕テキストを校正してください。
- 句読点を適切に追加
- 明らかな誤認識を修正（文脈から判断）
- 読みやすい文体に整える
- 1行の文字数は25文字以内に調整

[字幕テキストを貼り付け]
```

## Whisperで副業収入を得る方法

Whisperのスキルを習得すると、以下の副業・ビジネスに活かせます。

**動画字幕制作サービス**：YouTubeやセミナー動画の字幕作成は、動画制作会社・個人YouTuberから需要が高く、1本数千円〜数万円の報酬が期待できます。

**文字起こし・議事録サービス**：会議・インタビュー・セミナーの音声を文字起こしするサービスは、クラウドワークスやランサーズで多数の案件があります。

**多言語字幕対応**：英語動画を日本語に翻訳した字幕を作成する仕事も好評です。WhisperでまずSRTを生成し、Claude/DeepLで翻訳する半自動化フローで高効率に作業できます。

音声認識・字幕制作の効率をさらに上げたい方には、以下の書籍が参考になります。

[Python自動化 実践ガイド 音声・動画処理編](https://www.amazon.co.jp/dp/B0DBBBBB/?tag=fujicompany-22)

PythonでWhisperを活用した自動化ツール作成から、FFmpegによる動画処理まで実践的に学べます。プログラミング初心者でも分かりやすい解説が好評です。

## まとめ：Whisperで動画制作の時間を半分にしよう

WhisperはOpenAIが公開した無料の音声認識AIで、日本語字幕の自動生成に非常に効果的です。

**この記事のポイント：**

1. **Whisperは無料・高精度**：99言語対応でMITライセンスにより商用利用もOK
2. **3つの使い方**：ブラウザ版（最簡単）、ローカルインストール（推奨）、faster-whisper（最速）
3. **字幕ファイルはYouTubeや動画編集ソフトに直接インポート可能**
4. **AIとの組み合わせ**でさらに品質向上・完全自動化が実現
5. **副業にも活用可能**：字幕制作・文字起こしサービスは需要大

まずは**Whisper Web**でブラウザから試してみて、気に入ったら**ローカルインストール**で本格活用するのがおすすめです。

動画コンテンツに字幕を付けることで、SEO効果・アクセシビリティ・視聴者エンゲージメントが大幅に向上します。今すぐWhisperを使ってみてください！
