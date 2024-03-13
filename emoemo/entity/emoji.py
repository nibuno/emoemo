# -*- coding: utf-8 -*-
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple


@dataclass
class Emoji:
    text: str
    file_extension: str = ".png"
    background_color: Tuple[int, int, int, int] = (0, 0, 0, 0)
    font_color: str = "#000000"
    base_size: int = 128

    def __post_init__(self):
        font = "fonts/rounded-mplus-20150529/rounded-mplus-1c-black.ttf"
        # TODO: フォントのパスを相対パスにする必要がありそう
        #       Dockerに移行した際に失敗していた
        project_root = Path(__file__).parent.parent
        self.font: str = str(project_root / font)


if __name__ == "__main__":
    emoji = Emoji("test")
