REM signtool signwizard
REM A movie compilation and playback app for Windows.
REM https://github.com/nikola/ka-BOOM
REM http://timestamp.verisign.com/scripts/timstamp.dll
del dist\ka-BOOM.exe
pyi-build ka-BOOM.spec --distpath=dist --workpath=build --noconfirm --ascii