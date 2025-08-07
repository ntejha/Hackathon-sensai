#!/usr/bin/env python3
"""
Database reset script for SensAI
This script will completely delete and recreate the database
Use this if you're having persistent database issues
"""

import asyncio
import sys
import os

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

async def main():
    try:
        from api.config import sqlite_db_path
        from api.db import init_db
        
        print("Resetting database...")
        
        # Delete existing database file if it exists
        if os.path.exists(sqlite_db_path):
            os.remove(sqlite_db_path)
            print(f"Deleted existing database: {sqlite_db_path}")
        
        # Initialize fresh database
        print("Creating fresh database...")
        await init_db()
        
        print("Database reset completed successfully!")
        print(f"New database created at: {sqlite_db_path}")
        
    except Exception as e:
        print(f"Error resetting database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
