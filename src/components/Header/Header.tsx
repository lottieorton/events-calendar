export default function Header() {
  return (
    <section className="flex justify-between p-4 sm:px-6 w-full font-sans text-d-purple text-xl font-extrabold lg:border-b lg:border-border lg:bg-white 3xl:text-2xl">
      <div className="flex items-center gap-1.5 3xl:gap-2.5">
        <div className="flex items-center justify-center bg-secondary rounded-lg text-white p-1 leading-none aspect-square">
          <i className="fa-regular fa-sun"></i>
        </div>
        <h2>my time</h2>
      </div>
    </section>
  );
}
