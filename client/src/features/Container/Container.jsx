import { useState, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import uploadImage from "../../services/validateService.js";
import convertImage from "../../services/convertService.js"
import ResultsList from "../ResultsList/ResultsList.jsx";
import UploadManager from "../UploadManager/UploadManager.jsx";
import LoadingBar from "../../components/LoadingBar/LoadingBar.jsx";
import Filter from "../Filter/Filter.jsx";
import exportCsvData from "../../services/reportService.js";
import Summary from "../Summary/Summary.jsx";
import IconButton from "../../components/IconButton/IconButton.jsx";
import {
  DownloadIcon,
  PrinterIcon,
  WandIcon,
} from "../../assets/icons/index.js";

export default function Container() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filters, setFilters] = useState({
    max_size_mb: null,
    expected_width: null,
    expected_height: null,
    expected_format: null,
  });

  const summary = useMemo(() => {
    const total = results.length;
    const approved = results.filter((r) => r.approved === true).length;
    const failed = total - approved;

    return { total, approved, failed };
  }, [results]);

  const handleUpload = async (validFiles) => {
    setLoading(true);
    setResults([]);

    try {
      const data = await uploadImage(validFiles, setProgress, filters);

      setResults((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("handleUpload error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejected = (rejectedFiles) => {
    setResults([]);

    try {
      setResults((prev) => [...prev, ...rejectedFiles]);
    } catch (error) {
      console.error("handleReject error: ", error);
    }
  };

  const handleFilters = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleConvert = async (results) => {

    const invalidFiles = results.filter((f) => !f.approved).map((f) => f.id);

    try{
      const blob = await convertImage(invalidFiles, filters);
      const tempUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = tempUrl;
      a.download = "validai_converted.zip";
      a.click();
    } catch(error){
      console.error("handleConvert error: ", error);
    }
  }

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div className="bg-gray-800/40 p-5 rounded-lg outline outline-gray-700/50 backdrop-blur-sm text-white gap-8 flex flex-col mx-[6%] my-[4%]">
      <Filter handleFilters={handleFilters} />

      <UploadManager
        handleUpload={handleUpload}
        handleRejected={handleRejected}
        loading={loading}
      />

      <div>
        <div className={`${progress > 0 ? "visible" : "invisible hidden"}`}>
          <LoadingBar value={progress} />
        </div>

        <div
          className={`grid gap-4 ${results.length > 0 ? "visible" : "invisible hidden"}`}
        >
          <div className="grid grid-cols-1 grid-rows-2 sm:flex place-items-center sm:justify-between">
            <Summary summary={summary} />

            <div className="grid grid-cols-3 row-start-2 [&>div]:bg-gray-600/10 [&>div]:rounded-lg [&>div]:p-1 [&>div]:sm:bg-transparent [&>div]:sm:rounded-none [&>div]:sm:p-0 sm:flex gap-5">
              <IconButton
                icon={<WandIcon />}
                tooltip={"Converter arquivos inválidos"}
                onClick={() => handleConvert(results)}
                className={"flex-col"}
              >
                <span className="wand flex sm:hidden">Converter</span>
              </IconButton>

              <IconButton
                icon={<DownloadIcon />}
                tooltip={"Exportar CSV"}
                onClick={() => exportCsvData(results)}
                className={"flex-col"}
              >
                <span className="flex sm:hidden">ﾠExportar</span>
              </IconButton>

              <IconButton
                icon={<PrinterIcon />}
                tooltip={"Imprimir Resumo"}
                onClick={handlePrint}
                className={"flex-col"}
              >
                <span className="flex sm:hidden">ﾠImprimir</span>
              </IconButton>
            </div>
          </div>

          <div ref={componentRef}>
            {results && <ResultsList results={results} />}
          </div>
        </div>
      </div>
    </div>
  );
}
