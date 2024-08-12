import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

import { IoIosArrowDown } from "react-icons/io";

export function DropdownMenuButton({ options, selected, onClick, className }: { className: string, options: number[], selected: string, onClick: (value: number) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center mb-1">
                    <p className={`text-blue-700 font-bold flex justify-center text-center ${className}`}> {selected}</p> <IoIosArrowDown className="w-4 h-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-2">
                {
                    options.map((option) => {
                        return (
                            <DropdownMenuItem
                                className={`cursor-pointer flex text-lg  ${selected == option.toString() ? 'bg-gray-200 hover:bg-gray-200' : 'hover:bg-gray-200'}`}
                                key={option}
                                onClick={onClick.bind(null, option)}
                            > {option}</DropdownMenuItem>
                        )
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu >
    )
}