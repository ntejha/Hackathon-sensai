import os
import sys
import asyncio

# Set PYTHONPATH to allow importing `api` from `src/`
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

from api.db import init_db
from api.config import UPLOAD_FOLDER_NAME

async def main():
    await init_db()

    # Create uploads folder if it doesn't exist
    root_dir = os.path.dirname(os.path.abspath(__file__))
    upload_folder = os.path.join(root_dir, "appdata", UPLOAD_FOLDER_NAME)
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        print(f"Created upload folder at {upload_folder}")

    print("✅ Database initialized successfully.")

if __name__ == "__main__":
    asyncio.run(main())

