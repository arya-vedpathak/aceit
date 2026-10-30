/** Slow-moving blurred colour blobs behind everything. Purely decorative. */
export default function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="grain" />
    </div>
  );
}
