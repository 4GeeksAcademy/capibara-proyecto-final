import { useState } from "react";

const UploadImage = ({ onUpload }) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "Shoes_Shoes";

    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            onUpload(data.secure_url); // sends URL back to Admin
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                className="form-control"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleFileChange}
                disabled={uploading}
                
            />
            {uploading && <small className="text-muted mt-1 d-block">Uploading...</small>}
        </div>
    );
};

export default UploadImage;