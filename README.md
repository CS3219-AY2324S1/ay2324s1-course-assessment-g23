[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)
# PeerPrep - CS3219 Grp 23

The latest deployment on google cloud can be found at http://peerprep.xyz. Make sure to go through [step 6](/README.md#steps) to access full features.

## Deployment

### Requirements

1. Docker: Version 24.0.5 or higher is required.
2. Docker Compose: Version 2.20.0 or higher is necessary.
3. Operating System: If deploying on a Linux server, only Ubuntu version 20.04 or Debian version 10 are acceptable.

### Steps

1. Clone this repository.
2. Download the `.env` file from canvas and place it into the root of this repository. (If you do not have access to the `.env` file, you can create a new file called `.env` with the `ENV_TYPE="prod"`, your `POSTGRES_PASSWORD` and your `JWT_RS256_PRIVATE_KEY`).
3. Start the application by running the `start_containers.sh` script.

```
bash start_containers.sh
```

(Note: You might need to use sudo according to the permissions on your machine)

4. If you are deploying on a remote server, make sure to open port 80.
5. Access the website on your browser at `http://<your ip address>:80` (80 is the default port for a website).
6. (Note: This step is not required if you're deploying the application on your localhost.) Since we're using http instead of https, you'll need to edit the permissions of the site to access all the features (specifically, for video chatting).

- For Chrome:
Type `<your browser>://flags/#unsafely-treat-insecure-origin-as-secure` into your browser url (replace `<your browser>` with `chrome` for google chrome). This will bring you to the relevant settings. Add the url of your deployment (`http://<your ip address>:80` or `http://peerprep.xyz`) in the text box and enable this setting.

- For Safari:
Click Safari > Preferences > Advanced and check `Show Develop menu in menu bar`. Select `Develop` in the menu bar and select `WebRTC`. Check `Allow Media Capture on Insecure Sites`

## Assignments

To view/run the assignment codes, checkout to the tagged commits:

```bash
git checkout tags/Assignment-X  # where X = 1, 2, 3, 4, 5
```

And follow the setup instructions found in the `README.md` of the tagged commit.

For convenience, here are the links to the tagged commits on GitHub:

- [Assignment-1](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g23/tree/Assignment-1)
- [Assignment-2](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g23/tree/Assignment-2)
- [Assignment-3](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g23/tree/Assignment-3)
- [Assignment-4](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g23/tree/Assignment-4)
- [Assignment-5](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g23/tree/Assignment-5)
