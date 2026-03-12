import zipfile, io, os

def compress_to_zip(file_paths):
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as zipf:
        for file_path in file_paths:
                zipf.write(file_path, arcname=os.path.basename(file_path))
    
    zip_buffer.seek(0)
    return zip_buffer