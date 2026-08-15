import { useState, useEffect, useMemo, useCallback } from 'react';
import { ImageBlock, ImageCategory } from '../types/image';
import { imageService } from '../services/imageService';

export function useImageManager(sessionId: string, initialImages: unknown[] = []) {
  // Helper สำหรับแปลงรูปโครงสร้าง Backend -> ImageBlock ของ Frontend
  const normalizeImages = (rawImages: unknown[]): ImageBlock[] => {
    return rawImages.map((img) => {
      const item = img as Record<string, unknown>;
      const metadata = (item.metadata || {}) as Record<string, unknown>;
      const classification = (item.classification || {}) as Record<string, unknown>;

      const id = String(item.id || item.image_id || metadata.image_id || '');

      return {
        id,
        type: 'image',
        original: {
          filename: String(item.filename || metadata.filename || `${id}.png`),
          mime: String(item.mime || metadata.mime || 'image/png'),
          width: (item.width || metadata.width || null) as number | null,
          height: (item.height || metadata.height || null) as number | null,
          size: Number(item.size || item.size_bytes || metadata.size || 0),
        },
        preview: {
          url: imageService.getImageUrl(sessionId, id, 'thumbnail'),
        },
        asset: {
          url: imageService.getImageUrl(sessionId, id, 'original'),
        },
        markdown: {
          alt: String(item.alt || item.alt_text || metadata.alt_text || ''),
          path: String(item.path || item.asset_path || metadata.asset_path || `images/${id}.png`),
        },
        ai: {
          status: (item.ai_status || 'not_analyzed') as ImageBlock['ai']['status'],
          description: (item.ai_description || null) as string | null,
        },
        classification: {
          category: (classification.category || item.category || 'content') as ImageCategory,
          confidence: Number(classification.confidence || 1.0),
          score: Number(classification.score || 1.0),
          reasons: (classification.reasons || []) as string[],
        },
        isDuplicate: Boolean(item.is_duplicate || item.isDuplicate || false),
        duplicateOf: (item.duplicate_of || item.duplicateOf || null) as string | null,
        occurrenceCount: Number(item.occurrence_count || 1),
        pageNumber: (item.page_number || null) as number | null,
      };
    });
  };

  const [images, setImages] = useState<ImageBlock[]>(() => normalizeImages(initialImages));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchImages = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const res = await imageService.getSessionImages(sessionId);
      if (res.images && res.images.length > 0) {
        setImages(normalizeImages(res.images));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (initialImages.length === 0) {
      fetchImages();
    } else {
      setImages(normalizeImages(initialImages));
    }
  }, [sessionId, initialImages, fetchImages]);

  const updateAltText = useCallback((imageId: string, newAlt: string) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === imageId) {
          return {
            ...img,
            markdown: { ...img.markdown, alt: newAlt },
          };
        }
        return img;
      })
    );
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const categoryMatch =
        activeCategory === 'all' ||
        (activeCategory === 'duplicate' && img.isDuplicate) ||
        img.classification?.category === (activeCategory as ImageCategory);

      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        img.id.toLowerCase().includes(searchLower) ||
        img.markdown?.alt?.toLowerCase().includes(searchLower);

      return categoryMatch && searchMatch;
    });
  }, [images, activeCategory, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: images.length,
      content: images.filter((i) => i.classification?.category === 'content').length,
      decorative: images.filter((i) => i.classification?.category === 'decorative').length,
      important: images.filter((i) => i.classification?.category === 'important').length,
      duplicates: images.filter((i) => i.isDuplicate).length,
    };
  }, [images]);

  return {
    images: filteredImages,
    allImages: images,
    stats,
    isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    updateAltText,
    refreshImages: fetchImages,
  };
}