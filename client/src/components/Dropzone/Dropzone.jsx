
import { useDropzone } from "react-dropzone";
import { RefreshIcon, UploadIcon } from "../../assets/icons/index.js"

export default function Dropzone({ multiple, accept, handleOnDrop, loading }) {

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  multiple: multiple,
  accept,

  onDrop: handleOnDrop
});

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center backdrop-blur-xl bg-black/10 outline outline-gray-700/50 text-gray-400 text-lg xl:text-lg px-8 py-16 rounded-2xl border border-white/20 cursor-pointer hover:border-gray-500 hover:bg-black/25 transition-colors text-center ${isDragActive ? "bg-black/25 border-gray-500" : ""}`}
    >
      <input {...getInputProps()} />

      {loading ? (
        <>
          <RefreshIcon />
          <p>Validando imagem...</p>
        </>
      ) : isDragActive ? (
        <>
          <UploadIcon />
          <p>Solte a imagem aqui...</p>
        </>
      ) : (
        <>
          <UploadIcon />
          <p>
            Arraste uma ou mais imagens ou pastas aqui, ou clique para
            selecionar
          </p>
        </>
      )}
    </div>
  );
}