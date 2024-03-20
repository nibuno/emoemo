from django.shortcuts import render

from .main import main


def index(request):
    font_text = request.GET.get("font-text")
    # TODO: auto_font_sizeをクエリパラメータで受け取る
    font_color = request.GET.get("font-color")
    font_name = request.GET.get("font-name")

    emoji_img = None

    main_args = {
        "input_text": font_text,
        "auto_font_size": True,
        "font_color": font_color,
        "font_name": font_name,
    }

    if font_color:
        main_args["font_color"] = font_color

    if font_name:
        main_args["font_name"] = font_name

    if font_text:
        main(**main_args)

        # font_textに改行文字が入っていたら_に変換して渡す
        # e.g. せやかて\n工藤 -> せやかて_工藤
        parsed_font_text = "_".join(font_text.splitlines())

        emoji_img = f"{parsed_font_text}.png"

    return render(
        request,
        "base.html",
        {
            "font_text": font_text,
            "emoji_img": emoji_img,
            "font_color": font_color,
            "font_name": font_name,
        },
    )
