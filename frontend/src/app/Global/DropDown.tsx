import { ReactNode } from 'react';

interface DropProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className: string;
    width: number;
    height: number;
    defaultDriection: Direcion; // 수정: 'Direction' -> 'Direcion'
    button: string;
    x?: number;
    y?: number;
}

export enum Direcion {
    UP = 'UP',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    LEFT = 'LEFT'
}

const DropDown = (props: DropProps) => {
    if (!props.open) return null;

    const direction = props.defaultDriection;
    const x = props.x ?? 0;
    const y = props.y ?? 0;

    let position = {} as React.CSSProperties;

    const background = document.getElementById("main")?.getBoundingClientRect();
    const button = document.getElementById(props.button)?.getBoundingClientRect();

    if (background && button) {
        switch (direction) {
            case Direcion.UP:
                position = {
                    top: button.top - background.top - props.height - button.height / 2 - y,
                    left: x + button.left - background.left,
                    width: `${props.width}px`,
                    height: `${props.height}px`
                };
                break;
            case Direcion.DOWN:
                position = {
                    top: button.top - background.top + button.height + y,
                    left: x + button.left - background.left,
                    width: `${props.width}px`,
                    height: `${props.height}px`
                };
                break;
            case Direcion.LEFT:
                position = {
                    left: button.left - background.left - props.width - x,
                    top: button.top - background.top - y,
                    width: `${props.width}px`,
                    height: `${props.height}px`
                };
                break;
            case Direcion.RIGHT:
                position = {
                    left: button.left - background.left + button.width + x,
                    top: button.top - background.top - y,
                    width: `${props.width}px`,
                    height: `${props.height}px`
                };
                break;
        }
    }

    return (
        <div className={`p-2 shadow menu dropdown-content absolute z-[10] ${props.className}`} style={position}>
            {props.children}
        </div>
    );
};

export default DropDown;