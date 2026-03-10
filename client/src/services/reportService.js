export function generateCsvData(results) {
    const header = ["sep=,\nNome do Arquivo", "Aprovado", "Extensao", "Tamanho", "Dimensoes", "Motivo do Erro"];
    let csvData;

    const data = results.map(r => {
        const approved = r.approved ? "Aprovado" : "Reprovado";
        let extension = "Extensao: undefined";
        let size = "Tamanho: undefined";
        let dimensions = "Dimensoes: undefined";
        let errors = [];

        r.checks.forEach(c => {
            if (c.name === "Formato") extension = c.value;
            if (c.name === "Tamanho") size = c.value;
            if (c.name === "Dimensões") dimensions = c.value;

            if (c.errors && c.errors.length > 0) {
                errors.push(...c.errors.map(e => e.message));
            }
        });

        return [
            r.filename,
            approved,
            extension,
            size,
            dimensions,
            errors.join(" | ")
        ].join(",");
    });

    csvData = [header, ...data].join("\n");

    return csvData;
}

export default function exportCsvData(results) {
    const csv = generateCsvData(results)
    const blob = new Blob([csv], { type: "text/csv" });
    const tempUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = tempUrl;
    a.download = "relatorio_validai.csv";
    a.click();
}