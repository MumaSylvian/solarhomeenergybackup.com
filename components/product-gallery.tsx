'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { hasCompleteProductFrame } from '@/lib/product-image-quality';

type ProductGalleryProps = { name: string; images?: string[]; fallbackImage?: string | null };

export function ProductGallery({ name, images = [], fallbackImage }: ProductGalleryProps) {
  const gallery = useMemo(() => [...new Set([...images, fallbackImage].filter((image): image is string => Boolean(image)))], [fallbackImage, images]);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageFrame, setImageFrame] = useState<'checking' | 'approved' | 'rejected'>('checking');
  if (gallery.length === 0) return <div className="detail-art photo-pending"><span>SolarHome Energy Backup</span><strong>Image unavailable</strong><small>Contact us for product photography.</small></div>;
  const select = (index: number) => { setImageFrame('checking'); setActive((index + gallery.length) % gallery.length); };
  if (imageFrame === 'rejected') return <div className="detail-art photo-pending"><span>SolarHome Energy Backup</span><strong>Image unavailable</strong><small>Complete product photography is not available.</small></div>;
  return <div className="product-gallery"><div className="detail-art"><Image key={gallery[active]} src={gallery[active]} alt={`${name}, image ${active + 1} of ${gallery.length}`} fill sizes="(max-width: 850px) 100vw, 48vw" unoptimized priority style={{ opacity: imageFrame === 'approved' ? 1 : 0 }} onLoad={(event) => setImageFrame(hasCompleteProductFrame(event.currentTarget) ? 'approved' : 'rejected')} onError={() => setImageFrame('rejected')}/><button className="gallery-zoom" type="button" onClick={() => setExpanded(true)} aria-label={`Expand image of ${name}`}><ZoomIn size={18}/></button>{gallery.length > 1 && <><button className="gallery-arrow previous" type="button" onClick={() => select(active - 1)} aria-label="Previous product image"><ChevronLeft size={23}/></button><button className="gallery-arrow next" type="button" onClick={() => select(active + 1)} aria-label="Next product image"><ChevronRight size={23}/></button></>}</div>{gallery.length > 1 && <div className="gallery-thumbnails" aria-label="Product images">{gallery.map((image, index) => <button className={index === active ? 'active' : ''} key={image} type="button" onClick={() => select(index)} aria-label={`Show product image ${index + 1}`}><Image src={image} alt="" fill sizes="96px" unoptimized/></button>)}</div>}{expanded && <dialog className="gallery-dialog" open aria-label={`${name} expanded image`}><button className="gallery-dialog-close" type="button" onClick={() => setExpanded(false)}>Close</button><Image src={gallery[active]} alt={name} fill sizes="100vw" unoptimized/></dialog>}</div>;
}
