# Use AWS Lambda Python base image
FROM public.ecr.aws/lambda/python:3.9

# Install system dependencies
RUN yum update -y && yum install -y \
    gcc \
    gcc-c++ \
    make \
    && yum clean all

# Copy requirements first to leverage Docker cache
COPY requirements.txt ${LAMBDA_TASK_ROOT}/

# Install Python dependencies
RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt

# Install TensorFlow - specifying version for compatibility
RUN pip install --no-cache-dir tensorflow==2.10.1

# Copy application code
COPY . ${LAMBDA_TASK_ROOT}/

# Create models directory
RUN mkdir -p ${LAMBDA_TASK_ROOT}/models

# Create Lambda handler wrapper
COPY <<'EOF' ${LAMBDA_TASK_ROOT}/lambda_handler.py
import json
import subprocess
import os
import sys

def handler(event, context):
    try:
        # Set up environment variables if needed from event
        if 'environmentVariables' in event:
            for key, value in event['environmentVariables'].items():
                os.environ[key] = value
                
        # Run the stock prediction script
        result = subprocess.run(
            [sys.executable, "src/app.py"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        # Prepare output
        output = {
            "statusCode": 200 if result.returncode == 0 else 500,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
        
        return output
    except Exception as e:
        return {
            "statusCode": 500,
            "error": str(e)
        }
EOF

# Set the CMD to the Lambda handler
CMD ["lambda_handler.handler"]
