from flask_sqlalchemy import SQLAlchemy
from enum import Enum

db = SQLAlchemy()


class RolesEnum(Enum):
    ADMIN = 'ADMIN'
    STAFF = 'STAFF'
    STUDENT = 'STUDENT'
    NONE = 'None'


class TagsEnum(Enum):
    CSE_CORE = 'CSE Core'
    CSE_CONC_AREA_ELEC = 'CSE Concentration Area Elective'
    CSE_TECH_ELEC = 'CSE Technical Elective'
    CSE_LAB_REQ = 'CSE Laboratory Requirement'
    CSE_LAB_ELEC = 'CSE Laboratory Elective'
    CSE_INDE_REQ = 'CSE INDE Requirement'
    APP_EXP = 'Approved Experience'
    FYP = 'Final Year Project'
    MATH_REQ = 'Math Requirement'
    MATH_ELEC = 'Math Elective'
    SCI_REQ = 'Science Requirement'
    SCI_ELEC = 'Science Elective'
    NS = 'Natural Sciences'
    AR = 'Arabic Communication Skills'
    EN = 'English Communication Skills'
    HUM1 = 'Humanities I'
    HUM2 = 'Humanities II'
    SS1 = 'Social Sciences I'
    SS2 = 'Social Sciences II'
    NO_TAG = 'No Tag'


TagsEnumDict = {
    'CSE_CORE': 'CSE Core',
    'CSE_CONC_AREA_ELEC': 'CSE Concentration Area Elective',
    'CSE_TECH_ELEC': 'CSE Technical Elective',
    'CSE_LAB_REQ': 'CSE Laboratory Requirement',
    'CSE_LAB_ELEC': 'CSE Laboratory Elective',
    'CSE_INDE_REQ': 'CSE INDE Requirement',
    'APP_EXP': 'Approved Experience',
    'FYP': 'Final Year Project',
    'MATH_REQ': 'Math Requirement',
    'MATH_ELEC': 'Math Elective',
    'SCI_REQ': 'Science Requirement',
    'SCI_ELEC': 'Science Elective',
    'NS': 'Natural Sciences',
    'AR': 'Arabic Communication Skills',
    'EN': 'English Communication Skills',
    'HUM1': 'Humanities I',
    'HUM2': 'Humanities II',
    'SS1': 'Social Sciences I',
    'SS2': 'Social Sciences II',
    'NO_TAG': 'No Tag'
}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    role = db.Column(db.Enum(RolesEnum), default=RolesEnum.NONE, nullable=False)
    is_email_confirmed = db.Column(db.Boolean, default=False)
    student = db.relationship('Student', backref='user', uselist=False)

    def __repr__(self) -> str:
        return self.email


student_course_association_table = db.Table('student_course',
    db.Column('student_id', db.String(50), db.ForeignKey('student.AUBNet_id')),
    db.Column('course_id', db.String(50), db.ForeignKey('course.name'))
)


class Student(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), unique=True)
    AUBNet_id = db.Column(db.String(50), unique=True, nullable=False, primary_key=True)
    id_number = db.Column(db.String(50), unique=True, nullable=False)
    taken_courses = db.relationship('Course', secondary=student_course_association_table, backref='students')

    def __repr__(self) -> str:
        return self.AUBNet_id


class Course(db.Model):
    name = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.Text)
    tag1 = db.Column(db.Enum(TagsEnum), default=TagsEnum.NO_TAG)
    tag2 = db.Column(db.Enum(TagsEnum), default=TagsEnum.NO_TAG)
    tag3 = db.Column(db.Enum(TagsEnum), default=TagsEnum.NO_TAG)
    equivalent_to = db.Column(db.Text)

    def __repr__(self) -> str:
        return self.name