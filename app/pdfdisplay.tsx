import { useEffect, useState } from "react";
import {Supabase} from '@/app/lib/supabase';


interface PDFFile {
  name: string;
  url: string;
}

const PDFPage: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPdfFiles = async () => {
      // Fetch list of files from a specific folder (if needed)
      const { data, error } = await Supabase()
        .storage
        .from('uploads')
        .list('books', { limit: 100, offset: 0 });

      if (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
        return;
      }

      // For each file in the list, get its public URL
      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await Supabase()
            .storage
            .from('your-bucket-name')
            .getPublicUrl(file.name);  // Returns only data, no error

          return {
            name: file.name,
            url: urlData.publicUrl,  // Note: publicUrl not publicURL
          };
        })
      );

      // Filter out null values (files that failed to get a URL)
      setPdfFiles(filesWithUrls.filter((file) => file !== null) as PDFFile[]);
      setLoading(false);
    };

    fetchPdfFiles();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading PDFs...</p>
      ) : (
        <div>
          {pdfFiles.length === 0 ? (
            <p>No PDFs found.</p>
          ) : (
            pdfFiles.map((file) => (
              <div key={file.name} style={{ marginBottom: '20px' }}>
                <h3>{file.name}</h3>
                <iframe
                  src={file.url}
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                ></iframe>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PDFPage;
