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
docker compose run web django-admin startproject application .
```

```shell
docker compose run web django-admin startapp emoemo
```

```shell
docker compose run web python manage.py tailwind init
# NOTE: この前段階でnodejsのインストールが必要だったので実施
docker compose run web python manage.py tailwind install
docker compose run web python manage.py tailwind start
```

## ruffの実行（format）

```shell
docker compose run web ruff format .
```


## djlintの実行(format)

```shell
docker compose run web djlint . --reformat
```