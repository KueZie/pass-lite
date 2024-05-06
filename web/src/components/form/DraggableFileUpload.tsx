import { DragEvent, useEffect, useRef, useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons"

interface DraggableFileUploadProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
}

export const DraggableFileUpload = ({
  onFiles,
}: DraggableFileUploadProps) => {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      onFiles(files);
    }
  }, [files, onFiles]);

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);

    console.log(event)

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error("There was an issue reading the file.");
      };

      reader.readAsDataURL(file);
      return reader;
    });

  };

  const handleClick = () => {
    inputRef.current?.click();
  }

  return (
    <div
      className={`relative w-full h-44 ${files.length ? '': 'cursor-pointer'} ${isOver ? 'border-solid border-[6px] bg-primary-foreground' : 'border-dashed border-2 bg-primary-foreground/50'} border-secondary  rounded-lg flex flex-col justify-center items-center`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        {files.length === 0 ? (
          <>
            <p><input
              className="opacity-0 hidden"
              type="file"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                setFiles(files);
              }}
              ref={inputRef} />
              <span
                className="cursor-pointer text-[#4070f4]"
              >
                Click to upload</span>{" "}or drag and drop
            </p>
            <p className="text-xs">ZIP (MAX. 50GB)</p>
          </>

        ) : (
          <>
            <p className="text-xs">Files uploaded</p>
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 align-baseline">
                <span>{file.name}</span>
                <span
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="cursor-pointer text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />               
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>

  );
}
