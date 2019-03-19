# fresh counter

> sudo raspi-config
3 , B1 , B4
5 , yes


download/checkout the files

in app.js change var IP to have the server's address on the current LAN

in the folder:
> npm install

> node app.js

in browser:
localhost:3000 ;
localhost:3000/user?id=1 ; localhost:3000/user?id=2 ; ...


for hiding the cursor

> sudo apt-get install unclutter


to start up with kiosk, node app and cursor off 
> sudo nano /etc/xdg/lxsession/LXDE-pi/autostart

	to be like:
		@lxpanel --profile LXDE-pi
		@pcmanfm --desktop --profile LXDE-pi
		@screensaver -no-splash

		@chromium --app=http://localhost:8080/ --kiosk --disable-session-crashed-bubble --fast --fast-start --disable-notifications --disable-infobars --noerrdialogs

		@unclutter -idle 0.1

		point-rpi

		node /home/pi/app/app.js

		sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
		sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences


