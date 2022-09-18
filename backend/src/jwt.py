from flask import jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, set_access_cookies, unset_jwt_cookies
from flask_jwt_extended import get_csrf_token
from werkzeug.security import check_password_hash
from src.database import RolesEnum, User
from src.users import users

jwt = JWTManager()


@users.post('/login')
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    if not email or ("@aub.edu.lb" not in email and "@mail.aub.edu" not in email) or len(email) < 12 or " " in email:
        return ({'error' : 'Bad Email'}), 400

    if not password or len(password) < 6:
        return ({'error' : 'Bad Password'}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if user: 
        is_pass_correct = check_password_hash(user.password, password)

        if is_pass_correct:

            if(user.role == RolesEnum.NONE):
                return ({'error': 'Can\'t Login Your Account is Suspended!'}), 401

            access_token = create_access_token(identity=user.id)
            response = jsonify({
                'role': user.role.name,
                'access_csrf': get_csrf_token(access_token),
            })
            set_access_cookies(response, access_token, max_age=(24 * 3600))
            return response, 200
        
        return {'error' : 'Wrong Credentials'}, 401

    return ({'error' : 'User Doesn\'t Exist'}), 404


@users.post('/logout')
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200


@users.post('/me/role')
@jwt_required()
def getRole():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    return jsonify({'role' : user.role.name}), 200
