
import os
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask import Flask, jsonify, request,  send_from_directory
from dotenv import load_dotenv
from flask_cors import CORS
import uuid
import pathlib

load_dotenv()
TARGET_DIR='./fileStorage'

app = Flask(__name__)
CORS(app)
api = Api(app)


app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = TARGET_DIR
db = SQLAlchemy(app)
migrate = Migrate(app, db)


from models import Investment



class InvestmentController(Resource):

    def get(self):
        try:
            investments = Investment.query.order_by(Investment.position)
            return jsonify([e.serialize() for e in investments])
        except Exception as e:
            print(f'Exception Occured {str(e)}.')
            return(str(e))
    def post(self):



        if not os.path.isdir(TARGET_DIR):
            os.mkdir(TARGET_DIR)
        try:
            thumbnail = request.files['thumbnail']
            title = request.form['title']
            print(title)
            type = request.form['type']
            position = request.form['position']
            investment = Investment.query.filter_by(position=position).first()
            if(not investment):
                file_extension = pathlib.Path(thumbnail.filename).suffix
                thumbnailid = str(uuid.uuid4())+file_extension

                destination="/".join([TARGET_DIR, thumbnailid])
                thumbnail.save(destination)
                newinvestment = Investment(    
                    type=type,
                    title=title,
                    position=position,
                    thumbnailid=thumbnailid
                )

                db.session.add(newinvestment)
                db.session.commit()
                # return "Investment added. book id={}".format(newinvestment.id)
                return f'Investment added. investment id={newinvestment.id}'
            else:
                raise Exception("Data is not latest .Please refresh the browser")
        except Exception as e:
            print(f'Exception Occured {str(e)}.')
            return(str(e),500)


class File(Resource):

    def get(self, fileid):
        response = send_from_directory(app.config['UPLOAD_FOLDER'],fileid,as_attachment=True)
        return response


class UpdateOrder(Resource):

    def post(self):
        try:
            investment = Investment.query.all()
            data = request.get_json()
            valid=True
            for i in data:
                x = [x for x in investment if x.id == i['id']]
                if len(x): 
                    if(x[0].position != i['prevposition']):
                        valid= False
                        break
                else:
                    raise Exception("No data exist with given id in database")
            if(valid):
                for ele in data:
                    newbook = Investment.query.filter_by(id=ele['id']).first()
                    newbook.position=ele['position']
                    db.session.commit()

                return jsonify({"valid":valid})
            else:
                raise Exception("Error while validating database")
        except Exception as e:
            print(f'Exception Occured {str(e)}.')
            return(str(e),500)



class InvesmentSingle(Resource):

    def get(self, position):
        investment = Investment.query.filter_by(position=position).first()
        return jsonify(investment.serialize())

api.add_resource(InvesmentSingle, '/v1/investment/<string:position>')
api.add_resource(InvestmentController, '/v1/investment')


api.add_resource(File, '/v1/file/<string:fileid>')
api.add_resource(UpdateOrder,'/v1/updateinvestments')


if __name__ == '__main__':

    app.run(debug=True)
