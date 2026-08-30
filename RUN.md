# How to run the VoxStream server

The website on GitHub Pages is not the server. The server is a program on your computer.

## Once

1. Install Node.js LTS from https://nodejs.org (the big LTS button).
2. Install Git if you do not have it: https://git-scm.com
3. Open **PowerShell** (Windows: Start, type PowerShell).
4. Get the repo:

```
cd $HOME\Downloads
git clone https://github.com/YuiCoder/VoxStream.git
cd VoxStream\server
```

If you already cloned it, just `cd` into that `server` folder.

5. Create the env file:

```
copy .env.example .env
```

6. Leave `.env` empty of secrets. Do not paste Euler or Stripe keys until you are ready.

## Every time you want it on

PowerShell:

```
cd $HOME\Downloads\VoxStream\server
npm install
npm start
```

You should see: `VoxStream server on http://localhost:8787`

Browser: http://localhost:8787/health
Browser: http://localhost:8787/v1/me

That JSON should say `"plan":"free"`.

Stop it: click the PowerShell window and press Ctrl+C.

## Point the studio at it (optional)

Pages cannot talk to localhost from the public site in a useful way.
This is for you on the same machine, later.

For now you only need `/health` to prove Node runs.
