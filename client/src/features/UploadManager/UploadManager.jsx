
import Dropzone from "../../components/Dropzone/Dropzone.jsx";

export default function UploadManager({ handleUpload, handleRejected, loading }) {

  const handleOnDrop = (acceptedFiles, fileRejections) => {
    if (loading) return;

    const accepted = acceptedFiles.map((file) => ({
      file: file,
      filename: file.path,
      stage: "upload",
      approved: true,
      summary: "Arquivo aceito para validação",
      checks: [
        {
          name: "Formato",
          value: "Válido",
          status: "ok",
          errors: null,
        },
      ],
    }));

    const rejected = fileRejections.map((rejection) => ({
      file: rejection.file,
      filename: rejection.file.path,
      stage: "upload",
      approved: false,
      summary: "Falha na Validação da imagem",
      checks: [
        {
          name: "Formato",
          value: "Inválido",
          status: "error",
          errors: [
            {
              code: rejection.errors.map((e) => e.message),
              message: "O arquivo deve ser uma imagem.",
            },
          ],
        },
      ],
    }));

    const normalizedFiles = [...accepted, ...rejected];

    const validFiles = normalizedFiles
      .filter((f) => f.approved)
      .map((f) => f.file);

    const invalidFiles = normalizedFiles.filter(
      (f) => f.checks[0].status === "error",
    );

    if (validFiles.length > 0) {
      handleUpload(validFiles);
    }

    if (invalidFiles.length > 0) {
      handleRejected(invalidFiles);
    }

  };

  return (
    <div>
      <Dropzone
        handleOnDrop={handleOnDrop}
        multiple={true}
        accept={{
          "image/jpeg": [],
          "image/jpg": [],
          "image/png": [],
        }}
      ></Dropzone>
    </div>
  );
}
