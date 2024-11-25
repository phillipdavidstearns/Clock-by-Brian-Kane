# kane-widgets

## Setup

### Assumptions

* You're running Linux with at least Python 3.11 or later
* The device you're installing on has an internet connection
* You have **sudo** privileges

### Steps

1. Change directory to where you keep your projects. For example: `cd ~/Projects`
1. Clone this repository: `git clone https://github.com/phillipdavidstearns/kane-widgets.git`
1. Change to the cloned repository directory: `cd kane-widgets`
1. Create a python environment (optional if you already have one setup): `python3 -m venv venv`
1. Activate the environment (if you already have an environment setup, use its path instead): `source venv/bin/activate`
1. Install the dependencies: `pip3 install -r requirements.txt`
1. Edit the **widgets.service** file: `nano widgets.service`
1. Replace `<full path to the repository directory>` in the example below, e.g.: `/home/user/Projects`

```
[Unit]
Description=Widgets by Brian Kane

[Service]
Type=simple
ExecStart=<full path to the repository directory>/kane-widgets/venv/bin/python3 <full path to the repository directory>/kane-widgets/main.py
TimeoutStopSec=5
KillMode=mixed

[Install]
WantedBy=multi-user.target
```
1. Change permissions of the **widgets.service** file: `chmod 644 widgets.service`
1. Copy the service file to the systemd units directory: `sudo cp widgets.service /lib/systemd/system/`
1. Load the new service into **systemd**: `sudo systemctl daemon-reload`

#### Controlling the systemd service:

* Start the service: `sudo systemctl start widgets.service`
* Check the status of the service: `systemctl status widgets.service`

Output should look like this if all went well:

```
● widgets.service - Widgets by Brian Kane
     Loaded: loaded (/lib/systemd/system/widgets.service; disabled; preset: enabled)
     Active: active (running) since Mon 2024-11-25 13:36:44 MST; 10s ago
   Main PID: 2484 (python3)
      Tasks: 1 (limit: 9251)
        CPU: 229ms
     CGroup: /system.slice/widgets.service
             └─2484 /home/bk/Projects/kane-widgets/venv/bin/python3 /home/bk/Projects/kane-widgets/main.py
```

* Enable the service to start on boot: `sudo systemctl enable widgets.service`
* Restart the service: `sudo systemctl restart widgets.service`
* Stop the service: `sudo systemctl stop widgets.service`
* Disable the service: `sudo systemctl disable widgets.service`

### Use

Open a browser and point it to `http://localhost:<PORT>`. If you haven't configured the `PORT` variable in a `.env` file, substitute with `80`. Otherwise, you can specify port by creating a `.env` file in the repository directory and add the line `PORT=<your_desired_port_number>`.