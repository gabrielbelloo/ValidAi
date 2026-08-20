import InputSelectBase from "../../components/InputSelectBase/InputSelectBase.jsx";

export default function Filter({ handleFilters }) {

  return (
    <div className="@container w-full grid grid-cols-2 gap-2 gap-x-5 sm:flex sm:flex-row sm:gap-10 sm:justify-between">
      <InputSelectBase
        as="input"
        type="text"
        name="max_size_mb"
        label="Tam. máx. (MB)"
        required={true}
        placeholder="Ex: 5"
        onChange={handleFilters}
      ></InputSelectBase>

        <InputSelectBase
          as="input"
          type="text"
          name="expected_width"
          label="Largura (px)"
          required={false}
          placeholder="Ex: 1920"
          onChange={handleFilters}
        ></InputSelectBase>

        <InputSelectBase
          as="input"
          type="text"
          name="expected_height"
          label="Altura (px)"
          required={false}
          placeholder="Ex: 1080"
          onChange={handleFilters}
        ></InputSelectBase>

      <InputSelectBase
        as="select"
        name="expected_format"
        label="Formato"
        required={false}
        onChange={handleFilters}
      >
        <option value="" className="bg-gray-800">
          Não filtrar
        </option>
        <option value="jpg" className="bg-gray-800">
          jpg
        </option>
        <option value="jpeg" className="bg-gray-800">
          jpeg
        </option>
        <option value="png" className="bg-gray-800">
          png
        </option>
      </InputSelectBase>
    </div>
  );
}
