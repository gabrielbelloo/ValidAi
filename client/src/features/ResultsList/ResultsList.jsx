import React from "react";
import { CheckIcon, XMarkIcon } from "../../assets/icons";

export default function ResultsList({ results }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={
          "w-full h-full text-sm text-left border-collapse overflow-hidden text-gray-500 dark-text-gray-400"
        }
      >
        <thead className="text-sm text-black uppercase dark:text-gray-300 bg-gray-50 dark:bg-gray-600/65 h-12 hidden sm:table-header-group">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-l-md md:pr-0 lg:pr-6">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Nome do Arquivo
            </th>
            <th scope="col" className="px-6 py-3">
              Informações
            </th>
            <th scope="col" className="px-6 py-3 rounded-r-md">
              Motivos
            </th>
          </tr>
        </thead>
        <tbody className="font-normal text-[1.05em] sm:text-base text-gray-300">
          {results.map((item, index) => {
            return (
              <tr
                key={item.filename || index}
                className="@container grid grid-cols-[auto_auto_auto] min-w-0 sm:table-row bg-gray-600/10 sm:bg-transparent rounded-xl sm:rounded-none p-0 sm:p-0 mb-4 sm:mb-0 border-0 sm:border-b-2  border-gray-600/65"
              >
                <td scope="row" className="col-start-3 row-span-2 justify-self-center self-end scale-150 sm:scale-100 sm:table-cell mr-4 sm:mr-0 sm:pl-6 lg:px-6 h-18">
                  {item.approved ? <CheckIcon /> : <XMarkIcon />}
                </td>

                <td className="col-start-1 sm:flex h-full min-w-25 sm:w-full items-center gap-2 p-4 sm:px-6 sm:py-3">
                  <img
                    src={`http://localhost:8000/api${item.file_url}`}
                    className="w-20 sm:w-15 md:w-16 lg:w-13 rounded-md sm:rounded-lg md:rounded-sm sm:mr-3"
                  />
                  <p className="text-base text-white font-normal hidden sm:block">{item.filename}</p>
                </td>

                <td className="col-start-2 sm:table-cell p-4 pl-0 sm:px-6 sm:py-3">
                  <span className="text-base text-white sm:hidden">{item.filename}</span>
                  {item.checks?.map((check, idx) => {
                    return (
                      <ul key={idx}>
                        <li>
                          <span className="text-[0.91em]">{check.name}</span>:{" "}
                          {check.value || "N/A"}
                        </li>
                      </ul>
                    );
                  })}
                </td>

                <td className="sm:px-6 sm:py-3 text-[0.91em] hidden sm:table-cell">
                  {item.checks?.map((check, idx) => {
                    return (
                      <React.Fragment key={idx}>
                        {check.errors?.length > 0 ? (
                          check.errors.map((error, eidx) => (
                            <ul key={eidx}>
                              <li>{error.message}</li>
                            </ul>
                          ))
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
