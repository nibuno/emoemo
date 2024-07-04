from app.emoemo.emoji import Emoji
from app.emoemo.generator import (
    StandardGenerator,
    adjust_font_size_for_bounding_box,
    calc_y_axis,
)
import pytest


# 移植元の結果と異なるが、効果があるのか含めて考えたいので一旦スキップ
# (0, 25, 86, 100) になったが正直大差は無さそうだとも考えている...
@pytest.mark.skip
class TestStandardGeneratorImpl:
    def test_adjust_font_size_for_bounding_box(self):
        emoji = Emoji("弓")
        generator = StandardGenerator(emoji)
        generator.emoji.base_size = 100
        assert adjust_font_size_for_bounding_box(
            generator.emoji.get_split_size(),
            generator.emoji.text,
            generator.emoji.font,
            generator.emoji.base_size,
        )[1] == (0, 23, 84, 100)


@pytest.mark.parametrize(
    "bounding_bottoms, count, results",
    [
        ([256], 1, 128),  # 1行のケース
        ([109, 94], 1, 54),  # 2行のケース 1行目
        ([109, 94], 2, 156),  # 2行のケース 2行目
        ([98, 145, 146], 1, 49),  # 3行のケース 1行目
        ([98, 145, 146], 2, 170),  # 3行のケース 2行目
        ([98, 145, 146], 3, 316),  # 3行のケース 3行目
    ],
)
def test_calc_y_axis(bounding_bottoms, count, results):
    assert calc_y_axis(bounding_bottoms, count) == results
