// 'use client';

// import React, { useState, ChangeEvent, FormEvent } from 'react';

// const FileUpload: React.FC = () => {

//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     console.log('handleFileChange');
//     console.log(e.target.files);
//     if (e.target.files && e.target.files.length > 0) {
//         setFile(e.target.files[0]);
//       }
//   };

//   const handleSubmit = async (e: FormEvent): Promise<void> => {
//     e.preventDefault();

//     console.log('handleSubmit');
 
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (res.ok) {
//         const result = await res.json();
//         console.log('File uploaded successfully:', result);
//       } else {
//         console.error('Error uploading file:', res.statusText);
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" onChange={handleFileChange} />
//       <button type="submit">Upload</button>
//     </form>
//   );
// };

// export default FileUpload;
