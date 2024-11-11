'use client';
import { Suspense, useEffect, useState } from "react";
import Fuse from "fuse.js";
import { Supabase } from '@/app/lib/supabase';
import { useSearchParams } from "next/navigation";

interface PDFFile {
  name: string;
  url: string;
  thumbnail: string;
}

const PDFSearchResults: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPdf, setSelectedPdf] = useState<PDFFile | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchPdfFiles = async () => {
      setLoading(true);
      const { data, error } = await Supabase
        .storage
        .from('uploads')
        .list('books', { limit: 100, offset: 0 });
      
      if (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
        return;
      }

      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await Supabase
            .storage
            .from('uploads')
            .getPublicUrl(`books/${file.name}`);
          
          const { data: thumbnailData } = await Supabase
            .storage
            .from('uploads')
            .getPublicUrl(`thumbnails/${file.name.split('.')[0]}.png`);

          return {
            name: file.name,
            url: urlData?.publicUrl || "",
            thumbnail: thumbnailData?.publicUrl || "",
          };
        })
      );

      setPdfFiles(filesWithUrls);
      setLoading(false);
    };

    fetchPdfFiles();
  }, []);

  useEffect(() => {
    if (query === "all") {
      setFilteredFiles(pdfFiles);
    } else if (query) {
      const fuse = new Fuse(pdfFiles, {
        keys: ['name'],
        threshold: 0.3,
      });
      const results = fuse.search(query).map(result => result.item);
      setFilteredFiles(results);
    } else {
      setFilteredFiles(pdfFiles);
    }
  }, [pdfFiles, query]);

  const handleThumbnailClick = (file: PDFFile) => {
    setSelectedPdf(file);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Search Results for: &quot;{query}&quot;</h1>
      
      {loading ? (
        <p>Loading PDFs...</p>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          {filteredFiles.length === 0 ? (
            <p className="text-neutral-500 text-lg mt-4">No results found.</p>
          ) : selectedPdf ? (
            <div>
              <button onClick={() => setSelectedPdf(null)} className="mb-4 text-blue-700">
                Back to Search Results
              </button>
              <iframe
                src={selectedPdf.url}
                width="100%"
                height="700px"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredFiles.map((file) => (
                <div key={file.name} className="w-full flex items-center justify-center p-4">
                  <img
                    src={file.thumbnail}
                    alt={`${file.name} thumbnail`}
                    className="w-64 h-80 object-cover rounded-lg border-8 border-white cursor-pointer"
                    onClick={() => handleThumbnailClick(file)}
                  />
                </div>
              ))}
            </div>
          )}
        </Suspense>
      )}
    </div>
  );
};

export default PDFSearchResults;
