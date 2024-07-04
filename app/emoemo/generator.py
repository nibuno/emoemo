# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

from app.emoemo.bounding_box import BoundingBox
from app.emoemo.emoji import Emoji


class StandardGenerator:
    def __init__(self, emoji: Emoji):
        self.emoji = emoji

    def generate(self):
        """emojiのテキストを画像に生成、保存する"""
        image: Image = Image.new(
            mode=self.emoji.color_mode,
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
            image_font, _ = adjust_font_size_for_bounding_box(
                font_size=self.emoji.get_split_size(),
                text=text,
                font=self.emoji.font,
                base_size=self.emoji.base_size,
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
        """emojiのテキストを画像に生成、保存する"""
        change_before_base_size: int = self.emoji.base_size
        # そのままのサイズで作成すると、生成された画像が粗くなるため
        # 暫定的に2倍のサイズで描画して、リサイズすることでフォントサイズを変更する
        # (2倍である必要性は無い)
        self.emoji.base_size = self.emoji.base_size * 2
        # bounding_boxのbottom部分はy軸の下部分の位置を表す
        # そのため、各bounding_boxのbottom部分をリストに格納して、
        # その合計値を取得することで、画像の高さを取得する
        bounding_bottoms: list = []
        for text in self.emoji.text.splitlines():
            bounding_box: tuple[int, int, int, int]
            _, bounding_box = adjust_font_size_for_bounding_box(
                font_size=self.emoji.get_split_size(),
                text=text,
                font=self.emoji.font,
                base_size=self.emoji.base_size,
            )
            bounding_bottoms.append(bounding_box[BoundingBox.BOTTOM.value])
        image: Image = Image.new(
            mode=self.emoji.color_mode,
            size=(self.emoji.base_size, sum(bounding_bottoms)),
            color=self.emoji.background_color,
        )
        image_draw: ImageDraw = ImageDraw.Draw(im=image)
        for i, text in enumerate(self.emoji.text.splitlines(), start=1):
            image_font: ImageFont
            image_font, _ = adjust_font_size_for_bounding_box(
                font_size=self.emoji.get_split_size(),
                text=text,
                font=self.emoji.font,
                base_size=self.emoji.base_size,
            )
            image_draw.text(
                xy=(self.emoji.get_center(), calc_y_axis(bounding_bottoms, i)),
                text=text,
                fill=self.emoji.font_color,
                font=image_font,
                anchor="mm",
            )
        image: Image = image.resize(
            size=(change_before_base_size, change_before_base_size)
        )
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


def adjust_font_size_for_bounding_box(
    font_size: int, text: str, font: str, base_size: int
) -> tuple[ImageFont, tuple[int, int, int, int]]:
    """最適なフォントと境界ボックスを取得する

    テキストを描画するための最適なフォントと境界ボックスを取得する
    テキストのサイズが基準サイズを超える場合は、フォントサイズを減らして再計算する

    :param font_size: フォントサイズ
    :param text: 描画するテキスト
    :param font: 使用するフォント名（パス）
    :param base_size: 基準となるテキストが収まるべきサイズ
    :return:
    image_font: 調整されたフォントオブジェクト
        NOTE: https://pillow.readthedocs.io/en/stable/reference/ImageFont.html#PIL.ImageFont.truetype
    bounding_box: テキストのbounding box
        NOTE: https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.getbbox
    """
    image_font: ImageFont | None = None
    bounding_box: tuple[int, int, int, int] | None = None
    while (
        (bounding_box is None)
        or (bounding_box[BoundingBox.RIGHT.value] > base_size)
        or (bounding_box[BoundingBox.BOTTOM.value] > base_size)
    ) and (font_size > 0):
        image_font = ImageFont.truetype(font=font, size=font_size)
        bounding_box = image_font.getbbox(text=text)
        font_size -= 1
    return image_font, bounding_box
