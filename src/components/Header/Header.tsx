export default function Header() {
  return (
    <section className="flex justify-between  w-full font-sans text-d-purple text-xl font-extrabold">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center justify-center bg-d-pink rounded-lg text-white p-1 leading-none aspect-square">
          <i className="fa-regular fa-sun"></i>
        </div>
        <h2 className="text-xl">my time</h2>
      </div>
    </section>
  );
}
