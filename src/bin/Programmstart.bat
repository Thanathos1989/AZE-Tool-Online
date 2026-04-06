@echo off
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk --edge-kiosk-type=fullscreen "file://%~dp0../../index.html"   
exit

rem nach msedge.exe" einfügen
rem --kiosk --edge-kiosk-type=fullscreen 