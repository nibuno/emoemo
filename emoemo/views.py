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
    background_color = request.GET.get("background-color")

    auto_font_size = True

    if not font_text:
        return render(
            request,
            "index.html",
            {
                "font_text": font_text,
                "emoji_img": None,
                "font_color": font_color,
                "font_name": font_name,
                "background_color": background_color,
            },
        )

    emoji = Emoji(
        text=font_text,
        font_color=font_color,
        font_name=font_name,
        background_color=background_color,
    )
    if auto_font_size:
        generator = AutoFontSizeChangeGenerator(emoji)
    else:
        generator = StandardGenerator(emoji)
    generator.generate()

    # font_textに改行文字が入っていたら_に変換して渡す
    # e.g. せやかて\n工藤 -> せやかて_工藤
    newline_to_underscore_text = "_".join(font_text.splitlines())

    return render(
        request,
        "index.html",
        {
            "font_text": font_text,
            "emoji_img": f"{newline_to_underscore_text}.png",
            "font_color": font_color,
            "font_name": font_name,
            "background_color": background_color,
        },
    )
