const Pageable = (
    {
        isPrevious,
        previousHandler,
        page,
        totalPages,
        isNext,
        nextHandler,
        disabled = false
    }: {
        isPrevious: boolean,
        previousHandler: () => void,
        page: number,
        totalPages: number,
        isNext: boolean,
        nextHandler: () => void,
        disabled?: boolean
    }) => {
    return (
        <div className="flex flex-row w-full items-center justify-center">
            <div className="join">
                <button
                    className="join-item btn"
                    disabled={disabled || !isPrevious}
                    onClick={previousHandler}
                >
                    <span className="icon-[lucide--chevron-left] text-base"></span>
                </button>

                <span className="join-item btn btn-ghost">Stránka {page} / {totalPages}</span>

                <button
                    className="join-item btn"
                    disabled={disabled || !isNext}
                    onClick={nextHandler}
                >
                    <span className="icon-[lucide--chevron-right] text-base"></span>
                </button>
            </div>
        </div>
    )
}

export default Pageable;
