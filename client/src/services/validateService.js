import api from "./api"

const MAX_CONCURRENT_UPLOADS = 3;

export default async function uploadImage(files, setProgress, filters) {

    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;

    let completedFiles = 0;
    let overallProgress = 0;

    setProgress(0);

    async function uploadSingleFile(file) {
        const formData = new FormData();
        formData.append("files", file);

        if (filters.max_size_mb != null) {
            formData.append("max_size_mb", filters.max_size_mb);
        }
        if (filters.expected_width != null) {
            formData.append("expected_width", filters.expected_width);
        }
        if (filters.expected_height != null) {
            formData.append("expected_height", filters.expected_height);
        }
        if (filters.expected_extensions != null) {
            formData.append("expected_extensions", filters.expected_extensions);
        }

        return api.post("/validate", formData, {
            onUploadProgress: (event) => {
                if (!event.total) return;

                const percent = event.loaded / event.total;

                const totalPercent = ((completedFiles + percent) / totalFiles) * 100;
                setProgress(Math.round(totalPercent));
            }
        });
    }

    const uploadQueue = [...fileArray];
    const results = [];

    async function worker() {
        while (uploadQueue.length > 0) {
            const file = uploadQueue.shift();

            try {
                const response = await uploadSingleFile(file);
                results.push(...response.data.results);
            } catch (error) {
                console.error("Error on file: ", file.name, error);
                results.push({ 
                    filename: file.name,
                    approved: false,
                    summary: "Erro no upload",
                })
            }

            completedFiles++;
            overallProgress = (completedFiles / totalFiles) * 100;
            setProgress(Math.round(overallProgress));
        }
    }

    const workers = [];
    for (let i = 0; i < MAX_CONCURRENT_UPLOADS; i++) {
        workers.push(worker());
    }

    await Promise.all(workers);
    
    return results;
}