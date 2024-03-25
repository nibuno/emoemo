from emoemo.entity.emoji import Emoji


class TestMakeSlackEmoji:
    def test_get_save_file_path(self):
        emoji = Emoji("test")
        assert emoji.get_save_file_path() == "/emoemo/emoemo/static/test.png"

    def test_get_split_size(self):
        emoji = Emoji("test")
        assert emoji.get_split_size() == 128

    def test_get_center(self):
        emoji = Emoji("test")
        assert emoji.get_split_size() == 128
