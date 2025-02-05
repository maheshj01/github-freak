import { colorThemes, setLegendTheme } from 'src/app/redux/reducers/legendSlice';
import React from 'react';
import { useAppDispatch } from '../hooks/Legend';

const LegendThemeSelector = () => {
    const dispatch = useAppDispatch();
    return (
        <div>
            <div className="flex space-x-2">
                {Object.keys(colorThemes).map((theme) => (
                    <div
                        onClick={() => dispatch(setLegendTheme(theme))}
                        className={`w-6 h-6 rounded-full cursor-pointer border border-gray-200 ${colorThemes[theme][2]}`}
                    />

                ))}
            </div>
        </div>
    );
};

export default LegendThemeSelector;
