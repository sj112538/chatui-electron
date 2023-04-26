@echo off
setlocal EnableDelayedExpansion

set port1=3999
set port2=7999

:port_check
set /a port1+=1
set /a port2+=1
set "port1_in_use="
set "port2_in_use="

for /f "tokens=1,*" %%a in ('netstat -an ^| findstr /r ":%port1% *LISTENING"') do (
    set "port1_in_use=%%a"
    goto port_check
)

for /f "tokens=1,*" %%a in ('netstat -an ^| findstr /r ":%port2% *LISTENING"') do (
    set "port2_in_use=%%a"
    goto port_check
)

set "vite_api_port=%port2%"

setlocal EnableDelayedExpansion
set "found_vite_api_port="
(for /f "usebackq tokens=*" %%a in (".env.development") do (
    set "line=%%a"
    if "!line:VITE_API_PORT=!"=="!line!" (
        echo !line!
    ) else (
        set "line=VITE_API_PORT=!vite_api_port!"
        set "found_vite_api_port=1"
        echo !line!
    )
)) > .env.development.tmp

if not defined found_vite_api_port (
    echo VITE_API_PORT=!vite_api_port! >> .env.development.tmp
)

move /Y .env.development.tmp .env.development

start /B "" cmd /c "npx vite --port=%port1%" 
start /B "" cmd /c "cd nodeServer & nodemon index.js %port2%"
