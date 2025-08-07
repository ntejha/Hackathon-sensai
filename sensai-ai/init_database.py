#!/usr/bin/env python3
"""
Manual database initialization script for SensAI
Run this script to create all database tables before starting the server
"""

import asyncio
import sys
import os

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

async def main():
    try:
        from api.db import init_db
        print("Initializing database...")
        await init_db()
        print("Database initialized successfully!")
        
        # Check if database file was created
        from api.config import sqlite_db_path
        if os.path.exists(sqlite_db_path):
            print(f"Database file created at: {sqlite_db_path}")
        else:
            print("Warning: Database file not found after initialization")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
