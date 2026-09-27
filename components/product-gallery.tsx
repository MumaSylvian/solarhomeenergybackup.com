'use client';
/* oxlint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- tapping the photo viewer closes it; the keyboard equivalent is Escape, which the modal <dialog> handles natively. */

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

type ProductGalleryProps = { name: string; images?: string[]; fallbackImage?: string | null };

export function ProductGallery({ name, images = [], fallbackImage }: ProductGalleryProps) {
  const gallery = useMemo(() => [...new Set([...images, fallbackImage].filter((image): image is string => Boolean(image)))], [fallbackImage, images]);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const availableGallery = gallery.filter((image) => !failedImages.includes(image));
  const selected = availableGallery[Math.min(active, Math.max(availableGallery.length - 1, 0))];
  const select = (index: number) => setActive((index + availableGallery.length) % availableGallery.length);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const zoomRef = useRef<HTMLButtonElement>(null);
  // A modal dialog: Escape closes it, focus stays inside, and the page behind cannot be tabbed or scrolled.
  // Closes straight away (not via the dialog's asynchronous "close" event).
  const closeViewer = () => {
    dialogRef.current?.close();
    setExpanded(false);
    zoomRef.current?.focus();
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!expanded || !dialog) return;
    // Escape fires "cancel" on a modal dialog.
    const onCancel = (event: Event) => {
      event.preventDefault();
      dialog.close();
      setExpanded(false);
      zoomRef.current?.focus();
    };
    dialog.addEventListener('cancel', onCancel);
    if (!dialog.open) dialog.showModal();
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [expanded]);
  const markFailed = (image: string) => setFailedImages((current) => current.includes(image) ? current : [...current, image]);
  if (!selected) return <div className="detail-art photo-pending"><span>SolarHome Energy Backup</span><strong>Product photography is being prepared</strong><small>Contact support for product-specific imagery.</small></div>;
  return <div className="product-gallery"><div className="detail-art"><Image key={selected} src={selected} alt={`${name}, image ${Math.min(active + 1, availableGallery.length)} of ${availableGallery.length}`} fill sizes="(max-width: 850px) 100vw, 48vw" unoptimized priority onError={() => markFailed(selected)}/><button ref={zoomRef} className="gallery-zoom" type="button" onClick={() => setExpanded(true)} aria-label={`Expand image of ${name}`}><ZoomIn size={18}/></button>{availableGallery.length > 1 && <><button className="gallery-arrow previous" type="button" onClick={() => select(active - 1)} aria-label="Previous product image"><ChevronLeft size={23}/></button><button className="gallery-arrow next" type="button" onClick={() => select(active + 1)} aria-label="Next product image"><ChevronRight size={23}/></button></>}</div>{availableGallery.length > 1 && <div className="gallery-thumbnails">{availableGallery.map((image, index) => <button className={index === active ? 'active' : ''} key={image} type="button" onClick={() => select(index)} aria-label={`Show product image ${index + 1}`}><Image src={image} alt="" fill sizes="96px" unoptimized onError={() => markFailed(image)}/></button>)}</div>}{expanded && <dialog ref={dialogRef} className="gallery-dialog" aria-label={`${name} expanded image`} onClick={closeViewer}><button className="gallery-dialog-close" type="button" onClick={closeViewer}>Close</button><Image src={selected} alt={name} fill sizes="100vw" unoptimized onError={() => markFailed(selected)}/></dialog>}</div>;
}
