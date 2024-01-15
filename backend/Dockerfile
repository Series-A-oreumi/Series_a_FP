FROM python:3.11

WORKDIR /app/

COPY . /app/

# 필요한 패키지 및 라이브러리 설치
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]