"use client";
import { ReactElement, useRef, useState, Dispatch, SetStateAction } from "react";
import { uploadFile } from "@/app/backend/uploadFile";
import { UserMessage } from "@/app/components/RideAnalyzer";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface UploadFormProps {
    setFitFileName: Dispatch<SetStateAction<string | undefined>>;
    userMessage: UserMessage;
    setUserMessage: Dispatch<SetStateAction<UserMessage>>;
}


const UploadForm: React.FC<UploadFormProps> = ({ setFitFileName, userMessage, setUserMessage }): ReactElement => {

    const fileInput = useRef<HTMLInputElement | null>(null);
    

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('start handleUpload');

        const formData = new FormData();
        if (fileInput.current?.files) {

            const currentFile = fileInput.current.files[0];

            if (currentFile.size > 1000000) {
                setUserMessage({message: 'File is too large. Max file size is 1MB', type: 'error'});
                return;
            }
            if (currentFile.name.slice(-3) !== 'fit') {
                setUserMessage({message: 'File must be a .fit file', type: 'error'});
                return;
            }

            console.log(fileInput.current.files[0]);
            formData.append('file' , fileInput.current?.files[0] as File);

            uploadFile(formData).then(async () => {
                setUserMessage({message: 'File uploaded successfully', type: 'success'});
                setFitFileName(currentFile.name);
                console.log("fitFileName set to: ", currentFile.name);
            }).catch((error) => {
                setUserMessage({message: 'Error uploading file', type: 'error'});
            });
        }

    }

    return (
        <>
            <form onSubmit={handleUpload} className="upload-form">
                <label>
                    <div>Upload .fit file</div>
                    <input type="file" name="file" ref={fileInput} />
                </label>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Upload</button>
            </form>
            {userMessage && <div
                className="upload-form-user-message"
                style={{ color: userMessage.type === 'error' ? 'red' : 'green' }}
                >{userMessage.message}</div>}
        </>
    );
}

export default UploadForm;

// action={uploadFile}