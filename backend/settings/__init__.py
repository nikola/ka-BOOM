# coding: utf-8
"""
fan - A movie compilation and playback app for Windows. Fast. Lean. No weather widget.
Copyright (C) 2013-2015 Nikola Klaric.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
"""
__author__ = 'Nikola Klaric (nikola@klaric.org)'
__copyright__ = 'Copyright (C) 2013-2015 Nikola Klaric'

import sys
import os
import ctypes
from contextlib import closing

DEBUG = False
SERVER_PORT = 59741
BASE_DIR = os.path.dirname(sys.executable) if getattr(sys, 'frozen', None) else os.path.normpath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..'))
ASSETS_PATH = sys._MEIPASS if getattr(sys, 'frozen', None) else BASE_DIR
STATIC_PATH = os.path.join(ASSETS_PATH, 'frontend')
if getattr(sys, 'frozen', None):
    EXE_PATH = sys.executable
else:
    EXE_PATH = os.path.join(BASE_DIR, 'dummy.exe')
    if not os.path.exists(EXE_PATH):
        closing(open(EXE_PATH, 'w+'))

CLIENT_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.80 Safari/537.36'

def _getAppStoragePathname():
    """
        CSIDL_APPDATA: 26 (Roaming)
        CSIDL_LOCAL_APPDATA: 28 (Local)
        CSIDL_COMMON_APPDATA: 35 (ProgramData)
    """
    bufferUnicode = ctypes.create_unicode_buffer(1024)
    bufferCanonical = ctypes.create_unicode_buffer(1024)
    ctypes.windll.shell32.SHGetFolderPathW(None, 28, None, 0, bufferUnicode)
    if ctypes.windll.kernel32.GetShortPathNameW(bufferUnicode.value, bufferCanonical, 1024):
        bufferUnicode = bufferCanonical

    pathname = os.path.join(os.path.normpath(bufferUnicode.value), 'fan')

    return pathname

APP_STORAGE_PATH = _getAppStoragePathname()
