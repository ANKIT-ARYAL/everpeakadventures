interface Props {
  src?: string | null;
  alt?: string;
}

export default function RouteMapImage({ src, alt = 'Route map' }: Props) {
  if (!src) return null;
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
}