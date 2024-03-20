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
    font_name: str = ""

    def __post_init__(self):
        font = f"fonts/rounded-mplus-20150529/{self.font_name}.ttf"
        project_root = Path(__file__).parent.parent
        self.font: str = str(project_root / font)
