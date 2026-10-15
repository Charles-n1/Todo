// A black PNG icon, repainted in any color. (React Native: <Image style={{ tintColor }}>)
// Trick: the PNG is used as a stencil ("mask"), and the color is painted through it.
export default function Icon({ src, color, size, style }) {
  const mask = 'url("' + src + '") center / contain no-repeat';
  return (
    <span
      style={{
        display: 'block',
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMask: mask,
        mask: mask,
        ...style,
      }}
    />
  );
}
