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


    async createGradeSheet(ctx, gradeSheetNo, year, term, session, studentID, name, discipline, school, courseDetails, degree, doctype){
        
        if(doctype === gradeSheetString){
            let gradeSheetSearchID = gradeSheetString+"_"+gradeSheetNo+"_"+studentID+"_"+degree;
            let gradeSheetResult =await this.search(ctx, gradeSheetSearchID);
            let valid = false;
            if(gradeSheetResult === null){
                let reg = new RegExp("grade_sheet_\\d+_"+studentID+"_"+degree);
                let gradeSheetResults = await this.findAll(ctx, reg, gradeSheetString);
                
                if((await gradeSheetResults).length+1 === parseInt(gradeSheetNo)){
                    valid = true;
                }
                // throw new Error(`${valid}`)
                // valid = true;
                if(valid){
                    let totalCreditHours=0.0;
                    let courseCount = 0;
                    let totalGradePoints = 0;
                    let tgpa = 0;
                    courseDetails = JSON.parse(courseDetails);
                    for (let courseDetail in courseDetails){
                        if(courseDetails[courseDetail]["letterGrade"] !== 'F'){
                            totalCreditHours += parseFloat(courseDetails[courseDetail]["creditHours"]);
                            totalGradePoints+=parseFloat(courseDetails[courseDetail]["gradePoint"]);
                            courseCount++;
                        }
                    }
                    tgpa = totalGradePoints/courseCount;
                    let gradeSheet = {
                        id:gradeSheetSearchID,
                        year:year,
                        term:term,
                        session:session,
                        studentID:studentID,
                        name:name,
                        discipline:discipline,
                        school:school,
                        courseDetails:courseDetails,
                        totalCreditHours:totalCreditHours,
                        tgpa:tgpa,
                        degree:degree,
                        doctype:doctype
                    };
                    await ctx.stub.putState(gradeSheet.id, Buffer.from(stringify(sortKeysRecursive(gradeSheet))));
                    
                    // throw new Error(`${doctype}`)
                    return gradeSheet;
                } else{
                    throw new Error('Invalid Grade Sheet no inserted');
                }
            } else {
                throw new Error('Grade Sheet already exist');
            }
        } else {
            throw new Error('Invalid Document type');
        }
    }

    async updateGradeSheet(ctx, gradeSheetNo, year, term, session, studentID, name, discipline, school, courseDetails, degree, doctype){
        if(doctype === gradeSheetString){
            let gradeSheetSearchID = gradeSheetString+"_"+gradeSheetNo+"_"+studentID+"_"+degree;
            let gradeSheetResult =await this.search(ctx, gradeSheetSearchID);
            let valid = false;
            if(gradeSheetResult !== null){
                // let reg = new RegExp("grade_sheet_\\d+_"+studentID+"_"+degree);
                // let gradeSheetResults = this.findAll(ctx, reg, gradeSheetString);

                // if((await gradeSheetResults).length+1 === parseInt(gradeSheetNo)){
                //     valid = true;
                // }
                // valid = true;
                // if(valid){
                let totalCreditHours=0.0;
                let courseCount = 0;
                let totalGradePoints = 0;
                let tgpa = 0;
                courseDetails = JSON.parse(courseDetails);
                for (let courseDetail in courseDetails){
                    if(courseDetails[courseDetail]["letterGrade"] !== 'F'){
                        totalCreditHours += parseFloat(courseDetails[courseDetail]["creditHours"]);
                        totalGradePoints+=parseFloat(courseDetails[courseDetail]["gradePoint"]);
                        courseCount++;
                    }
                }
                tgpa = totalGradePoints/courseCount;
                let gradeSheet = {
                    id:gradeSheetSearchID,
                    year:year,
                    term:term,
                    session:session,
                    studentID:studentID,
                    name:name,
                    discipline:discipline,
                    school:school,
                    courseDetails:courseDetails,
                    totalCreditHours:totalCreditHours,
                    tgpa:tgpa,
                    degree:degree,
                    doctype:doctype
                };

                await ctx.stub.putState(gradeSheet.id, Buffer.from(stringify(sortKeysRecursive(gradeSheet))));
                return gradeSheet;
                // } else{
                //     throw new Error('Invalid Grade Sheet no inserted');
                // }
            } else {
                throw new Error('Grade Sheet does not exist');
            }
        } else {
            throw new Error('Invalid Document type');
        }
    }

    async querySingleGradeSheetbyID(ctx, studentID, gradeSheetNo, degree, doctype){
        if(doctype === gradeSheetString){
            let searchID = "grade_sheet_"+gradeSheetNo+"_"+studentID+"_"+degree;
            let result = await this.search(ctx, searchID);
            if (result != null){
                // return JSON.parse(result);
                return result;
            } else {
                throw new Error("Gradesheet not found");
            }
        } else{
            throw new Error("Invalid Document Type");
        }
    }

    async queryAllGradeSheetbyID(ctx, studentID, degree, doctype){
        if(doctype === gradeSheetString){
            let reg = new RegExp(doctype+"_\\d+_"+studentID+"_"+degree);
            let results = await this.findAll(ctx, reg, doctype);
            if((await results).length !== 0){
                // return JSON.parse(results);
                return results;
            } else {
                throw new Error(`GradeSheets for this id ${studentID} does not exist`)
            }
        }
        else{
            throw new Error("Invalid Document Type");
        }
    }

    async queryAllGradeSheet(ctx, doctype){
        if(doctype === gradeSheetString){
            let reg = new RegExp(doctype+"_");
            let results = await this.findAll(ctx, reg, doctype);
            if((await results).length !== 0){
                // return JSON.parse(results);
                return results;
            } else {
                throw new Error(`No gradesheets found`)
            }
        }
        else{
            throw new Error("Invalid Document Type");
        }
    }

    async createTranscript(ctx, studentID, degree, session, doctype){
        if(doctype === transcriptString){
            let transcriptSearchId = transcriptString+"_"+studentID+"_"+degree;
            let result =await this.search(ctx, transcriptSearchId);
            if(result !== null){
                throw new Error("Transcript all ready exist");
            } else{
                let reg = new RegExp("grade_sheet_\\d+_"+studentID+"_"+degree);
                let gradeSheetResults = await this.findAll(ctx, reg, gradeSheetString);
    
                if((await gradeSheetResults).length >= 8){
                    
                    let gradeSheets = [];
                    
                    
                    for(let gradeSheetOne in gradeSheetResults){
                        let valueID = gradeSheetResults[gradeSheetOne]["id"];
                        if(valueID.match(reg)!== null){
                            gradeSheets.push(gradeSheetResults[gradeSheetOne]);
                        }
                    }
                    
                    let name = gradeSheets[0]["name"];
                    let discipline = gradeSheets[0]["discipline"];
                    let courseDetails = []
                    let cgpa = 0.0;
                    for(let gradeSheetOne in gradeSheets){
                        courseDetails.push(gradeSheets[gradeSheetOne]["courseDetails"]);
                        cgpa+=parseFloat(gradeSheets[gradeSheetOne]["tgpa"]);
                    }
                    cgpa = cgpa/gradeSheets.length;
                    
                    
                    let transcript = {
                        id: transcriptSearchId,
                        name:name,
                        studentID: studentID, 
                        discipline: discipline,
                        session: session,
                        courseDetails:courseDetails,
                        cgpa: cgpa,
                        doctype: doctype
                    }


    
                    await ctx.stub.putState(transcript.id, Buffer.from(stringify(sortKeysRecursive(transcript))));
                    return transcript;
                } else{
                    throw new Error("Number of Transcript is less than 8, cannot create transcript")
                }
            }
    
        } else {
            throw new Error("Invalid Document Type");
        }
    }

    async updateTranscript(ctx, studentID, degree, session, doctype){
        if(doctype === transcriptString){
            let transcriptSearchId = transcriptString+"_"+studentID+"_"+degree;
            let result = await this.search(ctx, transcriptSearchId);
            if(result === null){
                throw new Error("Transcript does not exist");
            } else{
                let reg = new RegExp("grade_sheet_\\d+_"+studentID+"_"+degree);
                let gradeSheetResults = await this.findAll(ctx, reg, gradeSheetString);

                if((await gradeSheetResults).length >= 8){
                    let gradeSheets = [];
                
                    for(let gradeSheetOne in gradeSheetResults){
                        let valueID = gradeSheetResults[gradeSheetOne]["id"];
                        if(valueID.match(reg)!== null){
                            gradeSheets.push(gradeSheetResults[gradeSheetOne]);
                        }
                    }
                    let name = gradeSheets[0]["name"];
                    let discipline = gradeSheets[0]["discipline"];
                    let courseDetails = []
                    let cgpa = 0.0;
                    for(let gradeSheetOne in gradeSheets){
                        courseDetails.push(gradeSheets[gradeSheetOne]["courseDetails"]);
                        cgpa+=parseFloat(gradeSheets[gradeSheetOne]["tgpa"]);
                    }
                    cgpa = cgpa/gradeSheets.length;
    
                    let transcript = {
                        id: transcriptSearchId,
                        name:name,
                        studentID: studentID, 
                        discipline: discipline,
                        session: session,
                        courseDetails:courseDetails,
                        cgpa: cgpa,
                        doctype: doctype
                    }
    
                    await ctx.stub.putState(transcript.id, Buffer.from(stringify(sortKeysRecursive(transcript))));
                    return transcript;
                } else{
                    throw new Error("Number of Transcript is less than 8, cannot create transcript")
                }
            }
    
        } else {
            throw new Error("Invalid Document Type");
        }
    }

    async querySingleTranscriptbyID(ctx, studentID, degree, doctype){
        if(doctype === transcriptString){
            let searchID = transcriptString+"_"+studentID+"_"+degree;
            let result = await this.search(ctx, searchID);
            if (result != null){
                // return JSON.parse(result);
                return result;
            } else {
                throw new Error("Transcript not found");
            }
        } else{
            throw new Error("Invalid Document Type");
        }
    }

    async queryAllTranscript(ctx, doctype){
        if(doctype === transcriptString){
            let reg = new RegExp(doctype+"_");
            let results = await this.findAll(ctx, reg, doctype);
            if((await results).length !== 0){
                // return JSON.parse(results);
                return results;
            } else {
                throw new Error(`No transcripts found`)
            }
        }
        else{
            throw new Error("Invalid Document Type");
        }
    }

    async createCertificate(ctx, studentID, degree, completed_year, doctype){
        if(doctype === certificateString){
            let certificateSearchId = certificateString+"_"+studentID+"_"+degree;
            let result =await this.search(ctx, certificateSearchId);
            if(result !== null){
                throw new Error("Certificate all ready exist");
            } else{
                let transcriptSearchId = transcriptString+"_"+studentID+"_"+degree;
                let transcriptResult =await this.search(ctx, transcriptSearchId);
                if(transcriptResult === null){
                    throw new Error("Transcript does not exist, cannot create certificate");
                } else {
                    // transcriptResult = JSON.parse(transcriptResult);
                    let name = transcriptResult['name'];
                    let discipline = transcriptResult['discipline'];
                    let cgpa = transcriptResult["cgpa"];

                    let certificate = {
                        id:certificateSearchId,
                        name:name,
                        discipline:discipline,
                        degree:degree,
                        completed_year:completed_year,
                        cgpa:cgpa,
                        doctype:doctype,
                    };
                    await ctx.stub.putState(certificate.id, Buffer.from(stringify(sortKeysRecursive(certificate))));
                    return certificate;
                }
            }
        } else {
            throw new Error("Invalid Document Type");
        }
    }

    async updateCertificate(ctx, studentID, degree, completed_year, doctype){
        if(doctype === certificateString){
            let certificateSearchId = certificateString+"_"+studentID+"_"+degree;
            let result =await this.search(ctx, certificateSearchId);
            if(result === null){
                throw new Error("Certificate does not exist");
            } else{
                let transcriptSearchId = transcriptString+"_"+studentID+"_"+degree;
                let transcriptResult =await this.search(ctx, transcriptSearchId);
                if(transcriptResult === null){
                    throw new Error("Transcript does not exist, cannot create certificate");
                } else {
                    // transcriptResult = JSON.parse(transcriptResult);
                    let name = transcriptResult['name'];
                    let discipline = transcriptResult['discipline'];
                    let cgpa = transcriptResult["cgpa"];

                    let certificate = {
                        id:certificateSearchId,
                        name:name,
                        discipline:discipline,
                        degree:degree,
                        completed_year:completed_year,
                        cgpa:cgpa,
                        doctype:doctype,
                    };
                    await ctx.stub.putState(certificate.id, Buffer.from(stringify(sortKeysRecursive(certificate))));
                    return certificate;
                }
            }
        } else {
            throw new Error("Invalid Document Type");
        }
    }

    async querySingleCertificatebyID(ctx, studentID, degree, doctype){
        if(doctype === certificateString){
            let searchID = certificateString+"_"+studentID+"_"+degree;
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

    async queryAllCertificate(ctx, doctype){
        if(doctype === certificateString){
            let reg = new RegExp(doctype+"_");
            let results = await this.findAll(ctx, reg, doctype);
            if((await results).length !== 0){
                // return JSON.parse(results);
                return results;
            } else {
                throw new Error(`No transcripts found`)
            }
        }
        else{
            throw new Error("Invalid Document Type");
        }
    }

    async verify(ctx, studentID, degree, doctype, hashfile){
        
        if(doctype !== gradeSheetString){
            let searchID = doctype+"_"+studentID+"_"+degree;
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
