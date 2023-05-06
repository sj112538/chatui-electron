@echo off
setlocal EnableDelayedExpansion

set port1=4000
set port2=5000
set port3=6000

:port_check
set /a port1+=1
set /a port2+=1
set /a port3+=1

set "port1_in_use="
set "port2_in_use="
set "port3_in_use="

for /f "tokens=1,*" %%a in ('netstat -an ^| findstr /r ":%port1% *LISTENING"') do (
    set "port1_in_use=%%a"
    goto port_check
)

for /f "tokens=1,*" %%a in ('netstat -an ^| findstr /r ":%port2% *LISTENING"') do (
    set "port2_in_use=%%a"
    goto port_check
)

for /f "tokens=1,*" %%a in ('netstat -an ^| findstr /r ":%port3% *LISTENING"') do (
    set "port3_in_use=%%a"
    goto port_check
)

set "vite_api_port=%port2%"
set "vite_python_port=%port3%"

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

set "found_vite_python_port="
(for /f "usebackq tokens=*" %%a in (".env.development.tmp") do (
    set "line=%%a"
    if "!line:VITE_PYTHON_PORT=!"=="!line!" (
        echo !line!
    ) else (
        set "line=VITE_PYTHON_PORT=!vite_python_port!"
        set "found_vite_python_port=1"
        echo !line!
    )
)) > .env.development

if not defined found_vite_api_port (
    echo VITE_API_PORT=!vite_api_port! >> .env.development
)

if not defined found_vite_python_port (
    echo VITE_PYTHON_PORT=!vite_python_port! >> .env.development
)

start /B "" cmd /c "npx vite --port=%port1%"
start /B "" cmd /c "cd nodeServer & nodemon index.js %port2%" 
start /B "" cmd /c "cd server & python api.py %port3%"
pause