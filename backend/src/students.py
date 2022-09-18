from flask import jsonify, request, Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.schemas import coursesSchema, studentsSchema
from src.database import Student, User, RolesEnum
from src.utils import (
    ExtractCourses, checkCseCoreCourses, checkCseLabRequirements, checkApprovedExperience, 
    checkFinalYearProject, checkIndeCourses, checkMathRequirements, 
    checkScienceRequirements, checkEnglishRequirements, checkElectives
)

students = Blueprint("students", __name__, url_prefix="/api/students/")


@students.get('/')
@jwt_required()
def getAllStudents():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STAFF:
        return {'error' : 'unauthorized'}, 401

    students = Student.query.order_by('AUBNet_id').all()
    return jsonify(studentsSchema.dump(students)), 200


@students.get('/<AUBNet_id>/taken-courses')
@jwt_required()
def getTakenCourses(AUBNet_id):
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STAFF:
        return {'error' : 'unauthorized'}, 401

    student = Student.query.filter_by(AUBNet_id=AUBNet_id).first()
    if student is None:
        return {'error' : AUBNet_id + ' doesn\'t exist'}, 404
    return jsonify(coursesSchema.dump(student.taken_courses)), 200


@students.get('/me/taken-courses')
@jwt_required()
def getTakenCoursesByMe():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STUDENT:
        return {'error' : 'unauthorized'}, 401

    return jsonify({'courses': [course.name for course in user.student.taken_courses]}), 200


@students.post('/me/transcript-upload')
@jwt_required()
def uploadTranscript():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STUDENT:
        return {'error' : 'unauthorized'}, 401

    if 'file' not in request.files:
        return {'error' : '\'file\' key missing'}, 400

    if request.files['file'].name == '':
        return {'error' : 'no transcript uploaded'}, 400

    if not request.files['file'].filename.lower().endswith('.pdf'):
        return {'error' : 'only pdf files are allowed'}, 400

    return ExtractCourses(user.student, request.files['file'])


@students.get('/me/graduation-requirements-examination')
@jwt_required()
def checkGraduationRequirements():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STUDENT:
        return {'error' : 'unauthorized'}, 401

    student = user.student
    response = {}
    checkCseCoreCourses(student=student, response=response)
    checkCseLabRequirements(student=student, response=response) 
    checkApprovedExperience(student=student, response=response)
    checkFinalYearProject(student=student, response=response)
    checkIndeCourses(student=student, response=response)
    checkMathRequirements(student=student, response=response)
    checkScienceRequirements(student=student, response=response)
    checkEnglishRequirements(student=student, response=response)
    checkElectives(student=student, response=response)
    
    return response, 200


@students.get('/<AUBNet_id>/graduation-requirements-examination')
@jwt_required()
def checkGraduationRequirementsByStaff(AUBNet_id):
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STAFF:
        return {'error' : 'unauthorized'}, 401
        
    student = Student.query.filter_by(AUBNet_id=AUBNet_id).first()
    if student is None:
        return {'error' : AUBNet_id + ' doesn\'t exist'}, 404

    response = {}
    checkCseCoreCourses(student=student, response=response)
    checkCseLabRequirements(student=student, response=response) 
    checkApprovedExperience(student=student, response=response)
    checkFinalYearProject(student=student, response=response)
    checkIndeCourses(student=student, response=response)
    checkMathRequirements(student=student, response=response)
    checkScienceRequirements(student=student, response=response)
    checkEnglishRequirements(student=student, response=response)
    checkElectives(student=student, response=response)
    
    return response, 200