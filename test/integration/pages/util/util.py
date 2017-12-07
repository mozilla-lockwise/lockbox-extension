"""Tool for creating class names."""
import hashlib
import os
from functools import reduce

table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

class_names = [{
    # Button Styles
    'webextension/widgets/button.css': [
        'button',
        'minimal',
        'ghost-theme',
        'primary-theme',
        'puffy-size',
    ],
    # Item Summary Styles
    'webextension/list/components/item-summary.css': [
        'item-summary',
        'title',
        'subtitle',
    ],
    # Item Field
    'webextension/list/components/item-fields.css': [
        'first-label',
    ],
    # Intro
    'webextension/firstrun/components/intro.css': [
        'intro',
    ],
    # Inputs
    'webextension/widgets/input.css': [
        'field-text',
    ],
    'webextension/widgets/panel.css': [
        'panel-body',
        'panel-footer',
    ],
    # Homepage Styles
    'webextension/list/manage/components/homepage.css': [
        'homepage'
    ],
}]


def munged_class_name(name):
    """Create a munged class name."""
    for item in class_names:
        for path, value in item.items():
            if name in value:
                h = hashlib.md5((path + '+' + name).encode('utf-8')).digest()
                i = reduce(lambda x, y: x * 256 + y, reversed(h), 0)
                s = ''
                while i > 0:
                    s = table[i % 64] + s
                    i //= 64
                return (
                    os.path.splitext(os.path.basename(path))[0] + '__' +
                    name + '___' +
                    s[:5]
                )
