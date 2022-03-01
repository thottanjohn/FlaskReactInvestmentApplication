from app import db

class Investment(db.Model):
    __tablename__ = 'investments'

    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.Integer)
    title = db.Column(db.String())
    type = db.Column(db.String())
    thumbnailid = db.Column(db.String())

    def __init__(self, position, title, type, thumbnailid):
        self.position = position
        self.title = title
        self.type = type
        self.thumbnailid = thumbnailid

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'type': self.type ,
            'title': self.title,
            'position': self.position,
            'thumbnail': self.thumbnailid
        }
