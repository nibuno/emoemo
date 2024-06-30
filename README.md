emojiを作成するアプリケーションです。

コンテナのビルドと起動をすることで、一旦動くようになりました。
ここは備忘録、メモ帳として暫くは利用されます。

## .envファイルについて

.envファイルにはsettings.pyで利用する環境変数を記述しています。
3つの環境・設定別のファイルがあります。
ファイル名に`-exampleを`つけたファイルがサンプルファイルです。
コピー後に`-exmaple`を削除して利用してください。

* `.env` : 開発環境用
* `.env.prod` : 本番環境用
* `.env.prod.db` : 本番環境用のDB設定用

## 作成例

```shell
# USE_DJANGO_BROWSER_RELOADを使わない設定
touch .env
echo "USE_DJANGO_BROWSER_RELOAD=0" >> .env
```

## コンテナのビルド

```shell
docker compose build
```

## コンテナの起動

```shell
docker compose up
```

## prod用のコンテナのビルド

```shell
docker compose -f compose.prod.yaml build
```

## prod用のコンテナの起動

```shell
docker compose -f compose.prod.yaml up
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

## ruffの実行（format）

```shell
docker compose run web ruff format .
```

## djlintの実行(format)

```shell
docker compose run web djlint . --reformat
```

## pytestの実行

```shell
docker compose run web pytest
```

## tailwindcssのコンパイル

```shell
docker compose run web python manage.py tailwind start
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
# NOTE: この前段階でnodejsのインストールが必要だったので実施した
docker compose run web python manage.py tailwind install
docker compose run web python manage.py tailwind start
```

## 静的ファイルを集める

```shell
docker compose run web python manage.py collectstatic --noinput
```

`--noinput`オプションをつけることで、入力をスキップして実行できる。

## prod用の実行

開発・本番環境での切り替えは以下のように行う必要がある。

```shell
docker compose down -v
docker compose -f compose.prod.yaml up -d --build
docker compose -f compose.prod.yaml exec web python manage.py migrate --noinput
docker compose -f compose.prod.yaml exec web python manage.py collectstatic --no-input --clear

```
## 備忘録

`docker compose -f compose.prod.yaml exec web django-admin migrate --noinput`を実行すると、

`django.core.exceptions.ImproperlyConfigured: Requested setting USE_I18N, but settings are not configured. You must either define the environment variable DJANGO_SETTINGS_MODULE or call settings.configure() before accessing settings. `になってしまう
