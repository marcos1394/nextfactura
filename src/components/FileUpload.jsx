// Componente FileUpload
const FileUpload = ({ label, accept, icon: Icon, file, onChange }) => {
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        onChange(selectedFile);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{label}</label>
            <div className="relative">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="sr-only"
                    id={`file-${label}`}
                />
                <label
                    htmlFor={`file-${label}`}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        file 
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                            : 'border-gray-300 bg-gray-50 dark:bg-slate-800 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                            <>
                                <CheckIcon className="w-8 h-8 mb-2 text-green-500" />
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{file.name}</p>
                            </>
                        ) : (
                            <>
                                {Icon ? <Icon className="w-8 h-8 mb-2 text-gray-400" /> : <DocumentIcon className="w-8 h-8 mb-2 text-gray-400" />}
                                <p className="text-xs text-gray-500 dark:text-slate-400 text-center">Click para seleccionar</p>
                            </>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
};
