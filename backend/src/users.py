from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash
from src.database import RolesEnum, db, User, Student

users = Blueprint("users", __name__, url_prefix="/api/users/")


@users.post('/staff-registration')
def createStaff():
    firstName = request.json.get('firstName')
    lastName = request.json.get('lastName')
    email = request.json.get('email')
    password = request.json.get('password')

    if not firstName or " " in firstName:
        return ({'error': 'Bad First Name'}), 400

    if not lastName or " " in lastName:
        return ({'error': 'Bad Last Name'}), 400

    if not email or "@aub.edu.lb" not in email or len(email) < 12 or " " in email:
        return ({'error' : 'Bad Email'}), 400

    if not password or len(password) < 6:
        return ({'error' : 'Bad Password'}), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'error' : 'Account Already Exists'}), 409
    
    password_hash = generate_password_hash(password)

    #the new user's role will be None (default) until the Admin confirms s/he is an AUB Staff
    staffUser = User(firstName=firstName, lastName=lastName, email=email, password=password_hash) 
    db.session.add(staffUser)
    db.session.commit()

    return jsonify({'message' : 'user created'}), 201


@users.post('/student-registration')
def createStudent():
    firstName = request.json.get('firstName')
    lastName = request.json.get('lastName')
    email = request.json.get('email')
    password = request.json.get('password')
    AUBNet_id = request.json.get('AUBNet_id')
    id_number = request.json.get('id_number')

    if not firstName or " " in firstName:
        return ({'error': 'Bad First Name'}), 400

    if not lastName or " " in lastName:
        return ({'error': 'Bad Last Name'}), 400

    if not email or "@mail.aub.edu" not in email or " " in email:
        return ({'error' : 'Bad Email'}), 400

    if not AUBNet_id or " " in AUBNet_id:
        return ({'error' : 'Bad AUBNet_id'}), 400

    if email != AUBNet_id + "@mail.aub.edu":
        return ({'error' : 'Inconsistent Email and AUBNet_id'}), 400

    if not id_number or " " in id_number or len(id_number) < 9:
        return ({'error' : 'Bad ID Number'}), 400
    
    if not password or len(password) < 6:
        return ({'error' : 'Bad Password'}), 400

    if User.query.filter_by(email=email).first() is not None:
        return {'error' : 'Already Exists'}, 409

    if Student.query.filter_by(AUBNet_id= AUBNet_id).first() is not None:
        return {'error' : 'Already Exists'}, 409

    if Student.query.filter_by(id_number= id_number).first() is not None:
        return {'error' : 'Already Exists'}, 409
    
    password_hash = generate_password_hash(password)

    user = User(firstName=firstName, lastName=lastName, email=email, password=password_hash, role=RolesEnum.STUDENT) 
    student = Student(user=user, AUBNet_id=AUBNet_id, id_number=id_number)
    db.session.add(user)
    db.session.add(student)
    db.session.commit()

    return jsonify({'message' : 'user created'}), 201