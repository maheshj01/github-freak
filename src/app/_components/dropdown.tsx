import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

import { IoIosArrowDown } from "react-icons/io";

export function DropdownMenuButton({ options, selected, onClick, className }: { className: string, options: any[], selected: any, onClick: (value: any) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                    <p className={`font-bold flex justify-center text-center ${className}`}> {selected}</p> <IoIosArrowDown className="w-4 h-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-2">
                {
                    options.map((option: string) => {
                        return (
                            <DropdownMenuItem
                                className={`cursor-pointer flex text-lg  ${selected === option ? 'bg-gray-200 text-black hover:bg-gray-200' : 'hover:bg-gray-200'}`}
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