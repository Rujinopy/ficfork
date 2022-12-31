export const CloudImage = async (form_data: FormData) => { 
    const cloudniary_url = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    try {
        const response = await fetch(`${cloudniary_url}/${cloudName}/image/upload`, {
            method: 'POST',
            body: form_data,
        });
        const data = await response.json();
        if (data)

        {return data.secure_url;}
    }
    catch (error) {
        console.log(error);
    }
}