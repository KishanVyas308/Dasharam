import React from 'react';
import { motion } from 'framer-motion';

interface ConformDeletePopUpProps {
    show: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

const ConformDeletePopUp = ({ show, handleClose, handleConfirm } : ConformDeletePopUpProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg shadow-lg p-6"
            >
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <div className="py-4">
                    Are you sure you want to delete this item?
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConformDeletePopUp;