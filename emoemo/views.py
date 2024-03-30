from django.shortcuts import render

from emoemo.emoji import Emoji
from emoemo.generator import (
    AutoFontSizeChangeGenerator,
    StandardGenerator,
)


def index(request):
    font_text = request.GET.get("font-text")
    # TODO: auto_font_sizeをクエリパラメータで受け取る
    font_color = request.GET.get("font-color")
    font_name = request.GET.get("font-name")

    emoji_img = None

    auto_font_size = True

    if font_text:
        # FIXME: 背景色を変更できるようにする
        emoji = Emoji(text=font_text, font_color=font_color, font_name=font_name)
        if auto_font_size:
            generator = AutoFontSizeChangeGenerator(emoji)
        else:
            generator = StandardGenerator(emoji)
        generator.generate()

        # font_textに改行文字が入っていたら_に変換して渡す
        # e.g. せやかて\n工藤 -> せやかて_工藤
        parsed_font_text = "_".join(font_text.splitlines())

        emoji_img = f"{parsed_font_text}.png"

    return render(
        request,
        "index.html",
        {
            "font_text": font_text,
            "emoji_img": emoji_img,
            "font_color": font_color,
            "font_name": font_name,
        },
    )
