# 関係ないと思ったバージョンの違いで失敗していた
# TODO: ブログを書いたら削除する
FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

RUN addgroup --system app && adduser --system --ingroup app app

RUN chown -R app:app /var/cache/nginx && \
    mkdir -p /var/run/nginx && \
    touch /var/run/nginx.pid && \
    chown -R app:app /var/run/nginx && \
    chown -R app:app /var/run/nginx.pid
