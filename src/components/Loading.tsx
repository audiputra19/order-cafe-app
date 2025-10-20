import type { FC } from "react";

export const Loading: FC = () => {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
                <div className="w-10 h-10 border-4 border-t-transparent border-green-500 rounded-full animate-spin" />
            </div>
        </>
    )
}