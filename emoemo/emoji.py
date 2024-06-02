# -*- coding: utf-8 -*-
from dataclasses import dataclass
from pathlib import Path
from django.conf import settings


@dataclass
class Emoji:
    """絵文字画像生成用のテキスト、フォント、サイズ、色を管理するクラス"""

    text: str
    file_extension: str = ".png"
    # NOTE: RGBAや他の形式でも指定できるので、対応できるようにしても良さそう
    color_mode: str = "RGB"
    background_color: str = "#ffffff"
    font_color: str = "#000000"
    base_size: int = 128
    font_name: str = "rounded-mplus-1c-medium"

    def __post_init__(self):
        font = f"fonts/rounded-mplus-20150529/{self.font_name}.ttf"
        app_dir = Path(__file__).parent
        self.font: str = str(app_dir / font)

    def get_save_file_path(self) -> str:
        file_stem: str = "_".join(self.text.splitlines())
        file_name: str = file_stem + self.file_extension
        save_file_path: str = settings.MEDIA_ROOT + file_name
        return save_file_path

    def get_split_size(self) -> int:
        return int(self.base_size / len(self.text.splitlines()))

    def get_center(self) -> float:
        return self.base_size / 2
