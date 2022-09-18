from marshmallow import Schema, fields
from marshmallow_enum import EnumField
from src.database import TagsEnum

class UserSchema(Schema):
    class Meta:
        fields = ('firstName', 'lastName', 'email')


class CourseSchema(Schema):
    tag1 = EnumField(TagsEnum, by_value=True)
    tag2 = EnumField(TagsEnum, by_value=True)
    tag3 = EnumField(TagsEnum, by_value=True)
    class Meta:
        fields = ('name', 'title', 'tag1', 'tag2', 'tag3', 'equivalent_to')


class StudentSchema(Schema):
    user = fields.Nested(UserSchema())
    AUBNet_id = fields.String()
    id_number = fields.Integer()
    taken_courses = fields.Nested(CourseSchema(many=True, only=['name']))


userSchema = UserSchema()
usersSchema = UserSchema(many=True)


studentSchema = StudentSchema()
studentsSchema = StudentSchema(many=True)


courseSchema = CourseSchema()
coursesSchema = CourseSchema(many=True)