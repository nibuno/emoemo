# -*- coding: utf-8 -*-
from enum import Enum


class BoundingBox(Enum):
    """ImageFontのbounding boxを表す

    NOTE: pillowのImageFontのページ
        https://pillow.readthedocs.io/en/stable/reference/ImageFont.html
    """

    LEFT: int = 0
    TOP: int = 1
    RIGHT: int = 2
    BOTTOM: int = 3
