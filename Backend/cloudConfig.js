import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage= new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "BookMyEvent",
        allowedFormats: ["jpeg","png","jpg"],
        // transformation:[{width:500,height:500,crop:"limit"}]
    }
});

const upload=multer({ storage ,
    limits : { fileSize: 5 * 1024 * 1024 },
}
);
export { upload };

// export {storage,cloudinary};