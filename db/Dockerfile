FROM postgres:16.3

# 必要なロケールを生成
RUN localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8

ENV LANG ja_JP.utf8

# 非rootユーザーで動かすためにpostgresユーザーを利用
# FIXME: 他のユーザーを作成した方が良さそうなら修正する
USER postgres
