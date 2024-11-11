'use client';

import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { Supabase } from '@/app/lib/supabase';
import { useSearchParams } from "next/navigation";

interface PDFFile {
  name: string;
  url: string;
  thumbnail: string;  // URL to the thumbnail image
}

const PDFSearchResults: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPdf, setSelectedPdf] = useState<PDFFile | null>(null); // For displaying selected PDF
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchPdfFiles = async () => {
      const { data, error } = await Supabase
        .storage
        .from('uploads')
        .list('books', { limit: 100, offset: 0 });
      console.log("the returned data is: ", data)
      if (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
        return;
      }

      // Get public URLs for each file and their thumbnail
      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await Supabase
            .storage
            .from('uploads')
            .getPublicUrl(`books/${file.name}`);
          
          // Assuming you have a folder for thumbnails (could be separate or auto-generated)
          const { data: thumbnailData } = await Supabase
            .storage
            .from('uploads')
            .getPublicUrl(`thumbnails/${file.name.split('.')[0]}.png`); // Assuming the thumbnail is named like file but with .jpg

          return {
            name: file.name,
            url: urlData?.publicUrl || "",
            thumbnail: thumbnailData?.publicUrl || "", // Thumbnail URL
          };
        })
      );

      setPdfFiles(filesWithUrls);
      setLoading(false);
    };

    fetchPdfFiles();
  }, []);

  useEffect(() => {
    if (query === "all"){
      setFilteredFiles(pdfFiles);
    }
    else if (query) {
      const fuse = new Fuse(pdfFiles, {
        keys: ['name'],
        threshold: 0.3,  // Adjust this value to control how fuzzy the search is
      });

      const results = fuse.search(query).map(result => result.item);
      setFilteredFiles(results);
    } else {
      setFilteredFiles(pdfFiles);  // Show all files if no query is entered
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
      ) : filteredFiles.length === 0 ? (
        <p className="text-neutral-500 text-lg mt-4">No results found.</p>
      ) : selectedPdf ? (
        // Display the full PDF when a thumbnail is clicked
        <div>
          <button onClick={() => setSelectedPdf(null)} className="mb-4 text-blue-700">Back to Search Results</button>
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
          <div
            key={file.name}
            className="w-full flex items-center justify-center p-4"
          >
            <img
              src={file.thumbnail}
              alt={`${file.name} thumbnail`}
              className="w-64 h-80 object-cover rounded-lg border-8 border-white cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => handleThumbnailClick(file)}
            />
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default PDFSearchResults;
