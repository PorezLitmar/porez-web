import {type ReactNode, useState} from 'react';

interface Tab {
    name: string,
    node: ReactNode
}

const Tabs = (
    {
        tabs
    }: {
        tabs: Tab[]
    }
) => {

    const [index, setIndex] = useState(0);

    return (
        <>
            <div role="tablist" className="tabs tabs-bordered">
                {
                    tabs.map((tab, i) =>
                        <a
                            key={i}
                            role="tab"
                            onClick={() => setIndex(i)}
                            className={`tab text-xs ${i === index ? 'tab-active' : ''}`}
                        >
                            {tab.name}
                        </a>
                    )
                }
            </div>

            {tabs.length > index && tabs[index].node}
        </>
    )
}

export default Tabs;