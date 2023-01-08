/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

const crypto = require('crypto');
const hash = crypto.createHash('sha256');


const gradeSheetString = 'grade_sheet';
const certificateString = 'certificate';
const transcriptString = 'transcript';
let courseDetails__ = [
    {
        courseNo: "CSE 2211",
        courseName: "Information System Design",
        creditHours: "2.00",
        letterGrade: "B",
        gradePoint: "3.00",
    },
    {
        courseNo: "CSE 3200",
        courseName: "Web Programming Project",
        creditHours: "1.50",
        letterGrade: "A-",
        gradePoint: "3.50",
    },
    {
        courseNo: "CSE 3201",
        courseName: "Artificial Intellingence",
        creditHours: "3.00",
        letterGrade: "B",
        gradePoint: "3.00",
    },
    {
        courseNo: "CSE 3202",
        courseName: "Artificial Inteligence Laboratory",
        creditHours: "1.50",
        letterGrade: "A-",
        gradePoint: "3.50",
    },
    {
        courseNo: "CSE 3203",
        courseName: "Computer Networks",
        creditHours: "3.00",
        letterGrade: "F",
        gradePoint: "0.00",
    },
]

class AssetTransfer extends Contract {

    async search(ctx, id) {
        const result = await ctx.stub.getState(id);
        if(result && result.length > 0){
            return JSON.parse(result);
        } else {
            return null;
        }
    }

    async findAll(ctx, reg, doctype){
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            let id = record["id"]
            // throw new Error(`Hello ${id}`);
            if(record.doctype === doctype && id.match(reg)!== null){
                allResults.push(record);
            }
            result = await iterator.next();
        }
        return allResults;
    }

    async Init(ctx) {
        let studentID = "180222";
        let name = "Ruhit Arman";
        let year = "1";
        let term = "1";
        let discipline = "CSE";
        let school = "SET";
        let totalCreditHours = 0;
        let totalGradePoints = 0;
        let tgpa = 0;
        let courseCount = 0;
        let session="2019-20";
        let degree="honours";
        let doctype=gradeSheetString;
        for (let i = 1; i<= 8; i++) {
            for (let courseDetail in courseDetails__){
                if(courseDetails__[courseDetail]["letterGrade"] !== 'F'){
                    totalCreditHours += parseFloat(courseDetails__[courseDetail]["creditHours"]);
                    totalGradePoints+=parseFloat(courseDetails__[courseDetail]["gradePoint"]);
                    courseCount++;
                }
            }
            tgpa = totalGradePoints/courseCount;
            let gradeSheetid=gradeSheetString+"_"+i.toString(10)+"_"+studentID+"_honours";
            let gradeSheet = {
                id:gradeSheetid,
                year:year,
                term:term,
                session:session,
                studentID:studentID,
                name:name,
                discipline:discipline,
                school:school,
                courseDetails:courseDetails__,
                totalCreditHours:totalCreditHours,
                tgpa:tgpa,
                degree:degree,
                doctype:doctype
            };
            totalCreditHours = 0;
            totalGradePoints = 0;
            tgpa = 0;
            courseCount = 0;
            
            await ctx.stub.putState(gradeSheet.id, Buffer.from(stringify(sortKeysRecursive(gradeSheet))));
        }

        studentID = "180207";
        name = "Vashkar Kar";
        year = "1";
        term = "1";
        discipline = "CSE";
        school = "SET";
        totalCreditHours = 0;
        totalGradePoints = 0;
        tgpa = 0;
        courseCount = 0;
        session="2019-20";
        degree="honours";
        doctype=gradeSheetString;
        for (let i = 1; i<= 8; i++) {
            for (let courseDetail in courseDetails__){
                if(courseDetails__[courseDetail]["letterGrade"] !== 'F'){
                    totalCreditHours += parseFloat(courseDetails__[courseDetail]["creditHours"]);
                    totalGradePoints+=parseFloat(courseDetails__[courseDetail]["gradePoint"]);
                    courseCount++;
                }
            }
            tgpa = totalGradePoints/courseCount;
            let gradeSheetid=gradeSheetString+"_"+i.toString(10)+"_"+studentID+"_honours";
            let gradeSheet = {
                id:gradeSheetid,
                year:year,
                term:term,
                session:session,
                studentID:studentID,
                name:name,
                discipline:discipline,
                school:school,
                courseDetails:courseDetails__,
                totalCreditHours:totalCreditHours,
                tgpa:tgpa,
                degree:degree,
                doctype:doctype
            };
            totalCreditHours = 0;
            totalGradePoints = 0;
            tgpa = 0;
            courseCount = 0;
            
            await ctx.stub.putState(gradeSheet.id, Buffer.from(stringify(sortKeysRecursive(gradeSheet))));
        }
    }

    async createCertificate(ctx, name, discipline, studentID, degree, completed_year, cgpa, university, doctype){
        if(doctype === certificateString){
            let certificateSearchId = certificateString+"_"+studentID+"_"+degree+"_"+university;
            let result =await this.search(ctx, certificateSearchId);
            if(result !== null){
                throw new Error("Certificate all ready exist");
            } else{
                let certificate = {
                    id:certificateSearchId,
                    name:name,
                    discipline:discipline,
                    degree:degree,
                    completed_year:completed_year,
                    cgpa:cgpa,
                    university:university,
                    doctype:doctype,
                };
                await ctx.stub.putState(certificate.id, Buffer.from(stringify(sortKeysRecursive(certificate))));
                return certificate;
            }
        } else {
            throw new Error("Invalid Document Type");
        }
    }

    async updateCertificate(ctx, name, discipline, studentID, degree, completed_year, cgpa, university, doctype){
        if(doctype === certificateString){
            let certificateSearchId = certificateString+"_"+studentID+"_"+degree+"_"+university;
            let result =await this.search(ctx, certificateSearchId);
            if(result === null){
                throw new Error("Certificate does not exist");
            } else{
                let certificate = {
                    id:certificateSearchId,
                    name:name,
                    discipline:discipline,
                    degree:degree,
                    completed_year:completed_year,
                    cgpa:cgpa,
                    university:university,
                    doctype:doctype,
                };
                await ctx.stub.putState(certificate.id, Buffer.from(stringify(sortKeysRecursive(certificate))));
                return certificate;
            }
        } else {
            throw new Error("Invalid Document Type");
        }
    }

    async queryCertificatebyID(ctx, studentID, degree, university, doctype){
        if(doctype === certificateString){
            let searchID = certificateString+"_"+studentID+"_"+degree+"_"+university;
            let result = await this.search(ctx, searchID);
            if (result != null){
                // return JSON.parse(result);
                return result;
            } else {
                throw new Error("Certificate not found");
            }
        } else{
            throw new Error("Invalid Document Type");
        }
    }


    async verify(ctx, studentID, degree, university, doctype, hashfile){
        if(doctype === certificateString){
            let searchID = certificateString+"_"+studentID+"_"+degree+"_"+university;
            let result = await this.search(ctx, searchID);
            if (result != null){
                const hash = crypto.createHash('sha256');
                let hashval = hash.update(JSON.stringify(result)).digest('hex');
                result.hash = hashval;
                if(hashfile === hashval){
                    return {"message":"The document is authentic"};
                } else {
                    return {"message": "Document not authentic", "val": hashval};
                }
            } else {
                throw new Error(`${doctype} not found`);
            }
        } else{
            throw new Error("Invalid DOcument type");
        }
    }
}

module.exports = AssetTransfer;
