from emoemo.entity.emoji import Emoji
from emoemo.use_case.emoji_use_case import EmojiUseCase


class TestMakeSlackEmoji:
    def test_get_save_file_path(self):
        emoji = Emoji("test")
        emoji_use_case = EmojiUseCase(emoji)
        assert emoji_use_case.get_save_file_path() == "save/test.png"

    def test_get_split_size(self):
        emoji = Emoji("test")
        emoji_use_case = EmojiUseCase(emoji)
        assert emoji_use_case.get_split_size() == 128

    def test_get_center(self):
        emoji = Emoji("test")
        emoji_use_case = EmojiUseCase(emoji)
        assert emoji_use_case.get_split_size() == 128
