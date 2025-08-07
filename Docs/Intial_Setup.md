# Initial Setup


Create the a folder

create a virtualenv of python 3.12

Please clone these two repos in the folder : 
- `git clone https://gitlab.com/hvacademy/sensai-ai.git`
- `git clone https://gitlab.com/hvacademy/sensai-frontend.git`

Go inside `sensai-ai.git` :
- `vim requirements.txt` file and remove the uvloop dependencies (if windows) 
- `pip install -r requirements-dev.txt`
- `sudo pacman -Syu ffmpeg poppler
- Copy `src/api/.env.example` to `src/api/.env` and set the OpenAI credentials. Refer to [ENV.md](/hvacademy/sensai-ai/-/blob/main/docs/ENV.md) for more details on the environment variables. Fill the required API's. You can generate NextAUTH_Secret `openssl rand -base64 32
`
- Copy `src/api/.env.aws.example` to `src/api/.env.aws` and set the AWS credentials. FIll the API's
- Go to `__init__.py` in `src/api/db` and put this 

```
async def create_organizations_table(cursor):
    await cursor.execute(
        f"""CREATE TABLE IF NOT EXISTS {organizations_table_name} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                default_logo_color TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                openai_api_key TEXT,
                openai_free_trial BOOLEAN
            )"""
    )

    # Check if index exists before creating it
    await cursor.execute(
        f"""SELECT name FROM sqlite_master 
            WHERE type='index' AND name='idx_org_slug'"""
    )
    if not await cursor.fetchone():
        await cursor.execute(
            f"""CREATE INDEX idx_org_slug ON {organizations_table_name} (slug)"""
        )

```

- then go to src and run this `python startup.py`, this will intialize the db
- now in sense-ai, run this `uvicorn src.api.main:app --reload --port 8000`


Go inside senseai-frontend : 
- Download nodejs above 18
- Run `npm install`
- `cp .env.example .env.local`, fill the required API's
- Run `npm run dev`

Run both the folders in different terminals and check it in `localhost:3000`, if you can login and after loading a page come which looks like create course button comes.

Success
