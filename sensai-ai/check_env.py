#!/usr/bin/env python3
"""
Environment variable checker for SensAI
Run this script to verify that all required environment variables are set
"""

import os
import sys

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def check_env():
    print("Checking environment variables...")
    
    # Required environment variables
    required_vars = [
        'GOOGLE_CLIENT_ID',
        'OPENAI_API_KEY'
    ]
    
    # Optional environment variables
    optional_vars = [
        'S3_BUCKET_NAME',
        'S3_FOLDER_NAME', 
        'BUGSNAG_API_KEY',
        'SLACK_USER_SIGNUP_WEBHOOK_URL',
        'SLACK_COURSE_CREATED_WEBHOOK_URL',
        'SLACK_USAGE_STATS_WEBHOOK_URL',
        'PHOENIX_ENDPOINT',
        'PHOENIX_API_KEY'
    ]
    
    missing_required = []
    missing_optional = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_required.append(var)
        else:
            print(f"✓ {var} is set")
    
    for var in optional_vars:
        if not os.getenv(var):
            missing_optional.append(var)
        else:
            print(f"✓ {var} is set")
    
    if missing_required:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_required)}")
        print("Please set these variables in your .env file")
        return False
    
    if missing_optional:
        print(f"\n⚠️  Missing optional environment variables: {', '.join(missing_optional)}")
        print("These are not required for basic functionality")
    
    print("\n✅ All required environment variables are set!")
    return True

if __name__ == "__main__":
    success = check_env()
    sys.exit(0 if success else 1)
