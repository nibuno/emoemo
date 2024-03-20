# -*- coding: utf-8 -*-
from emoemo.entity.emoji import Emoji
from emoemo.infrastructure.generator import (
    AutoFontSizeChangeGeneratorImpl,
    StandardGeneratorImpl,
)
from emoemo.use_case.emoji_use_case import EmojiUseCase


def main(
    input_text: str,
    auto_font_size: bool,
    font_color: str = "#000000",
    font_name: str = "rounded-mplus-1c-medium",
):
    # FIXME: 背景色、フォントの色を変更できるようにする
    emoji = Emoji(text=input_text, font_color=font_color, font_name=font_name)
    emoji_use_case = EmojiUseCase(emoji)
    if auto_font_size:
        generator = AutoFontSizeChangeGeneratorImpl(emoji_use_case)
    else:
        generator = StandardGeneratorImpl(emoji_use_case)
    generator.generate()


if __name__ == "__main__":
    main("せやかて\n工藤", True)
