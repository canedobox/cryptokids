const Card = ({ headerTitle, headerInfo, headerCta, children }) => {
  return (
    <div className="bg-slate-100 border-2 border-slate-200 rounded-lg p-4">
      <div className="flex flex-crow w-full items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
        {/* Header title */}
        {headerTitle && <h2 className="text-xl font-medium">{headerTitle}</h2>}
        {/* Header info */}
        {headerInfo && (
          <span className="bg-slate-300 font-bold px-4 py-2 rounded-lg">
            {headerInfo}
          </span>
        )}
        {/* Call to action */}
        {headerCta && (
          <button
            type="submit"
            onClick={headerCta.onClick}
            className="bg-slate-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-500"
          >
            {headerCta.label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Card;
