from emoemo.entity.emoji import Emoji
from emoemo.infrastructure.generator import (
    StandardGeneratorImpl,
    find_best_font_and_box,
    calc_y_axis,
)
from emoemo.use_case.emoji_use_case import EmojiUseCase
import pytest


class TestStandardGeneratorImpl:
    def test_find_best_font_and_box(self):
        emoji = Emoji("弓")
        emoji_use_case = EmojiUseCase(emoji)
        generator = StandardGeneratorImpl(emoji_use_case)
        generator.emoji_use_case.set_base_size(100)
        assert find_best_font_and_box(
            generator.emoji_use_case.get_split_size(),
            generator.emoji_use_case.get_text(),
            generator.emoji_use_case.get_font(),
            generator.emoji_use_case.get_base_size(),
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
