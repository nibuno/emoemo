# -*- coding: utf-8 -*-
from emoemo.entity.emoji import Emoji
from emoemo.infrastructure.generator import (
    AutoFontSizeChangeGenerator,
    StandardGenerator,
)


def main(
    input_text: str,
    auto_font_size: bool,
    font_color: str = "#000000",
    font_name: str = "rounded-mplus-1c-medium",
):
    # FIXME: 背景色を変更できるようにする
    emoji = Emoji(text=input_text, font_color=font_color, font_name=font_name)
    if auto_font_size:
        generator = AutoFontSizeChangeGenerator(emoji)
    else:
        generator = StandardGenerator(emoji)
    generator.generate()


if __name__ == "__main__":
    main("せやかて\n工藤", True)
