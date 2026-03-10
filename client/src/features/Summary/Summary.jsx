import { CheckIcon, XMarkIcon } from "../../assets/icons/index.js";
import IconButton from "../../components/IconButton/IconButton.jsx";

export default function Summary({ summary }) {
  return (
    <div className="overflow-x-visible">
        <div className="flex gap-8 font-medium">
          <span className="text-2xl font-normal">
            <IconButton icon="Σ"
             tooltip="Total de arquivos processados">
              {" "}<span className="text-base font-medium">{summary.total}</span>
            </IconButton>
          </span>

          <IconButton
            icon={<CheckIcon />}
            tooltip="Total de arquivos aprovados"
          >
            {summary.approved}
          </IconButton>

          <IconButton
            icon={<XMarkIcon />}
            tooltip="Total de arquivos reprovados"
          >
            {summary.failed}
          </IconButton>
        </div>
    </div>
  );
}
