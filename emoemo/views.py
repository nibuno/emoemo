from django.shortcuts import render

from .main import main


def index(request):
    font_text = request.GET.get("font-text")
    # TODO: auto_font_sizeをクエリパラメータで受け取る
    font_color = request.GET.get("font-color")

    parsed_font_text_png = None

    main_args = {
        "input_text": font_text,
        "auto_font_size": True,
        "font_color": font_color,
    }

    if font_color:
        main_args["font_color"] = font_color

    if font_text:
        main(**main_args)

        # font_textに改行文字が入っていたら_に変換して渡す
        # e.g. せやかて\n工藤 -> せやかて_工藤
        parsed_font_text = "_".join(font_text.splitlines())

        parsed_font_text_png = f"{parsed_font_text}.png"

    return render(
        request,
        "base.html",
        {
            "font_text": font_text,
            "parsed_font_text_png": parsed_font_text_png,
            "font_color": font_color,
        },
    )
