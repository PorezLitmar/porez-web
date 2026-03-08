import {useState} from 'react';
import type {ProductImage} from '../../api/model/porez';

const OrderImage = ({productImage, generateImageInProgress}: {
    productImage?: ProductImage,
    generateImageInProgress: boolean
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <div className="flex flex-col w-full h-full min-h-0">
            {/* CARD / PREVIEW THUMBNAIL */}
            <div className="flex flex-col w-full flex-1 min-h-0">
                <div className="flex flex-row items-center">
                    <span className="fieldset-legend text-xs w-full">Obrázok dielca</span>

                    <button
                        type="button"
                        title="Zobraziť náhľad"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setPreviewOpen(true)}
                    ><span className="icon-[lucide--eye] text-base"></span>
                    </button>
                </div>

                <div className="flex w-full flex-1 min-h-0 overflow-hidden items-center justify-center border border-base-300 rounded">
                    {generateImageInProgress || productImage === undefined ? (
                        <div className="flex grow items-center justify-center w-full h-full min-h-0">
                            <span className="loading loading-xl loading-spinner text-primary"></span>
                        </div>
                    ) : (
                        <img
                            src={productImage.image}
                            alt="Obrázok dielca"
                            className="block object-contain h-full w-auto max-w-full"
                        />
                    )}
                </div>
            </div>

            {/* FULLSCREEN PREVIEW */}
            {previewOpen && productImage && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                    <div
                        className="bg-white rounded-lg shadow-lg max-w-[95vw] max-h-[95vh] w-auto p-3 flex flex-col">
                        <div className="flex items-center mb-2">
                            <span className="text-sm w-full">Náhľad dielca</span>
                            <button
                                type="button"
                                title="Zavrieť náhľad"
                                className="btn btn-ghost btn-sm"
                                onClick={() => setPreviewOpen(false)}
                            ><span className="icon-[lucide--x] text-base"></span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <img
                                src={productImage.image}
                                alt="Obrázok dielca"
                                className="block max-w-none h-auto"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderImage;
