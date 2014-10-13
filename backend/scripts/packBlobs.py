# coding: utf-8
"""
"""
__author__ = 'Nikola Klaric (nikola@klaric.org)'
__copyright__ = 'Copyright (c) 2013-2014 Nikola Klaric'

import os.path
import re
from hashlib import md5 as MD5

from settings import BASE_DIR
from utils.fs import writeProcessedStream

FILTERS_DIR = os.path.join(BASE_DIR, 'backend', 'shaders')


RESOURCES_CONFIG_CSS = [
    'frontend/app/css/fonts.css',
    'frontend/app/css/icons.css',

    'frontend/app/css/app.css',

    'frontend/app/css/buttons.css',
    'frontend/app/css/configure.css',

    'frontend/app/css/ha.css',
]

RESOURCES_CONFIG_JS = [
    'frontend/app/js/thirdparty/jquery.min.js',

    'frontend/app/js/thirdparty/keypress.min.js',

    'frontend/app/js/thirdparty/velocity.min.js',
    'frontend/app/js/thirdparty/velocity.ui.min.js',

    'frontend/app/js/lib/l10n.js',
    'frontend/app/js/lib/hotkeys.js',
    'frontend/app/js/lib/lang.js',
    'frontend/app/js/lib/sockets.js',

    'frontend/app/js/configure.js',
]

RESOURCES_GUI_CSS = [
    'frontend/app/css/fonts.css',
    'frontend/app/css/icons.css',

    'frontend/app/css/app.css',

    'frontend/app/css/buttons.css',
    'frontend/app/css/grid.css',
    'frontend/app/css/detail.css',

    'frontend/app/css/ha.css',
]

RESOURCES_GUI_JS = [
    'frontend/app/js/thirdparty/jquery.min.js',

    'frontend/app/js/thirdparty/protovis.js',
    'frontend/app/js/thirdparty/mmcq.js',
    'frontend/app/js/thirdparty/keypress.min.js',

    'frontend/app/js/thirdparty/velocity.min.js',
    'frontend/app/js/thirdparty/velocity.ui.min.js',

    'frontend/app/js/lib/sockets.js',
    'frontend/app/js/lib/colors.js',
    'frontend/app/js/lib/l10n.js',
    'frontend/app/js/lib/db.js',
    'frontend/app/js/lib/hotkeys.js',
    'frontend/app/js/lib/lang.js',
    'frontend/app/js/lib/menu.js',
    'frontend/app/js/lib/grid.js',
    'frontend/app/js/lib/detail.js',
    'frontend/app/js/lib/transitions.js',
    'frontend/app/js/lib/youtube.js',
    'frontend/app/js/lib/credits.js',

    'frontend/app/js/gui.js',
]

RESOURCES_FONT = [
    'frontend/fonts/regular.ttf',
    'frontend/fonts/bold.ttf',
    'frontend/fonts/italic.ttf',
    'frontend/fonts/icons.ttf',
]


def _readStrip(filename, delimiters='{}', keepComments=False):
    with open(filename, 'rU') as fp:
        content = fp.read()

    # Remove whitespace between tags.
    content = re.sub(r'>\s*<', '><', content)

    # Remove comments.
    if not keepComments:
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.MULTILINE|re.DOTALL)

    # Remove leading whitespace.
    content = re.sub(r'(?<=\n) +', '', content)

    # Remove trailing whitespace.
    content = re.sub(r' +(?=\n)', '', content)

    # Remove newlines.
    content = re.sub(r'\r\n', '\n', content)
    content = re.sub(r'\n+', '\n', content)
    content = re.sub(r'(?<=[' + delimiters + '])\n', '', content)

    return content


def run():
    # Compress bootloader.
    pathname = os.path.join(BASE_DIR, 'frontend', 'app', 'html', 'load.html')
    html = _readStrip(pathname, '{};')
    writeProcessedStream('b1932b8b02de45bc9ec66ebf1c75bb15', html)

    # Compress configurator.
    pathname = os.path.join(BASE_DIR, 'frontend', 'app', 'html', 'configure.html')
    with open(pathname, 'rb') as fp:
        html = fp.read()
    html = re.sub(r'>\s*<', '><', html)

    stylesheetContent = []
    for pathname in RESOURCES_CONFIG_CSS:
        content = _readStrip(os.path.join(BASE_DIR, pathname), '{};,')
        stylesheetContent.append(content)
    stylesheetsAmalgamated = ''.join(stylesheetContent)

    scriptContent = []
    for pathname in RESOURCES_CONFIG_JS:
        content = _readStrip(os.path.join(BASE_DIR, pathname), '{},')
        scriptContent.append(content)
    scriptsAmalgamated = ''.join(scriptContent)

    html = html.replace('</head>', '<script>%s</script><style>%s</style></head>' % (scriptsAmalgamated, stylesheetsAmalgamated))

    writeProcessedStream('e7edf96693d14aa8a011da221782f4a6', html)

    # Compress GUI.
    pathname = os.path.join(BASE_DIR, 'frontend', 'app', 'html', 'gui.html')
    with open(pathname, 'rb') as fp:
        html = fp.read()
    html = re.sub(r'>\s*<', '><', html)

    stylesheetContent = []
    for pathname in RESOURCES_GUI_CSS:
        content = _readStrip(os.path.join(BASE_DIR, pathname), '{};,')
        stylesheetContent.append(content)
    stylesheetsAmalgamated = ''.join(stylesheetContent)

    scriptContent = []
    for pathname in RESOURCES_GUI_JS:
        if pathname.endswith('/credits.js'):
            content = _readStrip(os.path.join(BASE_DIR, pathname), '{},', keepComments=True)
        else:
            content = _readStrip(os.path.join(BASE_DIR, pathname), '{},')
        scriptContent.append(content)
    scriptsAmalgamated = ''.join(scriptContent)

    html = html.replace('</head>', '<script>%s</script><style>%s</style></head>' % (scriptsAmalgamated, stylesheetsAmalgamated))

    writeProcessedStream('c9d25707d3a84c4d80fdb6b0789bdcf6', html)

    # Compress fonts.
    for pathname in RESOURCES_FONT:
        with open(os.path.join(BASE_DIR, pathname), 'rb') as fp:
            ttf = fp.read()

        identifier = os.path.basename(pathname).replace('.ttf', '')
        md5 = MD5()
        md5.update(identifier)
        filename = md5.hexdigest()

        writeProcessedStream(filename, ttf)

    # Compress MPC-HC configuration.
    from settings.player import MPCHC_INI
    writeProcessedStream('4ebc0ca1e8324ba6a134ca78b1ca3088', MPCHC_INI)

    # Compress MPC-HC manifest patch.
    from settings.player import MT_PATCH
    writeProcessedStream('d2062963ddf644299341f12439990aa8', MT_PATCH)
    
    # Compress default configuration.
    with open(os.path.join(BASE_DIR, 'config', 'default.json'), 'rU') as fp:
        content = fp.read()
    writeProcessedStream('781354b1bf474046888a703d21148e65', content)

    # Compress loading spinner.
    with open(os.path.join(BASE_DIR, 'frontend', 'app', 'img', 'loader.gif'), 'rb') as fp:
        content = fp.read()
    writeProcessedStream('1e57809d2a5d461793d14bddb773a77a', content)

if __name__ == '__main__':
    run()
