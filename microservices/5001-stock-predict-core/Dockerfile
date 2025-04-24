FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt && rm -rf /root/.cache
CMD ["python", "server.py"]
