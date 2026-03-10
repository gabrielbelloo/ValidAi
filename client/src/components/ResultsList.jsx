import React from "react";

export default function ResultsList({ results, summary }) {

  return (
    <div className="overflow-x-auto">
      {summary.total > 0 ? (
        <div className="p-5 flex justify-between w-full text-gray-100 font-medium">
          <p>
            <span className="text-xl">Σ </span> Total: {summary.total}
          </p>
          <p className="text-[#66ff00] flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill=""
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#66ff00"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            Aprovados: {summary.approved}
          </p>
          <p className="text-[#ff0000] flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#ff0000"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            Rejeitados: {summary.failed}
          </p>
        </div>
      ) : (
        <></>
      )}

      <table className={`w-full h-full text-sm text-left border-collapse overflow-hidden text-gray-500 dark-text-gray-400 ${summary.total > 0 ? "" : "hidden"}`}>
        <thead className="text-sm text-black uppercase dark:text-gray-300 bg-gray-50 dark:bg-gray-600/65 h-12">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-l-md">
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
        <tbody className="font-normal text-base text-gray-300">
          {results.map((item, index) => {

            return (
              <tr
                key={item.filename || index}
                className="border-b-2 dark:border-gray-600/65"
              >
                <td scope="row" className="px-6 h-18">
                  {item.approved ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill=""
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#66ff00"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#ff0000"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </td>

                <td className="flex h-full items-center gap-2 px-6 py-3">
                  <img
                    src={`http://localhost:8000${item.file_url}`}
                    className="w-10 rounded-xs mr-3"
                  />

                  <p>{item.filename}</p>
                </td>

                <td className="px-6 py-3">
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

                <td className="px-6 py-3 text-[0.91em]">
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
