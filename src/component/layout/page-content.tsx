import type {ReactNode} from 'react';

const PageContent = (
    {
        toolBar,
        pageNav,
        children
    }: {
        toolBar?: ReactNode,
        pageNav?: ReactNode,
        children?: ReactNode
    }
) => {
    return (
        <>
            {toolBar &&
                <div className="flex flex-row justify-start items-center w-full">
                    {toolBar}
                </div>
            }
            <div className="w-full flex flex-col grow min-h-0">
                <div className="w-full overflow-auto grow min-h-0">
                    {children}
                </div>
            </div>
            {pageNav &&
                <div className="flex flex-row justify-center items-center w-full">
                    {pageNav}
                </div>
            }
        </>
    )
}

export default PageContent;
