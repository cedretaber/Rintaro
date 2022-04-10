# Rintaro

翻訳 Mod 作成支援ツール

## 使い方

1. 翻訳対象のベース Mod を選択する
例えば Windows で Stellaris を遊んでいるなら、 `path\to\SteamLibrary\steamapps\workshop\content\281990\` に Mod があります。
Mod の番号は Steam Workshop などで確認してください。

2. （必要なら）既存の翻訳 Mod を追加する
既に翻訳 Mod がある場合、その翻訳を取り込むことができます。
バージョンが合わない場合でも、存在するキーだけを取り出して適用し、キーが存在しない文字列には何もしません。

3. 編集タブに移動して、元の文章を見ながら文章を翻訳する
頑張りましょう。
アイコンなどに置換される特殊な文字列に気をつけてください。

4. 中断する場合は、「ファイル」タブに戻って JSON 形式で保存可能
この JSON 形式のファイルは Rintaro 独自の形式です。ゲームが読み込むことはできませんが、編集途中の状態を保存することができます。

5. 翻訳が終わったら、「確認」タブでどのように出力されるかを確認する
元のテキストファイルに近い見た目で概観できます。

6. 問題なければ「ファイル」タブの書き出しボタンで yml ファイルとして書き出す
指定したディレクトリに `localisation` という名前で書き出されます。 `localisation_synced` ディレクトリもあるかもしれませんが、どちらも使います。

7. 自分の Mod ファイルの中にそのままコピーすれば、そのままゲームに読み込ませて利用可能
もしまだ自分用の Mod を作っていなければ、ゲームのランチャーを使って翻訳用 Mod を作成してください。
その Mod のディレクトリの中に、 Rintaro が書き出したディレクトリをコピーします。

## 開発

```bash
# build
$ npm run build

# run in dev mode
$ npm start

# test
$ npm run test
$ npm run electron:test

# pack for windows
$ electron:build:portable
```