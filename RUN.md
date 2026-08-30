# How to run the VoxStream server

GitHub Pages is the website. This program is separate. It runs on your PC.

## Windows (PowerShell)

Install Node LTS from https://nodejs.org and Git from https://git-scm.com.

```
cd $HOME\Downloads
git clone https://github.com/YuiCoder/VoxStream.git
cd VoxStream\server
copy .env.example .env
```

If PowerShell blocks `npm`:

```
npm.cmd install
npm.cmd start
```

Or one time:

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then `npm install` and `npm start` work.

Update the folder later:

```
cd C:\Users\blood\Downloads\VoxStream
git pull
cd server
npm.cmd start
```

Stop: Ctrl+C in that window.

## Check

http://localhost:8787/
http://localhost:8787/health
http://localhost:8787/v1/me

`plan` must be `free`. `stripe` / `euler` / `mailer` stay false until you add keys. Do not add keys yet.

Pages keeps working if this window is closed.
