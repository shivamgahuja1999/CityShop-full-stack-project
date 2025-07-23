import multer from "multer";


const storage=multer.memoryStorage();  // store file in RAM temporarily
const upload=multer({storage:storage})

export default upload
