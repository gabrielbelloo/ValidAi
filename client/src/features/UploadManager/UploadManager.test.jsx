import { render, fireEvent } from "@testing-library/react";
import UploadManager from "./UploadManager";

jest.mock("../../components/Dropzone/Dropzone.jsx", () => {
        return ({ handleOnDrop }) => {
            globalThis.__handleOnDrop = handleOnDrop;
            return null;
        };
});


test("chama handleUpload quando arquivos válidos são enviados", () => {
    const handleUpload = jest.fn();
    const handleRejected = jest.fn();

    render(
        <UploadManager
            handleUpload={handleUpload}
            handleRejected={handleRejected}
            loading={false}
        />
    );

    const fakeFile = new File(["img"], "image.png", { type: "image/png" });
    globalThis.__handleOnDrop([fakeFile], []);

    expect(handleUpload).toHaveBeenCalled();
    expect(handleRejected).not.toHaveBeenCalled();
});

test("chama handleRejected quando arquivos inválidos são enviados", () => {
    const handleUpload = jest.fn();
    const handleRejected = jest.fn();

    render(
        <UploadManager
            handleUpload={handleUpload}
            handleRejected={handleRejected}
            loading={false}
        />
    );

    const fakeFile = new File(["exe"], "app.exe", { type: "application/octet-stream"});

    const rejection = {
        file: fakeFile,
        errors: [{ message: "Tipo inválido "}],
    };

    globalThis.__handleOnDrop([], [rejection]);

    expect(handleUpload).not.toHaveBeenCalled();
    expect(handleRejected).toHaveBeenCalled();
});

test("não permite upload quando loading-true", () => {
    const handleUpload = jest.fn();
    const handleRejected = jest.fn();

    render(
        <UploadManager
            handleUpload={handleUpload}
            handleRejected={handleRejected}
            loading={true}
        />
    );

    const fakeFile = new File(["img"], "foto.png", { type: "image/png" });

    globalThis.__handleOnDrop([fakeFile], []);

    expect(handleUpload).not.toHaveBeenCalled();
    expect(handleRejected).not.toHaveBeenCalled();
})