from re import findall, search
from PyPDF2 import PdfFileReader
from sqlalchemy import or_
from src.database import TagsEnum, db, Course

def ExtractCourses(student, file):
    pdfReader = PdfFileReader(file)
    courses = []
    for pageIndex in range(pdfReader.numPages):
        text = pdfReader.getPage(pageIndex).extractText()
        matches = findall("[A-Z]+ [0-9]{3}[A-Z]*", text)
        for match in matches:
            courseNumber = search("[0-9]{3}", match).group()
            if int(courseNumber) >= 200:
                courses.append(match.replace(" ", ""))
    
    for name in courses:
        print(name)
        course =  Course.query.filter_by(name=name).first()
        if course:
            student.taken_courses.append(course)
        else:
            course = Course(name=name, title=f'AUTOMATICALLY ADDED FROM {student.AUBNet_id}\'s Transcript', tag1='NO_TAG', tag2='NO_TAG', tag3='NO_TAG', equivalent_to=None)
            student.taken_courses.append(course)
    db.session.commit()
    
    return {'msg' : 'taken courses updated'}, 200


def checkCseCoreCourses(student, response):
    coreCourses = Course.query.filter(
        or_(Course.tag1 == TagsEnum.CSE_CORE, Course.tag2 == TagsEnum.CSE_CORE, Course.tag3 == TagsEnum.CSE_CORE)
        ).all()
    total = len(coreCourses)
    if total == 0:
        response['coreCourses'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    for course in coreCourses:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        elif course.equivalent_to:
            equivalentCourse = Course.query.filter_by(name = course.equivalent_to).first()
            if student in equivalentCourse.students:
                d[equivalentCourse.name] = 'TAKEN'
                taken += 1 
            else:
                d[course.name] = 'NOT_TAKEN'   
        else:
            d[course.name] = 'NOT_TAKEN'   
    d['ratio'] = f'{taken} taken out of {total}'
    response['coreCourses'] = d
    return


def checkCseLabRequirements(student, response):
    labRequirements = Course.query.filter(
        or_(Course.tag1 == TagsEnum.CSE_LAB_REQ, Course.tag2 == TagsEnum.CSE_LAB_REQ, Course.tag3 == TagsEnum.CSE_LAB_REQ)
        ).all()
    total = len(labRequirements)
    if total == 0:
        response['labRequirements'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    for course in labRequirements:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        else:
            d[course.name] = 'NOT_TAKEN'   
    d['ratio'] = f'{taken} taken out of {total}'
    response['labRequirements'] = d
    return


def checkApprovedExperience(student, response):
    approvedExperienceCourse = Course.query.filter(
        or_(Course.tag1 == TagsEnum.APP_EXP, Course.tag2 == TagsEnum.APP_EXP, Course.tag3 == TagsEnum.APP_EXP)
        ).first()
    if approvedExperienceCourse is None:
        response['approvedExperience'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    total = 1
    if student in approvedExperienceCourse.students:
        d[approvedExperienceCourse.name] = 'TAKEN'
        taken += 1
    else:
        d[approvedExperienceCourse.name] = 'NOT_TAKEN'
    d['ratio'] = f'{taken} taken out of {total}'
    response['approvedExperience'] = d
    return


def checkFinalYearProject(student, response):
    fypCourses = Course.query.filter(
        or_(Course.tag1 == TagsEnum.FYP, Course.tag2 == TagsEnum.FYP, Course.tag3 == TagsEnum.FYP)
        ).all()
    total = len(fypCourses)
    if total == 0:
        response['fyp'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    for course in fypCourses:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        else:
            d[course.name] = 'NOT_TAKEN'
    d['ratio'] = f'{taken} taken out of {total}'
    response['fyp'] = d
    return


def checkIndeCourses(student, response):
    indeCourses =Course.query.filter(
        or_(Course.tag1 == TagsEnum.CSE_INDE_REQ, Course.tag2 == TagsEnum.CSE_INDE_REQ, Course.tag3 == TagsEnum.CSE_INDE_REQ)
        ).all()
    total = len(indeCourses)    
    if total == 0:
        response['indeCourses'] = { "doesNotExist" : "doesNotExist" }
        return    
    d = {}
    taken = 0
    for course in indeCourses:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        else:
            d[course.name] = 'NOT_TAKEN'
    d['ratio'] = f'{taken} taken out of {total}'
    response['indeCourses'] = d
    return


def checkMathRequirements(student, response):
    mathRequirements = Course.query.filter(
        or_(Course.tag1 == TagsEnum.MATH_REQ, Course.tag2 == TagsEnum.MATH_REQ, Course.tag3 == TagsEnum.MATH_REQ)
        ).all()
    total = len(mathRequirements)
    if  total == 0:
        response['mathRequirements'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    for course in mathRequirements:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        elif course.equivalent_to:
            equivalentCourse = Course.query.filter_by(name = course.equivalent_to).first()
            if student in equivalentCourse.students:
                d[equivalentCourse.name] = 'TAKEN'
                taken += 1
            else:
                d[course.name] = 'NOT_TAKEN'         
        else:
            d[course.name] = 'NOT_TAKEN'
    d['ratio'] = f'{taken} taken out of {total}'
    response['mathRequirements'] = d


def checkScienceRequirements(student, response):
    scienceRequirements = Course.query.filter(
        or_(Course.tag1 == TagsEnum.SCI_REQ, Course.tag2 == TagsEnum.SCI_REQ, Course.tag3 == TagsEnum.SCI_REQ)
        ).all()
    total = len(scienceRequirements)
    if  total == 0:
        response['scienceRequirements'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    for course in scienceRequirements:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        else:
            d[course.name] = 'NOT_TAKEN'
    d['ratio'] = f'{taken} taken out of {total}'
    response['scienceRequirements'] = d


def checkEnglishRequirements(student, response):
    englishRequirements = Course.query.filter(
        or_(Course.tag1 == TagsEnum.EN, Course.tag2 == TagsEnum.EN, Course.tag3 == TagsEnum.EN)
        ).all()
    total = len(englishRequirements)
    if  total == 0:
        response['englishCommunicationSkills'] = { "doesNotExist" : "doesNotExist" }
        return
    d = {}
    taken = 0
    for course in englishRequirements:
        if student in course.students:
            d[course.name] = 'TAKEN'
            taken += 1
        else:
            d[course.name] = 'NOT_TAKEN'
    d['ratio'] = f'{taken} taken out of {total}'
    response['englishCommunicationSkills'] = d


def checkElectives(student, response):

    techElec = {"ratio": "Six 3-Credit Courses Required"}
    concAreaElec = {"ratio": "3 Courses Required"}
    labElec = {"ratio": "1 Course Required"}
    mathElec = {"ratio": "2 Courses Required"}
    sciElec = {"ratio": "8 Credits Required"}
    ns = {"ratio": "1 Course Required"}
    hum1 = {"ratio": "2 Humanities Courses Required from List I"}
    hum2 = {"ratio": "2 Humanities Courses Required from Either List I or II"}
    ss1 = {"ratio": "1 Social Sciences Course Required from List I"}
    ss2 = {"ratio": "1 Social Sciences Course Required from Either List I or II"}
    ar = {"ratio": "1 Course Required"}
    notConsidered = {}
    notConsideredCounter = 0

    for course in student.taken_courses:

        if course.tag1 == TagsEnum.CSE_TECH_ELEC or course.tag2 == TagsEnum.CSE_TECH_ELEC or course.tag3 == TagsEnum.CSE_TECH_ELEC:
            techElec[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.CSE_CONC_AREA_ELEC or course.tag2 == TagsEnum.CSE_CONC_AREA_ELEC or course.tag3 == TagsEnum.CSE_CONC_AREA_ELEC:
            concAreaElec[course.name] = 'TAKEN'
        
        if course.tag1 == TagsEnum.CSE_LAB_ELEC or course.tag2 == TagsEnum.CSE_LAB_ELEC or course.tag3 == TagsEnum.CSE_LAB_ELEC:
            labElec[course.name] = 'TAKEN'
            
        if course.tag1 == TagsEnum.MATH_ELEC or course.tag2 == TagsEnum.MATH_ELEC or course.tag3 == TagsEnum.MATH_ELEC:
            mathElec[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.SCI_ELEC or course.tag2 == TagsEnum.SCI_ELEC or course.tag3 == TagsEnum.SCI_ELEC:
            sciElec[course.name] = 'TAKEN'
            
        if course.tag1 == TagsEnum.NS or course.tag2 == TagsEnum.NS or course.tag3 == TagsEnum.NS:
            ns[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.HUM1 or course.tag2 == TagsEnum.HUM1 or course.tag3 == TagsEnum.HUM1:
            hum1[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.HUM2 or course.tag2 == TagsEnum.HUM2 or course.tag3 == TagsEnum.HUM2:
            hum2[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.SS1 or course.tag2 == TagsEnum.SS1 or course.tag3 == TagsEnum.SS1:
            ss1[course.name] = 'TAKEN'
            
        if course.tag1 == TagsEnum.SS2 or course.tag2 == TagsEnum.SS2 or course.tag3 == TagsEnum.SS2:
            ss2[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.AR or course.tag2 == TagsEnum.AR or course.tag3 == TagsEnum.AR:
            ar[course.name] = 'TAKEN'

        if course.tag1 == TagsEnum.NO_TAG and course.tag2 == TagsEnum.NO_TAG and course.tag3 == TagsEnum.NO_TAG and course.equivalent_to is None:
            notConsidered[course.name] = 'Not_Considered'
            notConsideredCounter += 1
    
    notConsidered["ratio"] = f"{notConsideredCounter} out of {len(student.taken_courses)}"

    response['technicalElectives']  = techElec
    response['concentrationAreaElectives'] = concAreaElec
    response['labElectives'] = labElec
    response['mathElectives'] = mathElec
    response['scienceElectives'] = sciElec
    response['naturalSciences'] = ns
    response['humanities1'] = hum1
    response['humanities2'] = hum2
    response['socialSciences1'] = ss1
    response['socialSciences2'] = ss2
    response['arabicCommunicationSkills'] = ar
    response['notConsidered'] = notConsidered