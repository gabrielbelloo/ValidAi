import api from "./api"

export default async function convertImage(file_ids, filters){


        const file_idArray = Array.from(file_ids);

        const payload = {
            file_ids: file_idArray,
            ...filters
        };

        console.log(payload)

        const { data } = await api.post("/convert", payload, {
            responseType: "blob"
        });

        console.log(data)

        return data
}