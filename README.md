emojiを作成するアプリケーションです。

まだ作成中のため、何もできません。
ここは備忘録、メモ帳として暫くは利用されます。

.envファイルにはsettings.pyで利用する環境変数を記述しています。


## コンテナのビルド

```shell
docker compose build
```

## コンテナの起動

```shell
docker compose up
```

## コンテナへの入り方

web
```shell
docker compose exec web /bin/bash
```

db
```shell
docker compose exec db /bin/bash
```

## 最初に作成した時のコマンド群

コンテナのビルド後に以下コマンドを実行

```shell
$ docker compose run web django-admin startproject application .
```