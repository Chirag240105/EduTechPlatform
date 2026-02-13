import fs from 'fs/promises'
import {PDFParse} from 'pdf-parse'

export const extractTextFromPdf = async(filePath) =>{
    try{
        const dataBuffer = await fs.readFile(filePath);
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();

        return{
            text: data.text,
            numPages: data.numPages,
            info: data.info, 
        };
    }catch(error){
        console.log("PDF parsing error : ",error)
        throw new Error("Failed to extract text form pdf")
    }
}