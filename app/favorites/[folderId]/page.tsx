'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getFavoriteFolderById } from '@/lib/api';
import { FavoriteFolderDetail } from '@/types/favorite';
import { PropertyCard } from '@/app/_components/PropertyCard';
import { AppHeader } from '@/app/_components/AppHeader';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FavoriteFolderDetailPage() {
  const params = useParams();
  const folderId = params.folderId as string;

  const [folder, setFolder] = useState<FavoriteFolderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (folderId) {
      const fetchFolder = async () => {
        setIsLoading(true);
        try {
          const response = await getFavoriteFolderById(folderId);
          setFolder(response);
        } catch (err) {
          setError('Failed to fetch folder details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchFolder();
    }
  }, [folderId]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
      return (
        <div className="text-red-500 text-center flex flex-col items-center justify-center h-64">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (!folder || folder.properties.length === 0) {
      return <div className="text-center text-gray-500">This folder is empty.</div>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {folder.properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showHeartIcon={true}
            href={`/${property.id}?fromFavorites=true&folderId=${folderId}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <AppHeader title="" backPath="/favorites" />
      <div className="container mx-auto px-4 py-8">
        {folder && (
          <h4 className="text-xl font-semibold mb-4">{folder.name}</h4>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
