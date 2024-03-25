# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

from emoemo.entity.bounding_box import BoundingBox
from emoemo.entity.emoji import Emoji


class StandardGenerator:
    def __init__(self, emoji: Emoji):
        self.emoji = emoji

    def generate(self):
        image: Image = Image.new(
            mode="RGBA",
            size=(
                self.emoji.base_size,
                self.emoji.base_size,
            ),
            color=self.emoji.background_color,
        )
        image_draw: ImageDraw = ImageDraw.Draw(im=image)
        count: int = 1
        for text in self.emoji.text.splitlines():
            image_font: ImageFont
            image_font, _ = find_best_font_and_box(
                self.emoji.get_split_size(),
                text,
                self.emoji.font,
                self.emoji.base_size,
            )
            image_draw.text(
                xy=(
                    self.emoji.get_center(),
                    (self.emoji.get_split_size() / 2) * count,
                ),
                text=text,
                fill=self.emoji.font_color,
                font=image_font,
                anchor="mm",
            )
            count += 2
        image.save(fp=self.emoji.get_save_file_path())


class AutoFontSizeChangeGenerator:
    def __init__(self, emoji: Emoji):
        self.emoji = emoji

    def generate(self):
        resize: int = self.emoji.base_size
        # FIXME: 128 * 2 の意図が不明なのでコメントを付け加えたい
        self.emoji.base_size = 128 * 2
        bounding_bottoms: list = []
        for text in self.emoji.text.splitlines():
            bounding_box: tuple[int, int, int, int]
            _, bounding_box = find_best_font_and_box(
                self.emoji.get_split_size(),
                text,
                self.emoji.font,
                self.emoji.base_size,
            )
            bounding_bottoms.append(bounding_box[BoundingBox.BOTTOM.value])
        image: Image = Image.new(
            mode="RGBA",
            size=(self.emoji.base_size, sum(bounding_bottoms)),
            color=self.emoji.background_color,
        )
        image_draw: ImageDraw = ImageDraw.Draw(im=image)
        for i, text in enumerate(self.emoji.text.splitlines(), start=1):
            image_font: ImageFont
            image_font, _ = find_best_font_and_box(
                self.emoji.get_split_size(),
                text,
                self.emoji.font,
                self.emoji.base_size,
            )
            image_draw.text(
                xy=(self.emoji.get_center(), calc_y_axis(bounding_bottoms, i)),
                text=text,
                fill=self.emoji.font_color,
                font=image_font,
                anchor="mm",
            )
        image: Image = image.resize((resize, resize))
        image.save(fp=self.emoji.get_save_file_path())


def calc_y_axis(bounding_bottoms: list[int, ...], count: int) -> int:
    """Y軸の描画位置を取得する

    境界ボックスの位置を利用して各出力位置の中心を取得する

    以下計算結果のイメージ:
    count: 1 bounding_boxs[0] / 2
    count: 2 bounding_boxs[0] + (bounding_boxs[1] / 2)
    count: 3 bounding_boxs[0] + bounding_boxs[1] + (bounding_boxs[2] / 2)

    :param bounding_bottoms: 境界ボックスの下部分のリスト
    :param count: カウント
    :return: 描画位置
    """
    results: list[float, ...] = []
    for i in range(count):
        if i == count - 1:
            results.append(bounding_bottoms[i] / 2)
        else:
            results.append(bounding_bottoms[i])
    return int(sum(results))


def find_best_font_and_box(
    font_size: int, text: str, font: str, base_size: int
) -> tuple[ImageFont, tuple[int, int, int, int]]:
    image_font: ImageFont | None = None
    bounding_box: tuple[int, int, int, int] | None = None
    while (
        (bounding_box is None)
        or (bounding_box[BoundingBox.RIGHT.value] > base_size)
        or (bounding_box[BoundingBox.BOTTOM.value] > base_size)
        and (font_size > 0)
    ):
        image_font = ImageFont.truetype(font=font, size=font_size)
        bounding_box = image_font.getbbox(text=text)
        font_size -= 1
    return image_font, bounding_box
