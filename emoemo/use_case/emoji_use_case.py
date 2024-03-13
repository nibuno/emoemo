# -*- coding: utf-8 -*-
from typing import Tuple

from entity.emoji import Emoji


class EmojiUseCase:
    def __init__(self, emoji: Emoji):
        self.emoji = emoji

    def get_save_file_path(self) -> str:
        file_stem: str = "_".join(self.emoji.text.splitlines())
        file_name: str = file_stem + self.emoji.file_extension
        # TODO: saveディレクトリが存在する前提のコードになっている
        save_file_path: str = "save/" + file_name
        return save_file_path

    def get_background_color(self) -> Tuple[int, int, int, int]:
        return self.emoji.background_color

    def get_font(self) -> str:
        return self.emoji.font

    def get_text(self) -> str:
        return self.emoji.text

    def get_font_color(self) -> str:
        return self.emoji.font_color

    def get_base_size(self) -> int:
        return self.emoji.base_size

    def get_split_size(self) -> int:
        return int(self.emoji.base_size / len(self.emoji.text.splitlines()))

    def get_center(self) -> float:
        return self.emoji.base_size / 2

    def set_base_size(self, size: int):
        self.emoji.base_size = size
