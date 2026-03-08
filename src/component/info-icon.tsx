import {useState} from 'react';
import {isBlank} from './index.ts';

const InfoIcon = ({info}: { info?: string }) => {
    const [open, setOpen] = useState(false);

    if (!info) {
        return null;
    }

    return (
        <div className="relative inline-flex">
            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setOpen(!open)}
                onBlur={() => setOpen(false)}
            >
                <span className="icon-[lucide--info] text-base"></span>
            </button>
            {open && !isBlank(info) &&
                <div
                    className="absolute left-0 top-full z-10 mt-2 max-w-xs rounded-md bg-base-200 p-2 text-xs text-base-content shadow"
                >
                    {info}
                </div>
            }
        </div>
    )
}

export default InfoIcon;
