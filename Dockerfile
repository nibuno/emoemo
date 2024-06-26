# NOTE: 自走プログラマー82:Docker公式のPythonを使う
# https://jisou-programmer.beproud.jp/%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E6%A7%8B%E6%88%90/82-Docker%E5%85%AC%E5%BC%8F%E3%81%AEPython%E3%82%92%E4%BD%BF%E3%81%86.html
# syntax=docker/dockerfile:1
FROM python:3.12.2
ENV PYTHONUNBUFFERED=1
RUN mkdir /emoemo
WORKDIR /emoemo
COPY requirements/requirements.txt /emoemo/
COPY requirements/requirements-dev.txt /emoemo/
RUN pip install -r requirements.txt
RUN pip install -r requirements-dev.txt

# NOTE: tailwindcssを利用するためにnodeをインストール
# TODO: build出来なくなるケースがあったので、再発した場合は対応する
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

COPY ./entrypoint.sh /emoemo/entrypoint.sh
RUN sed -i 's/\r$//g' /emoemo/entrypoint.sh
RUN chmod +x /emoemo/entrypoint.sh

COPY . /emoemo/

ENTRYPOINT ["/emoemo/entrypoint.sh"]
