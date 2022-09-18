from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.database import RolesEnum, db, User, Course, TagsEnumDict
from src.schemas import courseSchema, coursesSchema

courses = Blueprint("courses", __name__, url_prefix="/api/courses/")


@courses.get('/')
def getAllCourses():
    allCourses = Course.query.order_by('name').all()
    return jsonify(coursesSchema.dump(allCourses)), 200


@courses.get('/<name>')
def getCourse(name):
    if name == 'course-creation' or name == 'course-update':
        return {'error' : 'Get Not Supported'}, 405

    course = Course.query.filter_by(name=name).first()
    if not course:
        return { 'message' : 'Course Doesn\'t Exist' }, 404
    return courseSchema.dump(course), 200


@courses.post('/course-creation')
@jwt_required()
def createCourse():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STAFF:
        return {'error' : 'unauthorized access'}, 401

    name = request.json.get('name')
    title = request.json.get('title')
    tag1 = request.json.get('tag1')
    tag2 = request.json.get('tag2')
    tag3 = request.json.get('tag3')
    equivalent_to = request.json.get('equivalent_to')

    if not name or len(name) < 3 or " " in name:
        return {'error' : 'Bad Name'}, 400

    if not title:
        return {'error' : 'Bad Title'}, 400

    if Course.query.filter_by(name=name).first() is not None:
        return {'error' : 'Already Exists'}, 409
    
    equivalentCourse = Course.query.filter_by(name=equivalent_to).first()
    if (equivalent_to and equivalentCourse is None):
        return {'error' : 'Equivalent Course Doesn\'t Exist'}, 409
    
    if tag1 not in TagsEnumDict or tag2 not in TagsEnumDict or tag3 not in TagsEnumDict:
        return {
            'error' : 'Invalid Tag',
            'suggested valid tags' : TagsEnumDict
        }, 400
    
    course = Course(name=name, title=title, tag1=tag1, tag2=tag2, tag3=tag3, equivalent_to=equivalent_to)
   
    if equivalent_to: #the new course is equivalent to an existing course
       equivalentCourse.equivalent_to = name

    db.session.add(course)
    db.session.commit()
    return {'message' : 'course created'}, 201


@courses.put('/course-update')
@jwt_required()
def updateCourse():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STAFF:
        return {'error' : 'unauthorized access'}, 401

    name = request.json.get('name')
    title = request.json.get('title')
    tag1 = request.json.get('tag1')
    tag2 = request.json.get('tag2')
    tag3 = request.json.get('tag3')
    equivalent_to = request.json.get('equivalent_to')

    if not name or len(name) < 3 or " " in name:
        return {'error' : 'Bad Name'}, 400

    if not title:
        return {'error' : 'Bad Title'}, 400

    if equivalent_to:
        equivalentCourse = Course.query.filter_by(name=equivalent_to).first()
        if equivalentCourse is None:
            return {'error' : 'Equivalent Course Doesn\'t Exist'}, 409
        equivalentCourse.equivalent_to = name
        
    course =  Course.query.filter_by(name=name).first()
    if course is None:
        return {'error' : 'If you wish to change the name of a course, delete the old course and create a new one with the new name.'}, 404

    if tag1 not in TagsEnumDict or tag2 not in TagsEnumDict or tag3 not in TagsEnumDict:
        return {
            'error' : 'invalid tag',
            'suggested valid tags' : TagsEnumDict
        }, 400
        
    course.title = title 
    course.tag1 = tag1
    course.tag2 = tag2
    course.tag3 = tag3

    if equivalent_to and len(equivalent_to) == 0:
        equivalent_to = None
            
    course.equivalent_to = equivalent_to

    db.session.commit()
    return {'message' : 'course updated'}, 200


@courses.delete('/course-deletion')
@jwt_required()
def deleteCourse():
    id = get_jwt_identity()
    user = User.query.filter_by(id=id).first()
    if user.role != RolesEnum.STAFF:
        return {'error' : 'unauthorized access'}, 401

    name = request.json.get('name')

    if not name or len(name) < 3 or " " in name:
        return {'error' : 'bad name'}, 400
    
    course =  Course.query.filter_by(name=name).first()
    if course is None:
        return {'error' : 'course doesn\'t exist'}, 404
    
    if course.equivalent_to:
        equivalentCourse = Course.query.filter_by(name=course.equivalent_to).first()
        if(equivalentCourse):
            equivalentCourse.equivalent_to = None

    db.session.delete(course)
    db.session.commit()
    return {'message' : 'course deleted'}, 200