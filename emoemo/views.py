from django.shortcuts import render

from .main import main


def index(request):
    font_text = request.GET.get("font-text")

    parsed_font_text = None
    parsed_font_text_png = None

    if font_text:
        main(font_text, auto_font_size=True)

        # font_textに改行文字が入っていたら_に変換して渡す
        # e.g. せやかて\n工藤 -> せやかて_工藤
        parsed_font_text = "_".join(font_text.splitlines())

        parsed_font_text_png = parsed_font_text + ".png"

    return render(
        request,
        "base.html",
        {
            "font_text": font_text,
            "parsed_font_text": parsed_font_text,
            "parsed_font_text_png": parsed_font_text_png,
        },
    )
