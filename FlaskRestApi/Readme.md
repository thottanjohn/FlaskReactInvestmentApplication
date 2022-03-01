# Title
Flask Rest API to handle Investments

# Description
Endpoints used in this MicroService are as follows:
    1. GET /v1/investment - To Get all Investment to Database
    2. POST /v1/investment - To add an investment to Database
    3. GET /v1/investment/{position} - To get Investment By Position in Data Display
    4. GET /v1/file/{fileid} - To get image by fileId
    5. POST /v1/updateinvestments - To update position of investments in database so that display can be updated in UI


# How to start
1. Open a terminal
2. Create a virtual env - python3 -m venv investmentenv
3. source investmentenv/bin/activate
4. pip3 install -r requirements.txt
5. You need to postgresql setup with a sample DB investmentstore . Connection String - postgresql://postgres:postgres@localhost:5432/investmentstore
6. flask db init
7. flask db migrate
8. flask db upgrade
9. flask run
10. Microservice will be running at port 5000 by default

# Environment Variables
Copy the following values into a .env file
APP_SETTINGS="config.DevelopmentConfig"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/investmentstore"

# Future Enhancements
1. Create router controller service architecture.
2. Dockerizing PSQL Database