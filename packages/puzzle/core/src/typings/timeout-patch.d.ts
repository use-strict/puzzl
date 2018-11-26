// setTimeout/setInterval function declarations that don't conflict with lib.d.ts or node.d.ts

interface NodeTimer {
    ref(): void;
    unref(): void;
}

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
declare function clearTimeout(timeoutId: NodeTimer|number): void;
declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
declare function clearInterval(intervalId: NodeTimer|number): void;
