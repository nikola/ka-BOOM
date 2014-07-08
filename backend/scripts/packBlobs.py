# coding: utf-8
"""
"""
__author__ = 'Nikola Klaric (nikola@generic.company)'
__copyright__ = 'Copyright (c) 2013-2014 Nikola Klaric'

import os.path
import re
import bz2


RESOURCES_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'frontend')
BLOBS_PATH = os.path.join(RESOURCES_PATH, 'app', 'blob')


RESOURCES_SCRIPT = [
    # 'vendor/lodash/lodash.min.js',
    # 'vendor/bacon/bacon.min.js',
    'vendor/cortex/cortex.min.js',
    'vendor/jquery/jquery.min.js',
    # 'vendor/jquery/jquery.swipe-events.js',

    'vendor/jquery/jquery.waitforimages.min.js',
    'vendor/misc/color-thief.min.js',
    'vendor/misc/keypress.min.js',

    'vendor/velocity/velocity.min.js',
    'vendor/velocity/velocity.ui.js',

    'app/js/lib/sockets.js',
    'app/js/lib/colors.js',
    'app/js/lib/l10n.js',
    'app/js/lib/receiver.js',
    'app/js/lib/hotkeys.js',
    'app/js/lib/lang.js',
    'app/js/lib/config.js',
    'app/js/lib/grid.js',
    'app/js/lib/detail.js',
    'app/js/app.js',
]

RESOURCES_STYLE = [
    'app/css/fonts.css',
    'app/css/icons.css',

    'app/css/app.css',

    'app/css/buttons.css',
    'app/css/config.css',
    'app/css/grid.css',
    'app/css/detail.css',
]


if __name__ == '__main__':
    pathname = os.path.join(RESOURCES_PATH, 'app', 'html', 'gui.html')
    with open(pathname, 'rb') as fp:
        html = fp.read()
    html = re.sub(r'>\s*<', '><', html)

    stylesheetsAmalgamated = '\n'.join([open(os.path.join(RESOURCES_PATH, pathname)).read() for pathname in RESOURCES_STYLE])

    scriptContent = []
    for pathname in RESOURCES_SCRIPT:
        with open(os.path.join(RESOURCES_PATH, pathname), 'rU') as fp:
            content = fp.read()
        # TODO: remove comments
        scriptContent.append(content)
    scriptsAmalgamated = '\n'.join(scriptContent)

    html = html.replace('</head>', '<script>%s</script><style>%s</style></head>' % (scriptsAmalgamated, stylesheetsAmalgamated))
    # html = html.encode('utf-8')

    compressed = bz2.compress(html)

    with open(os.path.join(BLOBS_PATH, 'gui'), 'wb') as fp:
        fp.write(compressed)
