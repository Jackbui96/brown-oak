#!/bin/bash

cd /home/ubuntu/brown-oak/microservices/daily-stock-service

# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r requirements.txt
fi

# Check if requirements have changed and reinstall if needed
if [ requirements.txt -nt venv/last_requirements_install ]; then
    echo "Requirements changed. Updating..."
    ./venv/bin/pip install -r requirements.txt
    touch venv/last_requirements_install
fi

# Activate virtual environment and run script
echo "Starting stock fetcher at $(date)"
./venv/bin/python src/app.py
echo "Completed stock fetcher at $(date)"
